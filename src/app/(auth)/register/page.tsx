"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthAlert,
  AuthButton,
  AuthField,
  AuthShell,
  authInputClass,
} from "@/components/auth/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed.");
      return;
    }

    router.push(`/login?registered=1&email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Start invoicing with DevWiser"
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <AuthAlert message={error} /> : null}

        <AuthField label="Full name" id="name">
          <input
            id="name"
            required
            autoComplete="name"
            className={authInputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </AuthField>

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

        <AuthField label="Password" id="password">
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

        <AuthField label="Confirm password" id="confirmPassword">
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

        <AuthButton loading={loading}>Create account</AuthButton>
      </form>
    </AuthShell>
  );
}
