import { prisma } from "@/lib/db";
import { buildShareToken } from "@/lib/documents";
import { assertInvoiceOwned } from "@/lib/ownership";
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
    await assertInvoiceOwned(userId, id);
  } catch {
    return jsonError("Invoice not found", 404);
  }

  const existing = await prisma.invoice.findUnique({ where: { id } });
  const shareToken = existing?.shareToken ?? buildShareToken();

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { shareToken },
    select: { id: true, number: true, shareToken: true },
  });

  return jsonOk({ invoice, shareToken: invoice.shareToken });
}
