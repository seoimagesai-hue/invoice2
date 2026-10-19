import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  companyName: z.string().max(200).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  addressLine1: z.string().max(200).optional().nullable(),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  county: z.string().max(100).optional().nullable(),
  postcode: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  discountPercent: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  status: z
    .enum(["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"])
    .default("DRAFT"),
  taxMode: z.enum(["exclusive", "inclusive", "none"]).default("exclusive"),
  notes: z.string().max(5000).optional().nullable(),
  paymentTerms: z.string().max(2000).optional().nullable(),
  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const quotationSchema = z.object({
  clientId: z.string().min(1),
  issueDate: z.string().min(1),
  validUntil: z.string().min(1),
  status: z
    .enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED", "CONVERTED"])
    .default("DRAFT"),
  taxMode: z.enum(["exclusive", "inclusive", "none"]).default("exclusive"),
  notes: z.string().max(5000).optional().nullable(),
  terms: z.string().max(5000).optional().nullable(),
  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive("Amount must be greater than 0"),
  paidAt: z.string().min(1),
  method: z.string().max(100).optional().nullable(),
  reference: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const businessProfileSchema = z.object({
  businessName: z.string().min(1).max(200),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  addressLine1: z.string().max(200).optional().nullable(),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  county: z.string().max(100).optional().nullable(),
  postcode: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  vatNumber: z.string().max(50).optional().nullable(),
  companyNumber: z.string().max(50).optional().nullable(),
  currency: z.string().length(3).default("GBP"),
  taxMode: z.enum(["exclusive", "inclusive", "none"]).default("exclusive"),
  defaultTaxRate: z.number().min(0).max(100).default(0),
  invoicePrefix: z.string().min(1).max(20).default("INV-"),
  quotationPrefix: z.string().min(1).max(20).default("QUO-"),
  paymentTerms: z.string().max(2000).optional().nullable(),
  bankDetails: z.string().max(2000).optional().nullable(),
  logoDataUrl: z.string().max(500000).optional().nullable(),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8).max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
