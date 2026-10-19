import { prisma } from "@/lib/db";
import { deriveInvoiceStatus } from "@/lib/documents";

export async function recalculateInvoicePayments(
  invoiceId: string,
  userId: string
) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: { payments: true },
  });

  if (!invoice) return null;

  const amountPaidCents = invoice.payments.reduce(
    (sum: number, payment: { amountCents: number }) =>
      sum + payment.amountCents,
    0
  );

  const status = deriveInvoiceStatus(
    invoice.status,
    invoice.totalCents,
    amountPaidCents,
    invoice.dueDate
  );

  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { amountPaidCents, status },
  });
}
