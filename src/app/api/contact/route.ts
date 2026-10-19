import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { sendContactNotification } from "@/lib/email";
import {
  enforceRateLimit,
  jsonError,
  jsonOk,
  optionalUserId,
  zodErrorMessage,
} from "@/lib/api-utils";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "contact", 5, 60 * 60 * 1000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  if (parsed.data.website) {
    return jsonOk({ ok: true, delivered: false });
  }

  const userId = await optionalUserId();

  const message = await prisma.contactMessage.create({
    data: {
      userId,
      name: parsed.data.name.trim(),
      email: parsed.data.email.toLowerCase().trim(),
      subject: parsed.data.subject.trim(),
      message: parsed.data.message.trim(),
    },
  });

  const emailResult = await sendContactNotification({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  return jsonOk({
    ok: true,
    id: message.id,
    delivered: emailResult.delivered,
    ...(emailResult.reason && !emailResult.delivered
      ? { reason: emailResult.reason }
      : {}),
  });
}
