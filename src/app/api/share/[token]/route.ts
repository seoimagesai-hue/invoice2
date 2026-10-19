import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  if (!token) {
    return jsonError("Not found", 404);
  }

  const invoice = await prisma.invoice.findFirst({
    where: { shareToken: token },
    select: {
      id: true,
      number: true,
      status: true,
      issueDate: true,
      dueDate: true,
      currency: true,
      subtotalCents: true,
      discountCents: true,
      taxCents: true,
      totalCents: true,
      amountPaidCents: true,
      notes: true,
      paymentTerms: true,
      client: {
        select: {
          name: true,
          companyName: true,
          email: true,
        },
      },
    },
  });

  if (invoice) {
    return jsonOk({
      type: "INVOICE" as const,
      document: invoice,
    });
  }

  const quotation = await prisma.quotation.findFirst({
    where: { shareToken: token },
    select: {
      id: true,
      number: true,
      status: true,
      issueDate: true,
      validUntil: true,
      currency: true,
      subtotalCents: true,
      discountCents: true,
      taxCents: true,
      totalCents: true,
      notes: true,
      terms: true,
      client: {
        select: {
          name: true,
          companyName: true,
          email: true,
        },
      },
    },
  });

  if (quotation) {
    return jsonOk({
      type: "QUOTATION" as const,
      document: quotation,
    });
  }

  return jsonError("Shared document not found", 404);
}
