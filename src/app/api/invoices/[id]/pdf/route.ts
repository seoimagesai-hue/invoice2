import { prisma } from "@/lib/db";
import { generateDocumentPdf } from "@/lib/pdf";
import { invoiceToPdfInput } from "@/lib/document-pdf-data";
import { assertInvoiceOwned } from "@/lib/ownership";
import { jsonError, requireAuthUserId } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  let invoice;
  try {
    invoice = await assertInvoiceOwned(userId, id);
  } catch {
    return jsonError("Invoice not found", 404);
  }

  const profile = await prisma.businessProfile.findUnique({ where: { userId } });
  if (!profile) {
    return jsonError("Business profile not found", 404);
  }

  const pdfInput = invoiceToPdfInput(invoice, profile);
  const buffer = await generateDocumentPdf(pdfInput);
  const filename = `${invoice.number.replace(/[^\w.-]+/g, "_")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
