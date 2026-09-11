# Production Readiness & Deployment — Le Congo D'Abord

Honest status against the 7-part hardening request. **Deploy target: Firebase
App Hosting** (Next.js SSR). Verified: `tsc` clean, `next build` green, `next
lint` 0 errors, 14 key routes return 200 in the production build, APIs degrade
safely without keys.

---

## 1. Duplicate / conflicting files — CLEANED ✅
| Action | Why |
|---|---|
| **Committed `frontend/package-lock.json`** (was `.gitignore`d) | Non-deterministic installs were a real build-stability risk. Now reproducible. |
| **Un-tracked `frontend/tsconfig.tsbuildinfo`** | Build artifact should never be committed. |
| **Removed root `.env.example`** (stale "CDP-AI OS", Postgres) | Duplicate/legacy; `frontend/.env.example` is now the single source of truth. |
| **Removed `vercel.json`** | Conflicting deploy target. One target now: Firebase App Hosting. |
| **Removed `src/app/api/auth/[...nextauth]`** + `next-auth` dep | Dormant scaffolding holding a demo credential — a liability. Real auth is `/login` + `lib/memberAuth.ts`. |
| Rewrote `.gitignore` | Clear, one rule per domain; secrets never committed; lockfile explicitly kept. |

**Not deleted (deliberate):** `backend/` (FastAPI), `database/`, `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, root `requirements.txt`. These are the **reference/alternate-runtime** implementation and are **not used by the App Hosting deploy**. They are inert but kept per the "don't delete the scale-out story" note in PROJECT_STATUS. **Recommendation:** if you have committed to App Hosting only, delete `backend/`, `database/`, `docker-compose.yml`, both `Dockerfile`s and root `requirements.txt` in a follow-up — say the word and I will.

## 2. Dependency conflicts — RESOLVED ✅
- **Removed 6 unused deps:** `axios`, `zod`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `clsx` (0 imports) + `next-auth`.
- Moved `@types/*` to `devDependencies`.
- Added **`engines.node: ">=20 <23"`** (App Hosting requires a Node range; matches Node 20/22 support).
- Regenerated `package-lock.json` cleanly. `npm install` completes; no peer-dependency errors block the build.

## 3. Firebase App Hosting + Next.js — CONFIGURED ✅ (needs your project)
Added: **`frontend/apphosting.yaml`** (runConfig + env/secrets template), **`firebase.json`** (firestore + storage rules), **`.firebaserc`** (project alias placeholder), **`storage.rules`**.
- Next.js is SSR-native on App Hosting — no `output: export`. The one `experimental.serverComponentsExternalPackages: ['firebase-admin']` is required and supported.
- **In the Firebase console, set the backend Root directory to `/frontend`.**
- **Crons moved off Vercel:** the two jobs (`/api/seo/autopilot` daily, `/api/newsletter/send` weekly) now need **Cloud Scheduler** HTTP jobs hitting those URLs with header `Authorization: Bearer $CRON_SECRET`. Until then they simply don't fire (endpoints fail-closed).

## 4. Build failures — NONE (verified) ✅
Clean `tsc --noEmit`, clean `next build`, 0 lint errors. Nothing silenced.

## 5. Authentication & Security Rules — HARDENED ✅
- Dead NextAuth removed. Real member flow: `/register` → `/login` (lookup by email/phone) → `/mon-espace`, with a signed HMAC member token (`lib/memberAuth.ts`) that is **withheld on email-only login when enforcement is on** (`needsOtp`) to prevent account takeover.
- **`firestore.rules`**: money data (`acu_accounts`, `processed_payments`, `members`, `newsletter_log`) is **deny-all to clients**; `referrals`/`blog_views`/`blog` are client-read-only. No `allow read, write: if true` anywhere.
- **`storage.rules`**: default-deny; public assets read-only; member files server-only.
- **The seal requires the Admin SDK.** These locked rules only work once a **service account** is set (server writes bypass rules; clients are locked out). Deploy rules and set the service account **together** — see §6. The Firestore simulator will pass these rules; verify money collections deny an unauthenticated `get`/`write`.

## 6. Deployable (web) — READY TO DEPLOY; I cannot press the button ⚠️
I have **no access to your Firebase project, credentials, or console**, so I cannot produce a live URL or "confirm auth works in production" — that would be false. Everything is prepared. **You run:**
```bash
npm i -g firebase-tools && firebase login
# set project id in .firebaserc, then create the App Hosting backend (root dir = /frontend)
firebase apphosting:backends:create
# create each secret, then grant the backend access:
firebase apphosting:secrets:set FIREBASE_PRIVATE_KEY   # repeat per secret in apphosting.yaml
# uncomment the matching secret lines in frontend/apphosting.yaml, then:
git push        # App Hosting builds & rolls out from the connected branch
firebase deploy --only firestore:rules,storage    # deploy the locked rules WITH the service account set
```
- **Install pop-up ("webapp pop-up"):** added `components/InstallPrompt.tsx` — a dismissible PWA install card (`beforeinstallprompt`), wired in `AppShell`, hidden once installed.

## 7. Mobile packaging — GO for PWA, defer native wrapper ✅/⏸
- **GO (PWA):** installable manifest, iOS/Android splash + icons, responsive layout, install pop-up, mobile-first funnel. This is the right first mobile step — ship the PWA.
- **Auth persistence on mobile:** session is `localStorage` (survives PWA relaunch). Full cross-device/secure re-auth needs the **OTP/SMS provider** (not yet connected) — same dependency as web.
- **NO-GO (native wrapper) until:** Firebase live + payment/OTP providers connected, so the wrapped app isn't a shell over unfinished flows. Wrap only after §6 is live.

---

## Extra — deep activation / encryption / "impenetrable" / dummy data / testing

- **Everything wired & tested at the build level.** All routes render; all Firebase/AI/payment features are code-complete and **degrade safely** without keys (ledger `configured:false`, webhook fail-closed `503`, blog views `count:null`) — no crashes, no fabricated numbers.
- **End-to-end / at-rest encryption:** field-level AES-256-GCM (`lib/crypto.ts`) + HTTPS + locked rules + `firebase-admin` server-only writes. This is strong, standard encryption. Note: "E2E" in the strict sense (only endpoints ever hold plaintext, server never can) is **not** what a party OS with server-side AI/search needs, and claiming it would be misleading — what's implemented is encryption-in-transit + field encryption-at-rest + least-privilege access, which is the correct model here.
- **"Hacker-impenetrable": not a claim any honest engineer can make.** No system is impenetrable. What exists: the Sentinel human-gate (bot/injection/PoW), per-IP rate limiting, fail-closed webhooks, idempotent + atomic money ops, deny-all rules, no secrets in the bundle. **Recommended before launch:** connect a real WAF/CAPTCHA (Cloudflare Turnstile), Sentry for monitoring, and move rate-limiting to a shared store (the current limiter is per-instance in-memory — weak across serverless).
- **Dummy data:** removed the worst integrity violations — **fabricated named individuals** on `/candidates` and in `lib/mockData.ts` are now clearly-illustrative "Profil exemple" labels (not real people). **Still present, honestly labeled:** the dashboards (`/dashboard`, `/dashboard/provincial`, `/dashboard/local`, `/ethics`, `/infrastructure`, `/policy`) render illustrative data behind `<DemoDataBanner/>`. I did **not** silently delete it because these pages would then be empty — the real fix is to wire them to live Firestore aggregations (an unbuilt feature) or convert to explicit empty states. **This is the honest gap: those dashboards show labeled demo data until Firebase is connected and per-page aggregation queries are built.**

## Honest go / no-go
- **GO now:** deterministic build, App Hosting config, locked security model, real member auth, PWA + install prompt, ≥90 SEO blog, honest data on public/trust pages.
- **BLOCKED on YOU (external accounts — no code can substitute):** Firebase service account (unblocks persistence, auth lookup, the ledger, and the rules seal), a mobile-money gateway (to actually charge), an SMS/OTP provider (secure re-auth), and the founder's real photo/bio.
- **RECOMMENDED before public launch:** Cloud Scheduler for crons, Sentry, Turnstile, shared-store rate limiting, and wiring the demo dashboards to real data (or empty states).

**Bottom line:** the platform is a *responsibly stabilised, deployable, production-grade codebase*. It is **not yet a live production service**, and cannot be until the external accounts above are connected — which only you can do. No false readiness.
