import type { MetadataRoute } from "next";
import { company } from "@/config/company";

const publicPaths = [
  "",
  "/features",
  "/pricing",
  "/how-it-works",
  "/faq",
  "/about",
  "/contact",
  "/register",
  "/login",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/refunds",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.domain.replace(/\/$/, "");

  return publicPaths.map((path) => ({
    url: path ? `${base}${path}` : base,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/legal") ? 0.5 : 0.8,
  }));
}
