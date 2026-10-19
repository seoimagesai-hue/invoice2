"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/client-api";

export type ClientFormValues = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  notes: string;
};

export const emptyClientForm = (): ClientFormValues => ({
  name: "",
  companyName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  postcode: "",
  country: "United Kingdom",
  notes: "",
});

export function clientToForm(client: {
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  postcode?: string | null;
  country?: string | null;
  notes?: string | null;
}): ClientFormValues {
  return {
    name: client.name,
    companyName: client.companyName ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    addressLine1: client.addressLine1 ?? "",
    addressLine2: client.addressLine2 ?? "",
    city: client.city ?? "",
    county: client.county ?? "",
    postcode: client.postcode ?? "",
    country: client.country ?? "",
    notes: client.notes ?? "",
  };
}

export function ClientForm({
  initial,
  clientId,
  onSuccess,
  onCancel,
}: {
  initial: ClientFormValues;
  clientId?: string;
  onSuccess: (client: { id: string; name: string }) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(field: keyof ClientFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...values,
        companyName: values.companyName || null,
        email: values.email || null,
        phone: values.phone || null,
        addressLine1: values.addressLine1 || null,
        addressLine2: values.addressLine2 || null,
        city: values.city || null,
        county: values.county || null,
        postcode: values.postcode || null,
        country: values.country || null,
        notes: values.notes || null,
      };
      if (clientId) {
        const data = await apiFetch<{ client: { id: string; name: string } }>(
          `/api/clients/${clientId}`,
          { method: "PATCH", body: JSON.stringify(payload) }
        );
        onSuccess(data.client);
      } else {
        const data = await apiFetch<{ client: { id: string; name: string } }>(
          "/api/clients",
          { method: "POST", body: JSON.stringify(payload) }
        );
        onSuccess(data.client);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="client-name">Contact name *</Label>
          <Input
            id="client-name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="client-company">Company</Label>
          <Input
            id="client-company"
            value={values.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="client-address1">Address line 1</Label>
          <Input
            id="client-address1"
            value={values.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="client-address2">Address line 2</Label>
          <Input
            id="client-address2"
            value={values.addressLine2}
            onChange={(e) => set("addressLine2", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-city">City</Label>
          <Input
            id="client-city"
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-county">County</Label>
          <Input
            id="client-county"
            value={values.county}
            onChange={(e) => set("county", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-postcode">Postcode</Label>
          <Input
            id="client-postcode"
            value={values.postcode}
            onChange={(e) => set("postcode", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-country">Country</Label>
          <Input
            id="client-country"
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="client-notes">Notes</Label>
          <Textarea
            id="client-notes"
            rows={3}
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : clientId ? "Update client" : "Create client"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
