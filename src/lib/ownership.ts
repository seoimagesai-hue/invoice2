import { prisma } from "@/lib/db";

export async function assertClientOwned(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });
  if (!client) {
    throw new Error("CLIENT_NOT_FOUND");
  }
  return client;
}

export async function assertInvoiceOwned(userId: string, invoiceId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: { items: true, client: true },
  });
  if (!invoice) {
    throw new Error("INVOICE_NOT_FOUND");
  }
  return invoice;
}

export async function assertQuotationOwned(
  userId: string,
  quotationId: string
) {
  const quotation = await prisma.quotation.findFirst({
    where: { id: quotationId, userId },
    include: { items: true, client: true, invoice: true },
  });
  if (!quotation) {
    throw new Error("QUOTATION_NOT_FOUND");
  }
  return quotation;
}
