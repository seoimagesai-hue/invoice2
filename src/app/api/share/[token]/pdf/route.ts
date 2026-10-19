import { prisma } from "@/lib/db";
import { generateDocumentPdf } from "@/lib/pdf";
import {
  invoiceToPdfInput,
  quotationToPdfInput,
} from "@/lib/document-pdf-data";
import { jsonError } from "@/lib/api-utils";

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
    include: { items: true, client: true },
  });

  if (invoice) {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: invoice.userId },
    });
    if (!profile) {
      return jsonError("Document unavailable", 404);
    }

    const buffer = await generateDocumentPdf(
      invoiceToPdfInput(invoice, profile)
    );
    const filename = `${invoice.number.replace(/[^\w.-]+/g, "_")}.pdf`;
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  const quotation = await prisma.quotation.findFirst({
    where: { shareToken: token },
    include: { items: true, client: true },
  });

  if (quotation) {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: quotation.userId },
    });
    if (!profile) {
      return jsonError("Document unavailable", 404);
    }

    const buffer = await generateDocumentPdf(
      quotationToPdfInput(quotation, profile)
    );
    const filename = `${quotation.number.replace(/[^\w.-]+/g, "_")}.pdf`;
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  return jsonError("Shared document not found", 404);
}
