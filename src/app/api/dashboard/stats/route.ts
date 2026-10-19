import { prisma } from "@/lib/db";
import { jsonOk, requireAuthUserId } from "@/lib/api-utils";

export async function GET() {
  const auth = await requireAuthUserId();
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    clientCount,
    invoiceCount,
    quotationCount,
    invoices,
    outstandingAgg,
    paidThisMonthAgg,
  ] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.invoice.count({ where: { userId } }),
    prisma.quotation.count({ where: { userId } }),
    prisma.invoice.findMany({
      where: { userId },
      select: {
        status: true,
        totalCents: true,
        amountPaidCents: true,
      },
    }),
    prisma.invoice.aggregate({
      where: {
        userId,
        status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] },
      },
      _sum: { totalCents: true, amountPaidCents: true },
    }),
    prisma.payment.aggregate({
      where: { userId, paidAt: { gte: startOfMonth } },
      _sum: { amountCents: true },
    }),
  ]);

  const byStatus = invoices.reduce<Record<string, number>>(
    (acc: Record<string, number>, inv: { status: string }) => {
    acc[inv.status] = (acc[inv.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const totalOutstandingCents = Math.max(
    0,
    (outstandingAgg._sum.totalCents ?? 0) -
      (outstandingAgg._sum.amountPaidCents ?? 0)
  );

  return jsonOk({
    stats: {
      clientCount,
      invoiceCount,
      quotationCount,
      invoicesByStatus: byStatus,
      totalOutstandingCents,
      paidThisMonthCents: paidThisMonthAgg._sum.amountCents ?? 0,
    },
  });
}
