"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  AuthAlert,
  AuthButton,
  AuthField,
  AuthShell,
  authInputClass,
} from "@/components/auth/auth-shell";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing reset token. Request a new link.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Unable to reset password.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <AuthAlert message="This reset link is invalid. Request a new one from the forgot password page." />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <AuthAlert message={error} /> : null}
      {success ? (
        <AuthAlert
          tone="success"
          message="Password updated. Redirecting to sign in…"
        />
      ) : null}

      <AuthField label="New password" id="password">
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={authInputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </AuthField>

      <AuthField label="Confirm new password" id="confirmPassword">
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={authInputClass}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </AuthField>

      <AuthButton loading={loading}>Update password</AuthButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      footer={
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Suspense fallback={<p className="text-sm text-[var(--muted-foreground)]">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
