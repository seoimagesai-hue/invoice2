import { prisma } from "@/lib/db";
import { businessProfileSchema } from "@/lib/validations";
import {
  emptyToNull,
  jsonError,
  jsonOk,
  requireAuthUserId,
  zodErrorMessage,
} from "@/lib/api-utils";

function normalizeBusiness(data: {
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
  taxMode: "exclusive" | "inclusive" | "none";
  defaultTaxRate: number;
  invoicePrefix: string;
  quotationPrefix: string;
  paymentTerms?: string | null;
  bankDetails?: string | null;
  logoDataUrl?: string | null;
}) {
  return {
    businessName: data.businessName.trim(),
    email: emptyToNull(data.email),
    phone: emptyToNull(data.phone),
    addressLine1: emptyToNull(data.addressLine1),
    addressLine2: emptyToNull(data.addressLine2),
    city: emptyToNull(data.city),
    county: emptyToNull(data.county),
    postcode: emptyToNull(data.postcode),
    country: emptyToNull(data.country),
    vatNumber: emptyToNull(data.vatNumber),
    companyNumber: emptyToNull(data.companyNumber),
    currency: data.currency,
    taxMode: data.taxMode,
    defaultTaxRate: data.defaultTaxRate,
    invoicePrefix: data.invoicePrefix,
    quotationPrefix: data.quotationPrefix,
    paymentTerms: emptyToNull(data.paymentTerms),
    bankDetails: emptyToNull(data.bankDetails),
    logoDataUrl: emptyToNull(data.logoDataUrl),
  };
}

export async function GET() {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const business = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (!business) {
    return jsonError("Business profile not found", 404);
  }

  return jsonOk({ business });
}

export async function PATCH(request: Request) {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = businessProfileSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  const existing = await prisma.businessProfile.findUnique({ where: { userId } });
  if (!existing) {
    return jsonError("Business profile not found", 404);
  }

  const business = await prisma.businessProfile.update({
    where: { userId },
    data: normalizeBusiness(parsed.data),
  });

  return jsonOk({ business });
}
