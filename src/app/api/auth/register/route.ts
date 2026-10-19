import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import {
  enforceRateLimit,
  jsonError,
  jsonOk,
  zodErrorMessage,
} from "@/lib/api-utils";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "auth:register", 10, 60 * 60 * 1000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return jsonError("An account with this email already exists", 409);
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const name = parsed.data.name.trim();
  const businessName = name ? `${name}'s Business` : "My Business";

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      businessProfile: {
        create: {
          businessName,
          email,
        },
      },
      subscription: {
        create: {
          planId: "free",
          status: "inactive",
        },
      },
      preferences: {
        create: {},
      },
    },
  });

  return jsonOk({ ok: true }, 201);
}
