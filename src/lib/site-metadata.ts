import type { Metadata } from "next";
import { company } from "@/config/company";

export function pageMetadata(
  path: string,
  title: string,
  description: string
): Metadata {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url =
    normalized === "/" ? company.domain : `${company.domain}${normalized}`;

  return {
    title: `${title} | ${company.tradingName}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${company.tradingName}`,
      description,
      url,
      siteName: company.tradingName,
      locale: "en_GB",
      type: "website",
    },
  };
}
