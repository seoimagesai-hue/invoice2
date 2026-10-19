"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  defaultInvoiceForm,
  InvoiceForm,
} from "@/components/documents/invoice-form";

export default function NewInvoicePage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="New invoice"
        description="Fill in the details below"
      />
      <Card>
        <InvoiceForm
          initial={defaultInvoiceForm()}
          onSuccess={(invoice) =>
            router.push(`/dashboard/invoices/${invoice.id}`)
          }
          onCancel={() => router.push("/dashboard/invoices")}
        />
      </Card>
    </div>
  );
}
