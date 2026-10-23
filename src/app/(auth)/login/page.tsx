"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import {
  AuthAlert,
  AuthButton,
  AuthField,
  AuthShell,
  authInputClass,
} from "@/components/auth/auth-shell";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your DevWiser dashboard"
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="text-[var(--accent)] hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <AuthAlert message={error} /> : null}

        <AuthField label="Email" id="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={authInputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </AuthField>

        <AuthField label="Password" id="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className={authInputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </AuthField>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton loading={loading}>Sign in</AuthButton>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[var(--muted-foreground)]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
