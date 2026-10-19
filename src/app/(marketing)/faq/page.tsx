import { FaqHelpCenter } from "@/components/faq/faq-help-center";
import { faqCategories } from "@/config/faq";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "/faq",
  "FAQ",
  "Answers about SpectBill plans, billing, product features, support, and SPECTBILL LTD company information."
);

export default function FaqPage() {
  return (
    <div className="fade-in">
      <FaqHelpCenter categories={faqCategories} />
    </div>
  );
}
