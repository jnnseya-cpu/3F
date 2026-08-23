# Le Congo D'Abord — Project Status (Single Source of Truth)

> This file is the authoritative record of what exists. Read it before adding
> anything, to avoid rebuilding or duplicating work already done.
> Last verified: build passes, 115 pages, working tree clean.

## What this is
An AI-powered political party platform for the DRC, founded by Mr Justin Nseya.
Membership: **1 USD/month** or **12 USD/year**. Launch target: **2027**.

## Repo & structure
- GitHub: `jnnseya-cpu/3F`, branch `claude/gracious-allen-WiiR5`
- Monorepo: `frontend/` (Next.js 14, the live app) · `backend/` (FastAPI, 23 agents) · `shared/` · `database/`
- The **frontend** is the deployable product (Vercel, root dir = `frontend`).

## STATUS LEGEND
- ✅ BUILT & TESTED — done, do not rebuild
- 🔌 NEEDS KEY — code complete, waits on an env var / external account
- 👤 USER ACTION — only the user can do this (legal, accounts)

---

## Pages (32 routes — all ✅ built & tested)
Core: `/` `/register` `/dashboard` `/dashboard/provincial` `/dashboard/local`
`/candidates` `/contributions` `/training` `/policy` `/infrastructure` `/ethics`
SNTO: `/projects` + 11 agent pages + `/projects/command-centre`
Growth: `/growth` + `/growth/[tool]` (10 tools)
SEO: `/blog` + `/blog/[slug]` (35 articles) · `/province` + `/province/[slug]` (26 provinces)
Referral: `/invite` · Security: `/security`

## API routes (13 — all ✅)
`/api/agents/chat` · `/api/growth/generate` · `/api/members/register`
`/api/payments/checkout` · `/api/payments/webhook` · `/api/acu/balance`
`/api/referral/track` · `/api/security/challenge` · `/api/security/sentinel`
`/api/seo/autopilot` · `/api/newsletter/send` · `/api/newsletter/unsubscribe` · `/api/blog/views`
· `/api/auth/[...nextauth]`

## Systems built (✅ — each done once, do not repeat)
| System | What it does | File(s) |
|---|---|---|
| 23 AI agents | 12 party + 11 SNTO, via chat panels | `backend/ai/agents.py`, agent panels |
| AI router | Claude→OpenAI→Gemini fallback | `api/agents/chat`, `api/growth/generate` |
| ACU metering | Every AI action costs credits, no free AI | `lib/acu.ts` |
| Sentinel security | Human-only gate + bot/injection blocking | `lib/sentinel.ts`, `lib/guard.ts`, `lib/humanClient.ts` |
| Encryption | AES-256 field encryption + headers | `lib/crypto.ts`, `backend/security.py` |
| Rate limiting | Per-IP throttling | `lib/rateLimit.ts` |
| Payments | BitriPay checkout + webhook + ACU credit | `api/payments/*` |
| Member store | Firebase Firestore registration | `api/members/register` |
| Growth Engine | 10 marketing tools | `lib/growthTools.ts`, `/growth` |
| SEO engine | 35 blog articles (FR/Lingala/Swahili) + 26 province pages, JSON-LD, sitemap, robots | `lib/blogPosts.ts`, `/blog`, `/province`, `sitemap.ts`, `robots.ts` |
| SEO autopilot | Daily cron writes 1 article | `api/seo/autopilot`, `vercel.json` crons |
| Referral loop | WhatsApp invite + tracking | `/invite`, `api/referral/track` |
| Weekly newsletter | Cron sends feature-selling email (12-link grid + spotlight + latest articles) to all opted-in members; HMAC one-click unsubscribe; idempotent per ISO-week | `lib/newsletter.ts`, `api/newsletter/*`, `vercel.json` crons |
| Blog view counter | Per-article views: atomic Firestore increment (race-safe), bot-filtered + rate-limited + slug-validated; client dedupes per browser via localStorage; hidden until a real count exists (no fabricated numbers) | `api/blog/views`, `components/BlogViews.tsx`, `blog/[slug]/page.tsx` |
| Analytics | Meta Pixel + Google tag fired site-wide via one shared tracker: page_view on every route + conversion events (registration, AI chat, growth tools, referral share); env-gated, no-op when unset; CSP allowlisted | `lib/analytics.ts`, `components/AnalyticsScripts.tsx`, `components/PageViewTracker.tsx` |
| PWA + splash | Installable web app manifest (Android/Chrome auto-splash: blue bg + star icon) + 9 iOS apple-touch-startup-image splash screens + maskable/apple icons | `app/manifest.ts`, `layout.tsx` (appleWebApp/viewport), `public/*.png` |

## Design invariants (do not change without a reason)
- Party name is exactly **"Le Congo D'Abord"** everywhere.
- DRC flag colors: blue `#007FFF`, yellow `#FCD116`, red `#CE1126`.
- Fee: **$1/month or $12/year**. Never show invented member-count statistics publicly.
- Everything degrades gracefully with **zero** env keys (demo mode / graceful refusal).

---

## 🔌 NEEDS KEY (add in Vercel env vars near launch — no code needed)
| Variable | Unlocks |
|---|---|
| `ANTHROPIC_API_KEY` (+ `OPENAI_API_KEY`, `GEMINI_API_KEY`) | Real AI on all agents/tools |
| `FIREBASE_PROJECT_ID` + `FIREBASE_API_KEY` | Member records, ACU ledger, referrals persist |
| `BITRIPAY_API_KEY` + `BITRIPAY_API_URL` + `BITRIPAY_WEBHOOK_SECRET` | Real payments → bank |
| `HUMAN_GATE_SECRET`, `SENTINEL_ADMIN_KEY`, `CRON_SECRET` | Security hardening |
| `RESEND_API_KEY` (+ `NEWSLETTER_FROM`, `NEWSLETTER_SECRET`) | Weekly newsletter delivery |
| `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID` | Meta Pixel + Google tag analytics |
| `NEXT_PUBLIC_SITE_URL` | Correct canonical/sitemap URLs |

## 👤 USER ACTION (only the user can do — long lead time, start early)
1. Party legal registration (CENI / Ministry) — gates everything.
2. Domain `congodabord.cd` — register and hold.
3. BitriPay merchant account — weeks of KYB onboarding.
4. Native-speaker review of the Lingala/Swahili articles before launch.

---

## Known limitations (honest)
- Lingala/Swahili articles were AI-authored; need native review (see above).
- No native mobile app / offline mode (web only, but installable PWA).
- No CENI voter-file integration.
- **Auth is dormant scaffolding.** `/api/auth/[...nextauth]` holds a single demo
  credential and is NOT used by any page (no `useSession`/`SessionProvider`, no
  `/login` page, no protected routes). Real auth arrives with Firebase near launch.
- **`backend/` (FastAPI) is not wired to the deployed frontend.** The frontend is
  self-contained: it calls its own `frontend/src/app/api/*` routes, which talk to
  Anthropic/OpenAI/Gemini/Firebase/BitriPay directly. `backend/` is kept as the
  reference implementation of the 23 agents for a future scale-out; it is NOT dead
  by accident — do not delete without deciding the scale-out story.
- Dashboards/contributions/candidates/infrastructure/ethics show illustrative demo
  data, each wrapped in `<DemoDataBanner/>`. Real data replaces it once Firebase is live.

## Audit log
- **Day-20 deep audit** (this pass): cleared all retired green-brand color
  leftovers (charts, card borders, footer, landing card, score scale) → DRC blue;
  added missing `<DemoDataBanner/>` to infrastructure & ethics; deleted orphaned
  `MemberCard.tsx`; added ESLint config (`next lint` clean); labeled the consent
  checkbox; documented dormant auth + orphaned backend above. Build & typecheck green.

## The one rule to avoid past confusion
Before building a "new" feature, **check this file and `git log` first.** If it's
already listed above, it exists — extend or fix it, don't recreate it.
