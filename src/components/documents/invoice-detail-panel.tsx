"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Download, Share2, Trash2, Wallet } from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  InvoiceForm,
  invoiceToForm,
} from "@/components/documents/invoice-form";
import { apiFetch } from "@/lib/client-api";
import { absoluteUrl } from "@/lib/utils";

export function InvoiceDetailPanel({
  invoice,
}: {
  invoice: {
    id: string;
    number: string;
    shareToken?: string | null;
    clientId: string;
    issueDate: string;
    dueDate: string;
    status: string;
    taxMode: string;
    notes?: string | null;
    paymentTerms?: string | null;
    items: {
      description: string;
      quantity: number;
      unitPriceCents: number;
      discountPercent: number;
      taxRate: number;
    }[];
  };
}) {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState<string | null>(
    invoice.shareToken
      ? absoluteUrl(`/share/${invoice.shareToken}`)
      : null
  );
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onShare() {
    setShareLoading(true);
    setShareError(null);
    try {
      const data = await apiFetch<{ shareToken: string }>(
        `/api/invoices/${invoice.id}/share`,
        { method: "POST" }
      );
      const url = absoluteUrl(`/share/${data.shareToken}`);
      setShareUrl(url);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Share failed");
    } finally {
      setShareLoading(false);
    }
  }

  async function onCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onDownloadPdf() {
    window.location.href = `/api/invoices/${invoice.id}/pdf`;
  }

  async function onDelete() {
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
      router.push("/dashboard/invoices");
      router.refresh();
    } catch {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onDownloadPdf}>
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShare}
          disabled={shareLoading}
        >
          <Share2 className="h-4 w-4" aria-hidden />
          {shareLoading ? "Generating…" : "Share link"}
        </Button>
        <Link href={`/dashboard/payments?invoiceId=${invoice.id}`}>
          <Button type="button" variant="outline" size="sm">
            <Wallet className="h-4 w-4" aria-hidden />
            Record payment
          </Button>
        </Link>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Delete
        </Button>
      </div>

      {shareError ? (
        <p className="text-sm text-red-600">{shareError}</p>
      ) : null}
      {shareUrl ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/50 p-3 text-sm">
          <code className="flex-1 break-all">{shareUrl}</code>
          <Button type="button" size="sm" variant="secondary" onClick={onCopy}>
            <Copy className="h-4 w-4" aria-hidden />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      ) : null}

      {saved ? (
        <p className="text-sm text-emerald-700">Invoice saved successfully.</p>
      ) : null}

      <InvoiceForm
        initial={invoiceToForm(invoice)}
        invoiceId={invoice.id}
        onSuccess={() => {
          setSaved(true);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete invoice?"
        description={`This permanently deletes ${invoice.number}. This cannot be undone.`}
        confirmLabel="Delete invoice"
        loading={deleteLoading}
        onConfirm={onDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
