import { z } from "zod";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk, requireAuthUserId, zodErrorMessage } from "@/lib/api-utils";

const accountPatchSchema = z.object({
  name: z.string().min(1).max(120),
});

export async function GET() {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      subscription: true,
    },
  });

  if (!user) {
    return jsonError("Account not found", 404);
  }

  return jsonOk({ user });
}

export async function PATCH(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = accountPatchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name.trim() },
    select: { id: true, email: true, name: true },
  });

  return jsonOk({ user });
}

export async function DELETE() {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  await prisma.user.delete({ where: { id: userId } });

  return jsonOk({ ok: true });
}
