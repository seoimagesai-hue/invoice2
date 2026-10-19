import { prisma } from "@/lib/db";
import { buildShareToken } from "@/lib/documents";
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

  try {
    await assertQuotationOwned(userId, id);
  } catch {
    return jsonError("Quotation not found", 404);
  }

  const existing = await prisma.quotation.findUnique({ where: { id } });
  const shareToken = existing?.shareToken ?? buildShareToken();

  const quotation = await prisma.quotation.update({
    where: { id },
    data: { shareToken },
    select: { id: true, number: true, shareToken: true },
  });

  return jsonOk({ quotation, shareToken: quotation.shareToken });
}
