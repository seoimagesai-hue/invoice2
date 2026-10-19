import PDFDocument from "pdfkit";
import { formatMoney, fromCents, type TaxMode } from "@/lib/money";
import { company } from "@/config/company";

export interface PdfParty {
  name: string;
  email?: string | null;
  phone?: string | null;
  lines?: (string | null | undefined)[];
  vatNumber?: string | null;
}

export interface PdfLineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  discountPercent: number;
  taxRate: number;
  lineTotalCents: number;
}

export interface DocumentPdfInput {
  type: "INVOICE" | "QUOTATION";
  number: string;
  status: string;
  issueDate: Date;
  secondaryDate: Date;
  secondaryLabel: string;
  currency: string;
  taxMode: TaxMode;
  seller: PdfParty;
  client: PdfParty;
  items: PdfLineItem[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  amountPaidCents?: number;
  notes?: string | null;
  terms?: string | null;
  logoDataUrl?: string | null;
}

function collectAddress(lines?: (string | null | undefined)[]) {
  return (lines || []).filter((l): l is string => Boolean(l && l.trim()));
}

export async function generateDocumentPdf(
  input: DocumentPdfInput
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Title: `${input.type} ${input.number}`,
        Author: input.seller.name || company.tradingName,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const accent = "#1e3a5f";
    const muted = "#64748b";

    // Header
    doc.fillColor(accent).fontSize(22).font("Helvetica-Bold");
    doc.text(company.tradingName, 50, 50, { continued: false });
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(muted)
      .text("Invoice & Quotation Generator", 50, 78);

    doc
      .fillColor(accent)
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(input.type, 350, 50, { align: "right" });
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#0f172a")
      .text(input.number, 350, 74, { align: "right" });
    doc
      .fillColor(muted)
      .fontSize(9)
      .text(`Status: ${input.status.replaceAll("_", " ")}`, 350, 90, {
        align: "right",
      });

    doc.moveTo(50, 115).lineTo(545, 115).strokeColor("#e2e8f0").stroke();

    // Parties
    let y = 130;
    doc.fillColor(muted).fontSize(9).text("FROM", 50, y);
    doc.fillColor(muted).text("BILL TO", 300, y);
    y += 14;

    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold");
    doc.text(input.seller.name, 50, y, { width: 220 });
    doc.text(input.client.name, 300, y, { width: 220 });
    y += 16;

    doc.font("Helvetica").fontSize(9).fillColor("#334155");
    const sellerLines = [
      ...collectAddress(input.seller.lines),
      input.seller.email,
      input.seller.phone,
      input.seller.vatNumber ? `VAT: ${input.seller.vatNumber}` : null,
    ].filter(Boolean) as string[];

    const clientLines = [
      ...collectAddress(input.client.lines),
      input.client.email,
      input.client.phone,
    ].filter(Boolean) as string[];

    const maxLines = Math.max(sellerLines.length, clientLines.length, 1);
    for (let i = 0; i < maxLines; i++) {
      if (sellerLines[i]) doc.text(sellerLines[i], 50, y, { width: 220 });
      if (clientLines[i]) doc.text(clientLines[i], 300, y, { width: 220 });
      y += 12;
    }

    y += 10;
    doc.fillColor(muted).fontSize(9);
    doc.text(`Issue date: ${input.issueDate.toLocaleDateString("en-GB")}`, 50, y);
    doc.text(
      `${input.secondaryLabel}: ${input.secondaryDate.toLocaleDateString("en-GB")}`,
      300,
      y
    );
    y += 24;

    // Table header
    doc.rect(50, y, 495, 22).fill("#f1f5f9");
    doc.fillColor(accent).font("Helvetica-Bold").fontSize(8);
    doc.text("Description", 56, y + 7, { width: 200 });
    doc.text("Qty", 260, y + 7, { width: 40, align: "right" });
    doc.text("Unit", 305, y + 7, { width: 55, align: "right" });
    doc.text("Disc %", 365, y + 7, { width: 40, align: "right" });
    doc.text("Tax %", 410, y + 7, { width: 40, align: "right" });
    doc.text("Amount", 455, y + 7, { width: 80, align: "right" });
    y += 28;

    doc.font("Helvetica").fillColor("#0f172a").fontSize(9);
    for (const item of input.items) {
      const descHeight = doc.heightOfString(item.description, { width: 200 });
      const rowHeight = Math.max(descHeight, 14) + 8;

      if (y + rowHeight > 720) {
        doc.addPage();
        y = 50;
      }

      doc.text(item.description, 56, y, { width: 200 });
      doc.text(String(item.quantity), 260, y, { width: 40, align: "right" });
      doc.text(formatMoney(item.unitPriceCents, input.currency), 305, y, {
        width: 55,
        align: "right",
      });
      doc.text(String(item.discountPercent), 365, y, {
        width: 40,
        align: "right",
      });
      doc.text(String(item.taxRate), 410, y, { width: 40, align: "right" });
      doc.text(formatMoney(item.lineTotalCents, input.currency), 455, y, {
        width: 80,
        align: "right",
      });
      y += rowHeight;
    }

    y += 8;
    doc.moveTo(320, y).lineTo(545, y).strokeColor("#e2e8f0").stroke();
    y += 10;

    const rows: [string, number][] = [
      ["Subtotal", input.subtotalCents],
      ["Discounts", input.discountCents],
      [
        input.taxMode === "none"
          ? "Tax"
          : `Tax (${input.taxMode === "inclusive" ? "incl." : "excl."})`,
        input.taxCents,
      ],
      ["Total", input.totalCents],
    ];

    if (input.type === "INVOICE" && typeof input.amountPaidCents === "number") {
      rows.push(["Amount paid", input.amountPaidCents]);
      rows.push([
        "Outstanding",
        Math.max(0, input.totalCents - input.amountPaidCents),
      ]);
    }

    for (const [label, value] of rows) {
      const bold = label === "Total" || label === "Outstanding";
      doc
        .font(bold ? "Helvetica-Bold" : "Helvetica")
        .fillColor("#0f172a")
        .fontSize(10)
        .text(label, 320, y, { width: 120, align: "right" });
      doc.text(formatMoney(value, input.currency), 450, y, {
        width: 85,
        align: "right",
      });
      y += 16;
    }

    if (input.notes) {
      y += 16;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc.fillColor(muted).fontSize(9).font("Helvetica-Bold").text("Notes", 50, y);
      y += 12;
      doc
        .fillColor("#334155")
        .font("Helvetica")
        .fontSize(9)
        .text(input.notes, 50, y, { width: 495 });
      y += doc.heightOfString(input.notes, { width: 495 }) + 8;
    }

    if (input.terms) {
      y += 8;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc
        .fillColor(muted)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(input.type === "INVOICE" ? "Payment terms" : "Terms", 50, y);
      y += 12;
      doc
        .fillColor("#334155")
        .font("Helvetica")
        .fontSize(9)
        .text(input.terms, 50, y, { width: 495 });
    }

    doc
      .fontSize(8)
      .fillColor(muted)
      .text(
        `Generated by ${company.legalName} (Company No. ${company.companyNumber}) · ${company.domain}`,
        50,
        780,
        { align: "center", width: 495 }
      );

    // Silence unused import warning for fromCents if tree-shaken differently
    void fromCents;

    doc.end();
  });
}
