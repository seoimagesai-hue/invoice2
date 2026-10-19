import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  calculateDocument,
  outstandingCents,
  type LineItemInput,
  type TaxMode,
} from "@/lib/money";
import { freePlanLimits, getPlan, type PlanId, type PlanLimits } from "@/config/plans";
import { nanoid } from "nanoid";

export async function getUserLimits(userId: string): Promise<PlanLimits> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (
    sub &&
    (sub.status === "active" || sub.status === "trialing") &&
    sub.planId !== "free"
  ) {
    try {
      return getPlan(sub.planId as PlanId).limits;
    } catch {
      return freePlanLimits;
    }
  }
  return freePlanLimits;
}

export async function assertClientLimit(userId: string) {
  const limits = await getUserLimits(userId);
  if (limits.maxClients === null) return;
  const count = await prisma.client.count({ where: { userId } });
  if (count >= limits.maxClients) {
    throw new Error(
      `Client limit reached (${limits.maxClients}). Upgrade your plan to add more clients.`
    );
  }
}

export async function assertInvoiceLimit(userId: string) {
  const limits = await getUserLimits(userId);
  if (limits.maxInvoicesPerMonth === null) return;
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const count = await prisma.invoice.count({
    where: { userId, createdAt: { gte: start } },
  });
  if (count >= limits.maxInvoicesPerMonth) {
    throw new Error(
      `Monthly invoice limit reached (${limits.maxInvoicesPerMonth}). Upgrade your plan to create more invoices.`
    );
  }
}

export async function assertQuotationLimit(userId: string) {
  const limits = await getUserLimits(userId);
  if (limits.maxQuotationsPerMonth === null) return;
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const count = await prisma.quotation.count({
    where: { userId, createdAt: { gte: start } },
  });
  if (count >= limits.maxQuotationsPerMonth) {
    throw new Error(
      `Monthly quotation limit reached (${limits.maxQuotationsPerMonth}). Upgrade your plan to create more quotations.`
    );
  }
}

/** Allocate next document number inside a transaction to avoid races */
export async function allocateInvoiceNumber(
  tx: Prisma.TransactionClient,
  userId: string
): Promise<string> {
  const profile = await tx.businessProfile.findUnique({ where: { userId } });
  const prefix = profile?.invoicePrefix ?? "INV-";
  const next = profile?.nextInvoiceNumber ?? 1;
  const number = `${prefix}${String(next).padStart(5, "0")}`;

  if (profile) {
    await tx.businessProfile.update({
      where: { userId },
      data: { nextInvoiceNumber: next + 1 },
    });
  } else {
    await tx.businessProfile.create({
      data: {
        userId,
        businessName: "My Business",
        nextInvoiceNumber: 2,
        nextQuotationNumber: 1,
      },
    });
  }

  return number;
}

export async function allocateQuotationNumber(
  tx: Prisma.TransactionClient,
  userId: string
): Promise<string> {
  const profile = await tx.businessProfile.findUnique({ where: { userId } });
  const prefix = profile?.quotationPrefix ?? "QUO-";
  const next = profile?.nextQuotationNumber ?? 1;
  const number = `${prefix}${String(next).padStart(5, "0")}`;

  if (profile) {
    await tx.businessProfile.update({
      where: { userId },
      data: { nextQuotationNumber: next + 1 },
    });
  } else {
    await tx.businessProfile.create({
      data: {
        userId,
        businessName: "My Business",
        nextInvoiceNumber: 1,
        nextQuotationNumber: 2,
      },
    });
  }

  return number;
}

export function buildShareToken() {
  return nanoid(32);
}

export function computeTotals(
  items: LineItemInput[],
  taxMode: TaxMode
) {
  return calculateDocument(items, taxMode);
}

export function deriveInvoiceStatus(
  status: string,
  totalCents: number,
  amountPaidCents: number,
  dueDate: Date
): string {
  if (status === "CANCELLED" || status === "DRAFT") return status;
  if (amountPaidCents <= 0) {
    if (dueDate < new Date() && status !== "DRAFT") return "OVERDUE";
    return status === "SENT" || status === "OVERDUE" ? status : "SENT";
  }
  if (amountPaidCents >= totalCents) return "PAID";
  if (dueDate < new Date()) return "OVERDUE";
  return "PARTIALLY_PAID";
}

export { outstandingCents };
