import { prisma } from "@/lib/db";
import { paymentSchema } from "@/lib/validations";
import { toCents } from "@/lib/money";
import { recalculateInvoicePayments } from "@/lib/invoice-payments";
import {
  jsonError,
  jsonOk,
  parseDate,
  requireAuthUserId,
  zodErrorMessage,
} from "@/lib/api-utils";

export async function GET(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoiceId")?.trim();

  const payments = await prisma.payment.findMany({
    where: {
      userId,
      ...(invoiceId ? { invoiceId } : {}),
    },
    include: {
      invoice: { select: { id: true, number: true, clientId: true } },
    },
    orderBy: { paidAt: "desc" },
  });

  return jsonOk({ payments });
}

export async function POST(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: parsed.data.invoiceId, userId },
  });
  if (!invoice) {
    return jsonError("Invoice not found", 404);
  }

  let paidAt: Date;
  try {
    paidAt = parseDate(parsed.data.paidAt);
  } catch {
    return jsonError("Invalid date");
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      invoiceId: parsed.data.invoiceId,
      amountCents: toCents(parsed.data.amount),
      paidAt,
      method: parsed.data.method ?? null,
      reference: parsed.data.reference ?? null,
      notes: parsed.data.notes ?? null,
    },
  });

  const updatedInvoice = await recalculateInvoicePayments(
    parsed.data.invoiceId,
    userId
  );

  return jsonOk({ payment, invoice: updatedInvoice }, 201);
}
