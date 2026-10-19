import { prisma } from "@/lib/db";
import { clientSchema } from "@/lib/validations";
import { assertClientLimit } from "@/lib/documents";
import {
  emptyToNull,
  jsonError,
  jsonOk,
  requireAuthUserId,
  zodErrorMessage,
} from "@/lib/api-utils";

function normalizeClientInput(data: {
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  postcode?: string | null;
  country?: string | null;
  notes?: string | null;
}) {
  return {
    name: data.name.trim(),
    companyName: emptyToNull(data.companyName),
    email: emptyToNull(data.email),
    phone: emptyToNull(data.phone),
    addressLine1: emptyToNull(data.addressLine1),
    addressLine2: emptyToNull(data.addressLine2),
    city: emptyToNull(data.city),
    county: emptyToNull(data.county),
    postcode: emptyToNull(data.postcode),
    country: emptyToNull(data.country),
    notes: emptyToNull(data.notes),
  };
}

export async function GET(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const clients = await prisma.client.findMany({
    where: {
      userId,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { companyName: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });

  return jsonOk({ clients });
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

  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  try {
    await assertClientLimit(userId);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Client limit reached",
      403
    );
  }

  const client = await prisma.client.create({
    data: {
      userId,
      ...normalizeClientInput(parsed.data),
    },
  });

  return jsonOk({ client }, 201);
}
