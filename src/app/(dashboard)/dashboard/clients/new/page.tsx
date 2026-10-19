"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ClientForm, emptyClientForm } from "@/components/clients/client-form";

export default function NewClientPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="Add client" description="Client contact and billing details" />
      <Card>
        <ClientForm
          initial={emptyClientForm()}
          onSuccess={() => router.push("/dashboard/clients")}
          onCancel={() => router.push("/dashboard/clients")}
        />
      </Card>
    </div>
  );
}
