import { NextResponse } from "next/server";
import { auth, requireUserId } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import type { z } from "zod";

export function jsonOk<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuthUserId(): Promise<
  { userId: string } | NextResponse
> {
  try {
    const userId = await requireUserId();
    return { userId };
  } catch {
    return jsonError("Unauthorized", 401);
  }
}

export async function optionalUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export function zodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export function emptyToNull(
  value: string | null | undefined
): string | null {
  if (value === undefined || value === null || value === "") return null;
  return value;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function enforceRateLimit(
  request: Request,
  prefix: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const key = `${prefix}:${clientIp(request)}`;
  const result = rateLimit(key, limit, windowMs);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)),
        },
      }
    );
  }
  return null;
}

export function parseDate(value: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date");
  }
  return d;
}
