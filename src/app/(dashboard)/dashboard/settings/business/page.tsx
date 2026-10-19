"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/client-api";
import type { TaxMode } from "@/lib/money";

type BusinessProfile = {
  businessName: string;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  postcode?: string | null;
  country?: string | null;
  vatNumber?: string | null;
  companyNumber?: string | null;
  currency: string;
  taxMode: TaxMode;
  defaultTaxRate: number;
  invoicePrefix: string;
  quotationPrefix: string;
  paymentTerms?: string | null;
  bankDetails?: string | null;
};

export default function BusinessSettingsPage() {
  const [values, setValues] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiFetch<{ business: BusinessProfile }>("/api/business")
      .then((d) => setValues(d.business))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load profile")
      )
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setValues((v) => (v ? { ...v, [key]: value } : v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await apiFetch<{ business: BusinessProfile }>("/api/business", {
        method: "PATCH",
        body: JSON.stringify({
          ...values,
          email: values.email || null,
          phone: values.phone || null,
          addressLine1: values.addressLine1 || null,
          addressLine2: values.addressLine2 || null,
          city: values.city || null,
          county: values.county || null,
          postcode: values.postcode || null,
          country: values.country || null,
          vatNumber: values.vatNumber || null,
          companyNumber: values.companyNumber || null,
          paymentTerms: values.paymentTerms || null,
          bankDetails: values.bankDetails || null,
        }),
      });
      setValues(data.business);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>;
  }

  if (error && !values) {
    return (
      <div>
        <PageHeader title="Business settings" />
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!values) return null;

  return (
    <div>
      <PageHeader
        title="Business settings"
        description="Details shown on invoices and quotations"
      />
      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-700">Business profile saved.</p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="biz-name">Business name *</Label>
              <Input
                id="biz-name"
                value={values.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="biz-email">Email</Label>
              <Input
                id="biz-email"
                type="email"
                value={values.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-phone">Phone</Label>
              <Input
                id="biz-phone"
                value={values.phone ?? ""}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="biz-a1">Address</Label>
              <Input
                id="biz-a1"
                value={values.addressLine1 ?? ""}
                onChange={(e) => set("addressLine1", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-city">City</Label>
              <Input
                id="biz-city"
                value={values.city ?? ""}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-postcode">Postcode</Label>
              <Input
                id="biz-postcode"
                value={values.postcode ?? ""}
                onChange={(e) => set("postcode", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-vat">VAT number</Label>
              <Input
                id="biz-vat"
                value={values.vatNumber ?? ""}
                onChange={(e) => set("vatNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-co">Company number</Label>
              <Input
                id="biz-co"
                value={values.companyNumber ?? ""}
                onChange={(e) => set("companyNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-currency">Currency</Label>
              <Input
                id="biz-currency"
                maxLength={3}
                value={values.currency}
                onChange={(e) => set("currency", e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <Label htmlFor="biz-tax-mode">Default tax mode</Label>
              <select
                id="biz-tax-mode"
                className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
                value={values.taxMode}
                onChange={(e) => set("taxMode", e.target.value as TaxMode)}
              >
                <option value="exclusive">Exclusive</option>
                <option value="inclusive">Inclusive</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <Label htmlFor="biz-tax-rate">Default tax rate %</Label>
              <Input
                id="biz-tax-rate"
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={values.defaultTaxRate}
                onChange={(e) =>
                  set("defaultTaxRate", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label htmlFor="biz-inv-prefix">Invoice prefix</Label>
              <Input
                id="biz-inv-prefix"
                value={values.invoicePrefix}
                onChange={(e) => set("invoicePrefix", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="biz-quo-prefix">Quotation prefix</Label>
              <Input
                id="biz-quo-prefix"
                value={values.quotationPrefix}
                onChange={(e) => set("quotationPrefix", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="biz-terms">Default payment terms</Label>
              <Textarea
                id="biz-terms"
                rows={3}
                value={values.paymentTerms ?? ""}
                onChange={(e) => set("paymentTerms", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="biz-bank">Bank details</Label>
              <Textarea
                id="biz-bank"
                rows={3}
                value={values.bankDetails ?? ""}
                onChange={(e) => set("bankDetails", e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
