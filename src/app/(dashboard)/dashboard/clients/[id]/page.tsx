"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import {
  ClientForm,
  clientToForm,
} from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/client-api";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [name, setName] = useState("");
  const [initial, setInitial] = useState<ReturnType<typeof clientToForm> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ client: Parameters<typeof clientToForm>[0] & { name: string } }>(
      `/api/clients/${id}`
    )
      .then((d) => {
        setName(d.client.name);
        setInitial(clientToForm(d.client));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Client not found")
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function onDelete() {
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/clients/${id}`, { method: "DELETE" });
      router.push("/dashboard/clients");
    } catch {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading client…</p>;
  }

  if (error || !initial) {
    return (
      <div>
        <p className="text-red-600">{error ?? "Not found"}</p>
        <Link href="/dashboard/clients" className="mt-2 text-sm text-[var(--accent)]">
          Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/clients"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)]"
          >
            ← Clients
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--brand)]">
            {name}
          </h1>
        </div>
        <Button type="button" variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
          Delete client
        </Button>
      </div>
      <Card>
        <ClientForm
          initial={initial}
          clientId={id}
          onSuccess={(c) => setName(c.name)}
        />
      </Card>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete client?"
        description="Invoices linked to this client may be affected. This cannot be undone."
        confirmLabel="Delete client"
        loading={deleteLoading}
        onConfirm={onDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
