"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AuthAlert,
  AuthButton,
  AuthField,
  AuthShell,
  authInputClass,
} from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      emailSent?: boolean;
    };

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Request failed.");
      return;
    }

    let text =
      data.message ||
      "If an account exists for that address, you will receive password reset instructions shortly.";
    if (data.emailSent) {
      text = "Reset email sent. Check your inbox for the link.";
    }
    setMessage(text);
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="We will email you a secure reset link when delivery is available"
      footer={
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <AuthAlert message={error} /> : null}
        {message ? <AuthAlert message={message} tone="success" /> : null}

        <AuthField label="Email" id="email">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={authInputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </AuthField>

        <AuthButton loading={loading}>Send reset link</AuthButton>
      </form>
    </AuthShell>
  );
}
