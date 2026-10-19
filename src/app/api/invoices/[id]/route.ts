import { prisma } from "@/lib/db";
import { invoiceSchema } from "@/lib/validations";
import { computeTotals } from "@/lib/documents";
import { formItemsToLineInputs, lineItemsForCreate } from "@/lib/line-items";
import { assertClientOwned, assertInvoiceOwned } from "@/lib/ownership";
import {
  jsonError,
  jsonOk,
  parseDate,
  requireAuthUserId,
  zodErrorMessage,
} from "@/lib/api-utils";
import type { TaxMode } from "@/lib/money";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  try {
    const invoice = await assertInvoiceOwned(userId, id);
    return jsonOk({ invoice });
  } catch {
    return jsonError("Invoice not found", 404);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  try {
    await assertInvoiceOwned(userId, id);
  } catch {
    return jsonError("Invoice not found", 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  try {
    await assertClientOwned(userId, parsed.data.clientId);
  } catch {
    return jsonError("Client not found", 404);
  }

  const taxMode = parsed.data.taxMode as TaxMode;
  const totals = computeTotals(formItemsToLineInputs(parsed.data.items), taxMode);

  let issueDate: Date;
  let dueDate: Date;
  try {
    issueDate = parseDate(parsed.data.issueDate);
    dueDate = parseDate(parsed.data.dueDate);
  } catch {
    return jsonError("Invalid date");
  }

  const invoice = await prisma.$transaction(async (tx) => {
    await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return tx.invoice.update({
      where: { id },
      data: {
        clientId: parsed.data.clientId,
        status: parsed.data.status,
        issueDate,
        dueDate,
        taxMode,
        subtotalCents: totals.subtotalCents,
        discountCents: totals.discountCents,
        taxCents: totals.taxCents,
        totalCents: totals.totalCents,
        notes: parsed.data.notes ?? null,
        paymentTerms: parsed.data.paymentTerms ?? null,
        items: {
          create: lineItemsForCreate(parsed.data.items),
        },
      },
      include: { items: true, client: true, payments: true },
    });
  });

  return jsonOk({ invoice });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  try {
    await assertInvoiceOwned(userId, id);
  } catch {
    return jsonError("Invoice not found", 404);
  }

  await prisma.invoice.delete({ where: { id } });

  return jsonOk({ ok: true });
}
