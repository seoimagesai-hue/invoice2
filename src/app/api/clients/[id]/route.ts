import { prisma } from "@/lib/db";
import { clientSchema } from "@/lib/validations";
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

async function getOwnedClient(userId: string, id: string) {
  return prisma.client.findFirst({ where: { id, userId } });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  const client = await getOwnedClient(userId, id);
  if (!client) return jsonError("Client not found", 404);

  return jsonOk({ client });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  const existing = await getOwnedClient(userId, id);
  if (!existing) return jsonError("Client not found", 404);

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

  const client = await prisma.client.update({
    where: { id },
    data: normalizeClientInput(parsed.data),
  });

  return jsonOk({ client });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;
  const { id } = await context.params;

  const existing = await getOwnedClient(userId, id);
  if (!existing) return jsonError("Client not found", 404);

  await prisma.client.delete({ where: { id } });

  return jsonOk({ ok: true });
}
