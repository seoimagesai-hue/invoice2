import { prisma } from "@/lib/db";
import { quotationSchema } from "@/lib/validations";
import {
  allocateQuotationNumber,
  assertQuotationLimit,
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

  const quotations = await prisma.quotation.findMany({
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

  return jsonOk({ quotations });
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

  const parsed = quotationSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  try {
    await assertQuotationLimit(userId);
    await assertClientOwned(userId, parsed.data.clientId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Forbidden";
    const status = message === "CLIENT_NOT_FOUND" ? 404 : 403;
    return jsonError(message === "CLIENT_NOT_FOUND" ? "Client not found" : message, status);
  }

  const profile = await prisma.businessProfile.findUnique({ where: { userId } });
  const currency = profile?.currency ?? "GBP";
  const taxMode = parsed.data.taxMode as TaxMode;
  const totals = computeTotals(formItemsToLineInputs(parsed.data.items), taxMode);

  let issueDate: Date;
  let validUntil: Date;
  try {
    issueDate = parseDate(parsed.data.issueDate);
    validUntil = parseDate(parsed.data.validUntil);
  } catch {
    return jsonError("Invalid date");
  }

  const quotation = await prisma.$transaction(async (tx) => {
    const number = await allocateQuotationNumber(tx, userId);
    return tx.quotation.create({
      data: {
        userId,
        clientId: parsed.data.clientId,
        number,
        status: parsed.data.status,
        issueDate,
        validUntil,
        currency,
        taxMode,
        subtotalCents: totals.subtotalCents,
        discountCents: totals.discountCents,
        taxCents: totals.taxCents,
        totalCents: totals.totalCents,
        notes: parsed.data.notes ?? null,
        terms: parsed.data.terms ?? null,
        items: {
          create: lineItemsForCreate(parsed.data.items),
        },
      },
      include: { items: true, client: true },
    });
  });

  return jsonOk({ quotation }, 201);
}
