"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { apiFetch, formatDisplayDate } from "@/lib/client-api";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    apiFetch<{
      user: { email: string; name: string | null; createdAt: string };
    }>("/api/account")
      .then((d) => {
        setEmail(d.user.email);
        setName(d.user.name ?? "");
        setCreatedAt(d.user.createdAt);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load account")
      )
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await apiFetch<{ user: { name: string | null } }>(
        "/api/account",
        {
          method: "PATCH",
          body: JSON.stringify({ name: name.trim() }),
        }
      );
      setName(data.user.name ?? "");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteAccount() {
    setDeleteLoading(true);
    try {
      await apiFetch("/api/account", { method: "DELETE" });
      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="Account settings" description="Your login and profile" />

      <Card className="mb-6">
        <form onSubmit={onSave} className="space-y-4 max-w-md">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-700">Profile updated.</p>
          ) : null}
          <div>
            <Label htmlFor="acct-name">Display name</Label>
            <Input
              id="acct-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="acct-email">Email</Label>
            <Input id="acct-email" value={email} disabled readOnly />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Email cannot be changed here. Contact support if you need help.
            </p>
          </div>
          {createdAt ? (
            <p className="text-xs text-[var(--muted-foreground)]">
              Member since {formatDisplayDate(createdAt)}
            </p>
          ) : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save name"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold text-[var(--brand)]">Password</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Use{" "}
          <button
            type="button"
            className="text-[var(--accent)] underline"
            onClick={() => router.push("/forgot-password")}
          >
            forgot password
          </button>{" "}
          from the login page to reset your password by email.
        </p>
      </Card>

      <Card className="mt-6 border-red-200">
        <h2 className="font-semibold text-red-700">Delete account</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Permanently removes your account, clients, invoices, and subscription
          data. This cannot be undone.
        </p>
        <Button
          type="button"
          variant="danger"
          className="mt-4"
          onClick={() => setDeleteOpen(true)}
        >
          Delete my account
        </Button>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        description="All your data will be permanently deleted. You will be signed out immediately."
        confirmLabel="Yes, delete account"
        loading={deleteLoading}
        onConfirm={onDeleteAccount}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
