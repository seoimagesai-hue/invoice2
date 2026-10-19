import type { DocumentPdfInput, PdfParty } from "@/lib/pdf";
import { calculateLine, type TaxMode } from "@/lib/money";

type ClientRecord = {
  name: string;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string | null;
};

type BusinessProfileRecord = {
  businessName: string;
  email: string | null;
  phone: string | null;
  vatNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string | null;
  logoDataUrl: string | null;
};

type LineItemRecord = {
  description: string;
  quantity: number;
  unitPriceCents: number;
  discountPercent: number;
  taxRate: number;
  sortOrder: number;
};

type InvoiceWithRelations = {
  number: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  taxMode: string;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  amountPaidCents: number;
  notes: string | null;
  paymentTerms: string | null;
  items: LineItemRecord[];
  client: ClientRecord;
};

type QuotationWithRelations = {
  number: string;
  status: string;
  issueDate: Date;
  validUntil: Date;
  currency: string;
  taxMode: string;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  notes: string | null;
  terms: string | null;
  items: LineItemRecord[];
  client: ClientRecord;
};

function partyFromClient(client: ClientRecord): PdfParty {
  return {
    name: client.companyName || client.name,
    email: client.email,
    phone: client.phone,
    lines: [
      client.addressLine1,
      client.addressLine2,
      [client.city, client.county].filter(Boolean).join(", ") || null,
      client.postcode,
      client.country,
    ],
  };
}

function partyFromBusiness(profile: BusinessProfileRecord): PdfParty {
  return {
    name: profile.businessName,
    email: profile.email,
    phone: profile.phone,
    vatNumber: profile.vatNumber,
    lines: [
      profile.addressLine1,
      profile.addressLine2,
      [profile.city, profile.county].filter(Boolean).join(", ") || null,
      profile.postcode,
      profile.country,
    ],
  };
}

export function invoiceToPdfInput(
  invoice: InvoiceWithRelations,
  profile: BusinessProfileRecord
): DocumentPdfInput {
  return {
    type: "INVOICE",
    number: invoice.number,
    status: invoice.status,
    issueDate: invoice.issueDate,
    secondaryDate: invoice.dueDate,
    secondaryLabel: "Due date",
    currency: invoice.currency,
    taxMode: invoice.taxMode as TaxMode,
    seller: partyFromBusiness(profile),
    client: partyFromClient(invoice.client),
    items: invoice.items
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => {
        const line = calculateLine(
          {
            description: item.description,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            discountPercent: item.discountPercent,
            taxRate: item.taxRate,
          },
          invoice.taxMode as TaxMode
        );
        return {
          description: item.description,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          discountPercent: item.discountPercent,
          taxRate: item.taxRate,
          lineTotalCents: line.lineTotalCents,
        };
      }),
    subtotalCents: invoice.subtotalCents,
    discountCents: invoice.discountCents,
    taxCents: invoice.taxCents,
    totalCents: invoice.totalCents,
    amountPaidCents: invoice.amountPaidCents,
    notes: invoice.notes,
    terms: invoice.paymentTerms,
    logoDataUrl: profile.logoDataUrl,
  };
}

export function quotationToPdfInput(
  quotation: QuotationWithRelations,
  profile: BusinessProfileRecord
): DocumentPdfInput {
  return {
    type: "QUOTATION",
    number: quotation.number,
    status: quotation.status,
    issueDate: quotation.issueDate,
    secondaryDate: quotation.validUntil,
    secondaryLabel: "Valid until",
    currency: quotation.currency,
    taxMode: quotation.taxMode as TaxMode,
    seller: partyFromBusiness(profile),
    client: partyFromClient(quotation.client),
    items: quotation.items
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => {
        const line = calculateLine(
          {
            description: item.description,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            discountPercent: item.discountPercent,
            taxRate: item.taxRate,
          },
          quotation.taxMode as TaxMode
        );
        return {
          description: item.description,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          discountPercent: item.discountPercent,
          taxRate: item.taxRate,
          lineTotalCents: line.lineTotalCents,
        };
      }),
    subtotalCents: quotation.subtotalCents,
    discountCents: quotation.discountCents,
    taxCents: quotation.taxCents,
    totalCents: quotation.totalCents,
    notes: quotation.notes,
    terms: quotation.terms,
    logoDataUrl: profile.logoDataUrl,
  };
}
