"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/client-api";

type ClientRow = {
  id: string;
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function ClientsListPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    apiFetch<{ clients: ClientRow[] }>(`/api/clients?${params}`)
      .then((d) => setClients(d.clients))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="People and companies you bill"
        actionLabel="Add client"
        actionHref="/dashboard/clients/new"
      />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input
          className="pl-9"
          placeholder="Search clients…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading clients…</p>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add clients to attach them to invoices and quotations."
          actionLabel="Add client"
          actionHref="/dashboard/clients/new"
        />
      ) : (
        <DataTableShell>
          <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--surface-muted)]/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{c.companyName ?? "—"}</td>
                <td className="px-4 py-3">{c.email ?? "—"}</td>
                <td className="px-4 py-3">{c.phone ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      )}
    </div>
  );
}
