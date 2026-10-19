/**
 * Verified company identity from UK Companies House
 * https://find-and-update.company-information.service.gov.uk/company/16395245
 */
export const company = {
  legalName: "SPECTBILL LTD",
  tradingName: "SpectBill",
  companyNumber: "16395245",
  companyType: "Private limited Company",
  /** As shown on Companies House at time of build; verify before publication */
  companyStatus: "Active",
  incorporatedOn: "17 April 2025",
  natureOfBusiness: "62012 - Business and domestic software development",
  companiesHouseUrl:
    "https://find-and-update.company-information.service.gov.uk/company/16395245",
  registeredOffice: {
    line1: "39 Mill Lane",
    line2: "Portbury",
    city: "Bristol",
    country: "England",
    postcode: "BS20 7TX",
    full: "39 Mill Lane, Portbury, Bristol, England, BS20 7TX",
  },
  domain: "https://spectbillltd.store",
  /** Set SUPPORT_EMAIL in environment before launch */
  supportEmailEnvKey: "SUPPORT_EMAIL",
  jurisdiction: "England and Wales",
} as const;

export function getSupportEmail(): string | null {
  const email = process.env.SUPPORT_EMAIL?.trim();
  return email && email.length > 0 ? email : null;
}
