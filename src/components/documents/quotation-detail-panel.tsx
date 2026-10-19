"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Share2, Trash2, FileInput, Download } from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  QuotationForm,
  quotationToForm,
} from "@/components/documents/quotation-form";
import { apiFetch } from "@/lib/client-api";
import { absoluteUrl } from "@/lib/utils";

export function QuotationDetailPanel({
  quotation,
}: {
  quotation: {
    id: string;
    number: string;
    status: string;
    shareToken?: string | null;
    clientId: string;
    issueDate: string;
    validUntil: string;
    taxMode: string;
    notes?: string | null;
    terms?: string | null;
    items: {
      description: string;
      quantity: number;
      unitPriceCents: number;
      discountPercent: number;
      taxRate: number;
    }[];
    invoice?: { id: string } | null;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(quotation.status);
  const [linkedInvoice, setLinkedInvoice] = useState(quotation.invoice ?? null);
  const readOnly = status === "CONVERTED";
  const [shareUrl, setShareUrl] = useState<string | null>(
    quotation.shareToken
      ? absoluteUrl(`/share/${quotation.shareToken}`)
      : null
  );
  const [shareLoading, setShareLoading] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStatus(quotation.status);
    setLinkedInvoice(quotation.invoice ?? null);
  }, [quotation.status, quotation.invoice]);

  async function onShare() {
    setShareLoading(true);
    try {
      const data = await apiFetch<{ shareToken: string }>(
        `/api/quotations/${quotation.id}/share`,
        { method: "POST" }
      );
      setShareUrl(absoluteUrl(`/share/${data.shareToken}`));
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

  async function onConvert() {
    setConvertLoading(true);
    setConvertError(null);
    try {
      const data = await apiFetch<{ invoice: { id: string } }>(
        `/api/quotations/${quotation.id}/convert`,
        { method: "POST" }
      );
      router.push(`/dashboard/invoices/${data.invoice.id}`);
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : "Conversion failed");
      setConvertLoading(false);
    }
  }

  async function onDelete() {
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/quotations/${quotation.id}`, { method: "DELETE" });
      router.push("/dashboard/quotations");
    } catch {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  }

  const canConvert = status === "ACCEPTED" && !linkedInvoice && !readOnly;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = `/api/quotations/${quotation.id}/pdf`;
          }}
        >
          <Download className="h-4 w-4" aria-hidden />
          Download PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShare}
          disabled={shareLoading}
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Share link
        </Button>
        {canConvert ? (
          <Button
            type="button"
            size="sm"
            onClick={onConvert}
            disabled={convertLoading}
          >
            <FileInput className="h-4 w-4" aria-hidden />
            {convertLoading ? "Converting…" : "Convert to invoice"}
          </Button>
        ) : null}
        {linkedInvoice ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/invoices/${linkedInvoice.id}`)
            }
          >
            View invoice
          </Button>
        ) : null}
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

      {convertError ? (
        <p className="text-sm text-red-600">{convertError}</p>
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
        <p className="text-sm text-emerald-700">Quotation saved.</p>
      ) : null}

      <QuotationForm
        initial={quotationToForm(quotation)}
        quotationId={quotation.id}
        readOnly={readOnly}
        onSuccess={(updated) => {
          setSaved(true);
          setStatus(updated.status);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete quotation?"
        description={`This permanently deletes ${quotation.number}.`}
        confirmLabel="Delete quotation"
        loading={deleteLoading}
        onConfirm={onDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
