import { prisma } from "@/lib/db";
import {
  allocateInvoiceNumber,
  assertInvoiceLimit,
} from "@/lib/documents";
import { assertInvoiceOwned } from "@/lib/ownership";
import { jsonError, jsonOk, requireAuthUserId } from "@/lib/api-utils";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  let source;
  try {
    source = await assertInvoiceOwned(userId, id);
  } catch {
    return jsonError("Invoice not found", 404);
  }

  try {
    await assertInvoiceLimit(userId);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Invoice limit reached",
      403
    );
  }

  const invoice = await prisma.$transaction(async (tx) => {
    const number = await allocateInvoiceNumber(tx, userId);
    return tx.invoice.create({
      data: {
        userId,
        clientId: source.clientId,
        number,
        status: "DRAFT",
        issueDate: new Date(),
        dueDate: source.dueDate,
        currency: source.currency,
        taxMode: source.taxMode,
        subtotalCents: source.subtotalCents,
        discountCents: source.discountCents,
        taxCents: source.taxCents,
        totalCents: source.totalCents,
        amountPaidCents: 0,
        notes: source.notes,
        paymentTerms: source.paymentTerms,
        items: {
          create: source.items.map((item: (typeof source.items)[number]) => ({
            description: item.description,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            discountPercent: item.discountPercent,
            taxRate: item.taxRate,
            sortOrder: item.sortOrder,
          })),
        },
      },
      include: { items: true, client: true },
    });
  });

  return jsonOk({ invoice }, 201);
}
