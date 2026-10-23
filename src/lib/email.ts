import { getSupportEmail } from "@/config/company";

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      getSupportEmail()
  );
}

export function emailSetupMessage(): string {
  return "Email delivery is not configured. Set SUPPORT_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS before outbound email can be sent.";
}

/** Persist contact messages; attempt SMTP send only when configured. */
export async function sendContactNotification(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ delivered: boolean; reason?: string }> {
  if (!isEmailConfigured()) {
    return { delivered: false, reason: emailSetupMessage() };
  }

  // Lightweight SMTP via nodemailer is optional; avoid false success without it.
  // When SMTP vars exist but nodemailer is not installed, store-only path remains truthful.
  try {
    // Dynamic import keeps build working without nodemailer until installed.
    const nodemailer = await import("nodemailer").catch(() => null);
    if (!nodemailer) {
      return {
        delivered: false,
        reason:
          "SMTP environment variables are set, but the nodemailer package is not installed. Message was saved for manual follow-up.",
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = getSupportEmail()!;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo: payload.email,
      subject: `[DevWiser Contact] ${payload.subject}`,
      text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
    });

    return { delivered: true };
  } catch (err) {
    return {
      delivered: false,
      reason:
        err instanceof Error
          ? err.message
          : "Email provider rejected the message.",
    };
  }
}

export async function sendPasswordResetEmail(payload: {
  email: string;
  resetUrl: string;
}): Promise<{ delivered: boolean; reason?: string }> {
  if (!isEmailConfigured()) {
    return { delivered: false, reason: emailSetupMessage() };
  }

  try {
    const nodemailer = await import("nodemailer").catch(() => null);
    if (!nodemailer) {
      return {
        delivered: false,
        reason:
          "SMTP environment variables are set, but the nodemailer package is not installed.",
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: payload.email,
      subject: "Reset your DevWiser password",
      text: `Use this link to reset your password (valid for 1 hour):\n\n${payload.resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    });

    return { delivered: true };
  } catch (err) {
    return {
      delivered: false,
      reason:
        err instanceof Error
          ? err.message
          : "Email provider rejected the message.",
    };
  }
}

export function mailtoShareLink(opts: {
  to?: string;
  subject: string;
  body: string;
}): string {
  const params = new URLSearchParams();
  params.set("subject", opts.subject);
  params.set("body", opts.body);
  return `mailto:${opts.to || ""}?${params.toString()}`;
}
