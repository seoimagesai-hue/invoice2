import { prisma } from "@/lib/db";
import { invoiceSchema } from "@/lib/validations";
import {
  allocateInvoiceNumber,
  assertInvoiceLimit,
  computeTotals,
} from "@/lib/documents";
import { formItemsToLineInputs, lineItemsForCreate } from "@/lib/line-items";
import { assertClientOwned } from "@/lib/ownership";
import {
  jsonError,
  jsonOk,
  parseDate,
  requireAuthUserId,
  zodErrorMessage,
} from "@/lib/api-utils";
import type { TaxMode } from "@/lib/money";

export async function GET(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status")?.trim();
  const clientId = searchParams.get("clientId")?.trim();

  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(clientId ? { clientId } : {}),
      ...(q ? { number: { contains: q } } : {}),
    },
    include: {
      client: { select: { id: true, name: true, companyName: true } },
    },
    orderBy: { issueDate: "desc" },
  });

  return jsonOk({ invoices });
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

  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  try {
    await assertInvoiceLimit(userId);
    await assertClientOwned(userId, parsed.data.clientId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Forbidden";
    const status = message === "CLIENT_NOT_FOUND" ? 404 : 403;
    return jsonError(message === "CLIENT_NOT_FOUND" ? "Client not found" : message, status);
  }

  const profile = await prisma.businessProfile.findUnique({ where: { userId } });
  const currency = profile?.currency ?? "GBP";
  const taxMode = parsed.data.taxMode as TaxMode;
  const lineInputs = formItemsToLineInputs(parsed.data.items);
  const totals = computeTotals(lineInputs, taxMode);

  let issueDate: Date;
  let dueDate: Date;
  try {
    issueDate = parseDate(parsed.data.issueDate);
    dueDate = parseDate(parsed.data.dueDate);
  } catch {
    return jsonError("Invalid date");
  }

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      const number = await allocateInvoiceNumber(tx, userId);
      return tx.invoice.create({
        data: {
          userId,
          clientId: parsed.data.clientId,
          number,
          status: parsed.data.status,
          issueDate,
          dueDate,
          currency,
          taxMode,
          subtotalCents: totals.subtotalCents,
          discountCents: totals.discountCents,
          taxCents: totals.taxCents,
          totalCents: totals.totalCents,
          notes: parsed.data.notes ?? null,
          paymentTerms: parsed.data.paymentTerms ?? null,
          items: {
            create: lineItemsForCreate(parsed.data.items),
          },
        },
        include: {
          items: true,
          client: true,
        },
      });
    });

    return jsonOk({ invoice }, 201);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to create invoice",
      500
    );
  }
}
