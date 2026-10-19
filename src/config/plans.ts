/**
 * Central subscription plan configuration (proposed launch pricing in GBP).
 * Change prices and limits here — do not hardcode across the UI.
 */
export type PlanId = "starter" | "professional" | "business";
export type BillingInterval = "month" | "year";

export interface PlanLimits {
  maxClients: number | null;
  maxInvoicesPerMonth: number | null;
  maxQuotationsPerMonth: number | null;
  customBranding: boolean;
  quotationToInvoice: boolean;
  paymentTracking: boolean;
  advancedReporting: boolean;
  teamAccess: boolean;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  description: string;
  /** Proposed launch prices in GBP (major units) */
  priceMonthlyGbp: number;
  priceYearlyGbp: number;
  features: string[];
  limits: PlanLimits;
  highlighted?: boolean;
  stripePriceEnvMonthly: string;
  stripePriceEnvYearly: string;
}

export const plans: PlanDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Essential invoicing for freelancers getting started.",
    priceMonthlyGbp: 9,
    priceYearlyGbp: 90,
    features: [
      "Basic invoice creation",
      "Basic quotation creation",
      "Up to 25 clients",
      "Up to 20 invoices per month",
      "Up to 20 quotations per month",
      "PDF downloads",
      "Basic payment tracking",
    ],
    limits: {
      maxClients: 25,
      maxInvoicesPerMonth: 20,
      maxQuotationsPerMonth: 20,
      customBranding: false,
      quotationToInvoice: false,
      paymentTracking: true,
      advancedReporting: false,
      teamAccess: false,
    },
    stripePriceEnvMonthly: "STRIPE_PRICE_STARTER_MONTHLY",
    stripePriceEnvYearly: "STRIPE_PRICE_STARTER_YEARLY",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Full toolkit for growing contractors and small businesses.",
    priceMonthlyGbp: 19,
    priceYearlyGbp: 190,
    highlighted: true,
    features: [
      "Everything in Starter",
      "Up to 200 clients",
      "Up to 100 invoices per month",
      "Up to 100 quotations per month",
      "Full client management",
      "Quotation-to-invoice conversion",
      "Payment tracking and reporting",
      "Custom business branding on PDFs",
    ],
    limits: {
      maxClients: 200,
      maxInvoicesPerMonth: 100,
      maxQuotationsPerMonth: 100,
      customBranding: true,
      quotationToInvoice: true,
      paymentTracking: true,
      advancedReporting: true,
      teamAccess: false,
    },
    stripePriceEnvMonthly: "STRIPE_PRICE_PROFESSIONAL_MONTHLY",
    stripePriceEnvYearly: "STRIPE_PRICE_PROFESSIONAL_YEARLY",
  },
  {
    id: "business",
    name: "Business",
    description: "Expanded limits and reporting for established teams.",
    priceMonthlyGbp: 39,
    priceYearlyGbp: 390,
    features: [
      "Everything in Professional",
      "Up to 1,000 clients",
      "Up to 500 invoices per month",
      "Up to 500 quotations per month",
      "Advanced reporting",
      "Team access (when enabled)",
      "Expanded business configuration",
    ],
    limits: {
      maxClients: 1000,
      maxInvoicesPerMonth: 500,
      maxQuotationsPerMonth: 500,
      customBranding: true,
      quotationToInvoice: true,
      paymentTracking: true,
      advancedReporting: true,
      teamAccess: true,
    },
    stripePriceEnvMonthly: "STRIPE_PRICE_BUSINESS_MONTHLY",
    stripePriceEnvYearly: "STRIPE_PRICE_BUSINESS_YEARLY",
  },
];

export const freeTrialNote =
  "New accounts start on a free trial allowance (5 clients, 5 invoices, 5 quotations per month) until a paid plan is active.";

export const freePlanLimits: PlanLimits = {
  maxClients: 5,
  maxInvoicesPerMonth: 5,
  maxQuotationsPerMonth: 5,
  customBranding: false,
  quotationToInvoice: true,
  paymentTracking: true,
  advancedReporting: false,
  teamAccess: false,
};

export function getPlan(id: PlanId): PlanDefinition {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

export function annualSavingsPercent(plan: PlanDefinition): number {
  const monthlyCost = plan.priceMonthlyGbp * 12;
  if (monthlyCost <= 0) return 0;
  return Math.round(((monthlyCost - plan.priceYearlyGbp) / monthlyCost) * 100);
}

export function formatGbp(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export const pricingDisclaimer =
  "Prices shown are proposed launch pricing in GBP and may change. VAT may apply where required.";
