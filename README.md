# SpectBill Ltd — Invoice & Quotation Generator

Production-oriented SaaS for creating, managing, downloading, and sharing professional invoices and quotations.

**Domain:** https://spectbillltd.store  
**Company:** SPECTBILL LTD (Company No. [16395245](https://find-and-update.company-information.service.gov.uk/company/16395245))  
**Registered office:** 39 Mill Lane, Portbury, Bristol, England, BS20 7TX

> This application is **not** claimed as deployed. Complete hosting, DNS, Stripe, and email configuration before launch.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Prisma 6** + SQLite (swap `DATABASE_URL` to PostgreSQL for production)
- **NextAuth.js v5** (credentials, JWT sessions)
- **PDFKit** for server-side PDF generation
- **Stripe** subscription architecture (live only when keys are set)
- **decimal.js** for monetary calculations (integer cents)

## Features

- Marketing site: Home, Features, Pricing, How It Works, FAQ, About, Contact
- Legal pages: Terms, Privacy, Cookies, Refund & Cancellation (draft — review before publish)
- Auth: register, login, logout, password reset flow
- Dashboard: overview, invoices, quotations, clients, payments, reports, business/account/billing settings
- Invoice & quotation CRUD with live totals, statuses, duplication, PDF download
- Quotation → invoice conversion (accepted only; prevents duplicate conversion)
- Payment recording with outstanding balance (PDF download never marks paid)
- Plan limits from `src/config/plans.ts`
- Cookie consent banner (essential by default; analytics/marketing only after consent)
- SEO: metadata, sitemap, robots.txt

## Quick start

```bash
# 1. Install
npm install --legacy-peer-deps

# 2. Environment
copy .env.example .env
# Set AUTH_SECRET to a long random string
# Optionally set SUPPORT_EMAIL

# 3. Database
npx prisma migrate dev

# 4. Develop
npm run dev
```

Open http://localhost:3000

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm test` | Monetary calculation unit tests |
| `npm run db:studio` | Prisma Studio |
| `npm run db:migrate` | Create/apply migrations |

## Environment variables

See `.env.example`. Critical variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma connection (`file:./dev.db` for SQLite) |
| `AUTH_SECRET` | NextAuth secret |
| `NEXT_PUBLIC_APP_URL` | App URL (use `https://spectbillltd.store` in production) |
| `SUPPORT_EMAIL` | Public support contact (required before launch) |
| `STRIPE_*` | Live subscription billing |
| `SMTP_*` | Outbound email for contact form / password reset |

### Stripe (subscriptions)

1. Create products/prices in Stripe for Starter, Professional, Business (monthly + yearly).
2. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and each `STRIPE_PRICE_*` env var.
3. Point a webhook to `/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.
4. Until configured, checkout returns a clear 503/development message — **payments are never simulated as successful**.

### Email

Without SMTP, contact messages are stored in the database and the UI reports that email is not configured. Password reset tokens are still created; delivery is reported truthfully.

## Production notes

1. Use PostgreSQL: change `provider` in `prisma/schema.prisma` and set `DATABASE_URL`.
2. Set `NEXT_PUBLIC_APP_URL=https://spectbillltd.store` and matching `AUTH_URL`.
3. Configure Stripe webhooks and SMTP.
4. Set `SUPPORT_EMAIL` to a monitored address.
5. Have legal counsel review draft policies under `/legal/*`.
6. Deploy to a Node host (Vercel, Railway, Fly.io, VPS) that supports Next.js and Prisma.

### Suggested deploy (Vercel example)

```bash
# Connect the repo, set env vars in the dashboard, then:
npx prisma migrate deploy
npm run build
```

## Security

- Passwords hashed with bcrypt
- Dashboard routes protected by middleware + server ownership checks
- Rate limiting on auth and contact endpoints
- Share links use unguessable tokens (not sequential IDs)
- Secrets only via environment variables

## Pricing config

Edit `src/config/plans.ts` for GBP prices and plan limits. UI and enforcement both read from this file. Limits are enforced on create; do not advertise “unlimited” unless limits are `null` and enforced accordingly.

## Company identity

Verified details are centralised in `src/config/company.ts` from the UK Companies House record. Do not invent addresses, phone numbers, testimonials, or certifications.
