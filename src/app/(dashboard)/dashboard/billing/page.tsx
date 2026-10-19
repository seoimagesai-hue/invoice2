import { redirect } from "next/navigation";

/** Stripe checkout/portal return URLs use /dashboard/billing */
export default async function BillingRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const params = await searchParams;
  const q = params.checkout ? `?checkout=${params.checkout}` : "";
  redirect(`/dashboard/settings/billing${q}`);
}
