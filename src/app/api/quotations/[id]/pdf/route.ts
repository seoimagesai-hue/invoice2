import { prisma } from "@/lib/db";
import { generateDocumentPdf } from "@/lib/pdf";
import { quotationToPdfInput } from "@/lib/document-pdf-data";
import { assertQuotationOwned } from "@/lib/ownership";
import { jsonError, requireAuthUserId } from "@/lib/api-utils";

export async function GET(
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

  const profile = await prisma.businessProfile.findUnique({ where: { userId } });
  if (!profile) {
    return jsonError("Business profile not found", 404);
  }

  const pdfInput = quotationToPdfInput(quotation, profile);
  const buffer = await generateDocumentPdf(pdfInput);
  const filename = `${quotation.number.replace(/[^\w.-]+/g, "_")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
