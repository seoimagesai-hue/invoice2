import { prisma } from "@/lib/db";
import {
  allocateInvoiceNumber,
  assertInvoiceLimit,
} from "@/lib/documents";
import { assertQuotationOwned } from "@/lib/ownership";
import { jsonError, jsonOk, requireAuthUserId } from "@/lib/api-utils";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  let quotation;
  try {
    quotation = await assertQuotationOwned(userId, id);
  } catch {
    return jsonError("Quotation not found", 404);
  }

  if (quotation.status !== "ACCEPTED") {
    return jsonError("Only accepted quotations can be converted to an invoice", 400);
  }

  if (quotation.invoice) {
    return jsonError("This quotation has already been converted", 409);
  }

  try {
    await assertInvoiceLimit(userId);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Invoice limit reached",
      403
    );
  }

  const dueDate = new Date(quotation.validUntil);
  if (dueDate < new Date()) {
    dueDate.setDate(dueDate.getDate() + 30);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const number = await allocateInvoiceNumber(tx, userId);
      const invoice = await tx.invoice.create({
        data: {
          userId,
          clientId: quotation.clientId,
          quotationId: quotation.id,
          number,
          status: "DRAFT",
          issueDate: new Date(),
          dueDate,
          currency: quotation.currency,
          taxMode: quotation.taxMode,
          subtotalCents: quotation.subtotalCents,
          discountCents: quotation.discountCents,
          taxCents: quotation.taxCents,
          totalCents: quotation.totalCents,
          notes: quotation.notes,
          paymentTerms: quotation.terms,
          items: {
            create: quotation.items.map((item: (typeof quotation.items)[number]) => ({
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

      const updatedQuotation = await tx.quotation.update({
        where: { id: quotation.id },
        data: {
          status: "CONVERTED",
          convertedAt: new Date(),
        },
      });

      return { invoice, quotation: updatedQuotation };
    });

    return jsonOk(result, 201);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Conversion failed",
      500
    );
  }
}
