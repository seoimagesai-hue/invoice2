import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { passwordResetRequestSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  enforceRateLimit,
  jsonError,
  jsonOk,
  zodErrorMessage,
} from "@/lib/api-utils";

const GENERIC_MESSAGE =
  "If an account exists for that address, you will receive password reset instructions shortly.";

export async function POST(request: Request) {
  const limited = enforceRateLimit(
    request,
    "auth:forgot-password",
    5,
    60 * 60 * 1000
  );
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = passwordResetRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  let emailSent = false;

  if (user) {
    const resetToken = nanoid(48);
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
      new URL(request.url).origin;
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    const result = await sendPasswordResetEmail({ email, resetUrl });
    emailSent = result.delivered;
  }

  return jsonOk({
    ok: true,
    message: GENERIC_MESSAGE,
    ...(emailSent ? { emailSent: true } : {}),
  });
}
