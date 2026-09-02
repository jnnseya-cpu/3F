# Le Congo D'Abord — Project Status (Single Source of Truth)

> This file is the authoritative record of what exists. Read it before adding
> anything, to avoid rebuilding or duplicating work already done.
> Last verified: build passes, 115 pages, working tree clean.

## What this is
An AI-powered political party platform for the DRC, founded by Mr Justin Nseya.
Membership: **1 USD/month** or **12 USD/year**. Launch target: **4 January 2027**
(Journée des Martyrs, 00:00 Kinshasa / UTC+1) — a live countdown runs in the
homepage hero (`components/LaunchCountdown.tsx`).

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

## Trust & honesty (no fabricated data shown as real)
- **Public contribution ledger** (`/api/contributions/ledger`, `components/PublicLedger.tsx`):
  aggregates REAL verified payments via the Admin SDK (webhook records amount/plan
  on each idempotency doc). Before it's live → honest "opens with the first
  contributions (2027)" state; never invents numbers or exposes member names.
- **Founder block** (`lib/founder.ts` single source, `components/FounderSection.tsx`):
  shows only truthful content — real founding statement + public pledges; the
  photo/bio/credentials slots are hidden until real facts are filled in (no
  fabricated biography for a real person). Add `/public/founder.jpg` + fill
  `bio`/`credentials` to populate.
- Removed fabricated named member financial records from `/contributions`;
  individual cotisations are private by design. Remaining illustrative charts are
  now clearly labelled **projections**, never past-tense fact.

## API routes (14 — all ✅)
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
| SEO score | Per-article on-page SEO score (0–100 + grade) computed from the article's own content — title/meta length, keyword usage, word count, internal links, cross-links; renders instantly server-side, no external service. Expandable check-by-check panel on each article. | `lib/seoScore.ts`, `components/SeoScorePanel.tsx`, `blog/[slug]/page.tsx` |
| Analytics | Meta Pixel + Google tag fired site-wide via one shared tracker: page_view on every route + conversion events (registration, AI chat, growth tools, referral share); env-gated, no-op when unset; CSP allowlisted | `lib/analytics.ts`, `components/AnalyticsScripts.tsx`, `components/PageViewTracker.tsx` |
| PWA + splash | Installable web app manifest (Android/Chrome auto-splash: blue bg + star icon) + 9 iOS apple-touch-startup-image splash screens + maskable/apple icons | `app/manifest.ts`, `layout.tsx` (appleWebApp/viewport), `public/*.png` |

## Design language (premium foundation — applies to ALL pages)
A single design foundation in `globals.css` + `tailwind.config.ts` gives every
page a premium, non-template feel — change it there, not per page:
- **Type**: body Inter, headings **Sora** (`font-display`), tightened tracking,
  antialiased + `font-feature-settings`. Headings use `color: inherit` (never
  hard-set — so white-on-blue headers stay white).
- **Depth**: layered soft shadow tokens (`--shadow-xs…xl`, `shadow-soft*`
  utilities) instead of flat drops; refined 1px hairline borders; 2xl radii.
- **Surface**: off-white body with a faint dual radial wash; `.surface`,
  `.surface-lg`, `.glass`, `.hairline` helpers.
- **Buttons**: gradient fills with inset highlight + colored shadow, hover lift.
- **Chrome**: frosted sticky glass navbar; richer gradient footer with launch pill.
- **Hero**: deep-blue gradient with the DRC flag diagonal as a soft-light tonal
  accent (not a muddy overlay) + fine SVG grain; `animate-fade-up` entrance.
Verified via Playwright screenshots (landing, register, blog, dashboard).

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
| `FIREBASE_PROJECT_ID` + `FIREBASE_API_KEY` | Member records, ACU ledger, referrals persist (REST fallback) |
| `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` (or `FIREBASE_SERVICE_ACCOUNT`) | **Admin SDK** — privileged server writer; required to deploy locked `firestore.rules` |
| `MEMBER_TOKEN_SECRET` | Turns on signed member-token auth for AI/ACU spend |
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

## Financial integrity (money path — hardened)
The money path is: BitriPay checkout → webhook → member activation + ACU credit → ACU debit on each AI action. Closed loss vectors:
- **Webhook fails closed.** No `BITRIPAY_WEBHOOK_SECRET` ⇒ 503, never activates. Signature is HMAC-SHA256 over the raw body (hex or base64) or a static shared secret, always constant-time compared.
- **Webhook is idempotent.** Each payment id is claimed once in `processed_payments/{txId}` via an atomic *create-if-absent* precondition. Replays/retries never re-credit ACUs or re-extend membership.
- **Grants come from the verified paid amount**, not client metadata (`lib/plans.ts` is the single price→benefit source). A $1 payment cannot claim the annual plan; non-USD amounts are rejected.
- **ACU debit is atomic** (compare-and-swap on the doc `updateTime`, bounded retries). Concurrent requests can't each spend the same balance → no TOCTOU free-AI race. Credit uses an atomic increment transform.
- **Failed AI actions are refunded.** chat/growth/autopilot credit the ACU back when every provider is down, so members are never charged for nothing (removes a refund/chargeback surface).
- **Cron endpoints fail closed.** No `CRON_SECRET` ⇒ 503 on `/api/seo/autopilot` (AI spend) and `/api/newsletter/send` (mass email), so neither is publicly triggerable.

### The real seal — Admin SDK + locked Firestore rules
The server previously wrote to Firestore with the Web API key, which Firestore
treats as an **unauthenticated client** — so no rule could tell our server from
an attacker holding that key. Fixed by adding the **Firebase Admin SDK**
(`lib/firebaseAdmin.ts`, service account) as the privileged writer:
- `acu.ts` (balance/debit/credit/refund/clawback), the payment webhook,
  registration, blog views, and referral tracking now **prefer the Admin SDK**
  and fall back to REST only when no service account is set (pre-launch).
- ACU debit under Admin uses a **real Firestore transaction** (not just CAS).
- **`firestore.rules`** (repo root) denies ALL client access to money data
  (`acu_accounts`, `processed_payments`, `members`, `newsletter_log`) and makes
  `referrals`/`blog_views`/`blog` read-only to clients. The Admin SDK bypasses
  these rules; attackers with the API key are locked out.
- **Chargebacks/reversals handled:** refund/chargeback/reversed webhook events
  claw back the granted ACUs (clamped ≥ 0) and set the member back to
  `pending_payment` — idempotently.
- **`memberId` bearer closed:** registration issues a signed HMAC member token
  (`lib/memberAuth.ts`); chat/growth require `x-member-token` before debiting.
  Enforced when `MEMBER_TOKEN_SECRET` is set. Client stores it at registration
  and sends it from all three AI panels.
- **Registration field-injection closed:** the register route whitelists client
  fields (no `...body` spread) so a client can't inject `paidUntil`/`status` to
  self-activate.

**GO-LIVE (do together): 1)** set `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`
(or `FIREBASE_SERVICE_ACCOUNT`) and `MEMBER_TOKEN_SECRET` in Vercel; **2)** deploy
`firestore.rules`. Until the service account is set, keep Firestore in test mode
(the REST fallback needs read/write).

### Still open (lower priority)
- **Rate limiting is per-instance in-memory** (`lib/rateLimit.ts`) — weak across
  serverless instances. Move money endpoints to a shared store (Firestore/Upstash)
  before high traffic.
- **Referral rewards**: the counter is still not authoritative — if rewards are
  ever attached, derive them server-side from real paid conversions, never from
  `/api/referral/track`.

## Audit log
- **Day-20 deep audit** (this pass): cleared all retired green-brand color
  leftovers (charts, card borders, footer, landing card, score scale) → DRC blue;
  added missing `<DemoDataBanner/>` to infrastructure & ethics; deleted orphaned
  `MemberCard.tsx`; added ESLint config (`next lint` clean); labeled the consent
  checkbox; documented dormant auth + orphaned backend above. Build & typecheck green.

## The one rule to avoid past confusion
Before building a "new" feature, **check this file and `git log` first.** If it's
already listed above, it exists — extend or fix it, don't recreate it.
