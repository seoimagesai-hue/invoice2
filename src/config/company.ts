/**
 * Verified company identity from UK Companies House
 * https://find-and-update.company-information.service.gov.uk/company/17267839
 */
export const company = {
  legalName: "LOCAL SEO WISER LTD",
  tradingName: "DevWiser",
  companyNumber: "17267839",
  companyType: "Private limited Company",
  companyStatus: "Active",
  incorporatedOn: "8 June 2026",
  natureOfBusiness:
    "62012 - Business and domestic software development; 73110 - Advertising agencies",
  companiesHouseUrl:
    "https://find-and-update.company-information.service.gov.uk/company/17267839",
  registeredOffice: {
    line1: "Office 1267 85 Dunstall Hill",
    line2: "",
    city: "Wolverhampton",
    country: "United Kingdom",
    postcode: "WV6 0SR",
    full: "Office 1267 85 Dunstall Hill, Wolverhampton, United Kingdom, WV6 0SR",
  },
  domain: "https://devwiser.uk",
  /** Set SUPPORT_EMAIL in environment before launch */
  supportEmailEnvKey: "SUPPORT_EMAIL",
  jurisdiction: "England and Wales",
} as const;

export function getSupportEmail(): string | null {
  const email = process.env.SUPPORT_EMAIL?.trim();
  return email && email.length > 0 ? email : null;
}
