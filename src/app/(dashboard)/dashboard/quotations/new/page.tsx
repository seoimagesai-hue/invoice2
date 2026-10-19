"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  defaultQuotationForm,
  QuotationForm,
} from "@/components/documents/quotation-form";

export default function NewQuotationPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="New quotation" description="Fill in the details below" />
      <Card>
        <QuotationForm
          initial={defaultQuotationForm()}
          onSuccess={(q) => router.push(`/dashboard/quotations/${q.id}`)}
          onCancel={() => router.push("/dashboard/quotations")}
        />
      </Card>
    </div>
  );
}
