import { prisma } from "@/lib/db";
import { quotationSchema } from "@/lib/validations";
import { computeTotals } from "@/lib/documents";
import { formItemsToLineInputs, lineItemsForCreate } from "@/lib/line-items";
import { assertClientOwned, assertQuotationOwned } from "@/lib/ownership";
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
    const quotation = await assertQuotationOwned(userId, id);
    return jsonOk({ quotation });
  } catch {
    return jsonError("Quotation not found", 404);
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
    await assertQuotationOwned(userId, id);
  } catch {
    return jsonError("Quotation not found", 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = quotationSchema.safeParse(body);
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
  let validUntil: Date;
  try {
    issueDate = parseDate(parsed.data.issueDate);
    validUntil = parseDate(parsed.data.validUntil);
  } catch {
    return jsonError("Invalid date");
  }

  const quotation = await prisma.$transaction(async (tx) => {
    await tx.quotationItem.deleteMany({ where: { quotationId: id } });
    return tx.quotation.update({
      where: { id },
      data: {
        clientId: parsed.data.clientId,
        status: parsed.data.status,
        issueDate,
        validUntil,
        taxMode,
        subtotalCents: totals.subtotalCents,
        discountCents: totals.discountCents,
        taxCents: totals.taxCents,
        totalCents: totals.totalCents,
        notes: parsed.data.notes ?? null,
        terms: parsed.data.terms ?? null,
        items: {
          create: lineItemsForCreate(parsed.data.items),
        },
      },
      include: { items: true, client: true, invoice: true },
    });
  });

  return jsonOk({ quotation });
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
    await assertQuotationOwned(userId, id);
  } catch {
    return jsonError("Quotation not found", 404);
  }

  await prisma.quotation.delete({ where: { id } });

  return jsonOk({ ok: true });
}
