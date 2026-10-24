# Admin Setup — API keys & secrets

Every runtime secret the app reads (derived from the code), where it comes from,
and how to set it in **the admin account = Firebase App Hosting → Cloud Secret
Manager**. Run `scripts/setup-secrets.sh` to automate the self-made ones.

## 0. One-time prerequisites
```bash
npm i -g firebase-tools && firebase login
# create the App Hosting backend (root directory = /frontend); note its <BACKEND> id
```

## 1. Self-made secrets — generated for you (no provider needed)
`scripts/setup-secrets.sh --apply` generates fresh random values and sets them.
These authorise sessions, the human-gate, cron, and the admin security endpoint.

| Secret | Purpose |
|---|---|
| `MEMBER_TOKEN_SECRET` | signs member session tokens (turns on auth enforcement) |
| `HUMAN_GATE_SECRET` | Sentinel proof-of-humanity token |
| `SENTINEL_ADMIN_KEY` | admin access to the Sentinel security endpoint |
| `CRON_SECRET` | protects `/api/seo/autopilot` & `/api/newsletter/send` |
| `JWT_SECRET` | API token signing |
| `NEWSLETTER_SECRET` | HMAC for one-click unsubscribe |

```bash
BACKEND=<your-backend-id> bash scripts/setup-secrets.sh --apply
```

## 2. Provider-supplied secrets — only you can obtain (from your accounts)
For each: `firebase apphosting:secrets:set <NAME>` → paste value → `firebase apphosting:secrets:grantaccess <NAME> --backend <BACKEND>` → uncomment its line in `frontend/apphosting.yaml` → `git push`.

| Secret(s) | Source | Unlocks |
|---|---|---|
| `FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase console → Project settings → Service accounts → **Generate new private key** | **Everything persistent**: members, login, ACU ledger, public ledger, rules seal. **Set this first.** |
| `ANTHROPIC_API_KEY` *(and/or)* `OPENAI_API_KEY`, `GEMINI_API_KEY` | Anthropic / OpenAI / Google AI consoles | The 23 AI agents + growth tools (fallback order Claude→OpenAI→Gemini; ≥1 required) |
| `BITRIPAY_API_KEY`, `BITRIPAY_API_URL`, `BITRIPAY_WEBHOOK_SECRET` | mobile-money gateway merchant dashboard | Real $1 payments + webhook activation |
| `RESEND_API_KEY` | resend.com (after verifying your sending domain) | Weekly newsletter delivery |

## 3. Public config (NOT secret — set as plain `value:` in apphosting.yaml)
`NEXT_PUBLIC_SITE_URL` (your domain), `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`.
Optional model overrides (plain values): `CLAUDE_MODEL`, `OPENAI_MODEL`, `GEMINI_MODEL`, `NEWSLETTER_FROM`.

## 4. Go-live order (do Firebase + rules together)
1. Self-made secrets (`--apply`).
2. Firebase service account → then `firebase deploy --only firestore:rules,storage`.
3. ≥1 AI key.
4. Payment gateway + `MEMBER_TOKEN_SECRET` already set (OTP later for full secure re-auth).
5. Resend + Cloud Scheduler jobs (Bearer `CRON_SECRET`) for the two crons.

## Notes
- `ENCRYPTION_KEY` from older examples is **not used by the code** — ignore it.
- `FIREBASE_SERVICE_ACCOUNT` (single JSON blob) is an accepted alternative to the 3 discrete `FIREBASE_*` service-account vars.
- Secrets are **never** committed; `.env.local` (local dev) is gitignored.
