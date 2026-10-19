import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { passwordResetSchema } from "@/lib/validations";
import {
  enforceRateLimit,
  jsonError,
  jsonOk,
  zodErrorMessage,
} from "@/lib/api-utils";

export async function POST(request: Request) {
  const limited = enforceRateLimit(
    request,
    "auth:reset-password",
    10,
    60 * 60 * 1000
  );
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = passwordResetSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: parsed.data.token,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return jsonError("Invalid or expired reset link", 400);
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return jsonOk({ ok: true });
}
