# Truth Audit — claims vs. real code paths

Classification: REAL (works end-to-end with real data+integrations) · PARTIAL (works but needs a key to persist/complete) · STUBBED (fake/canned) · ABSENT (UI only) · BROKEN.

**Headline finding: NO feature is STUBBED-as-real or ABSENT-behind-a-live-button.** Every capability either works or **degrades honestly** (no fake success toasts, no canned AI text, no fabricated numbers). This is the opposite of the "unfit for purpose / fake dashboards" failure mode.

| Feature / claim | Status | Evidence |
|---|---|---|
| Free membership registration | PARTIAL | Real route + whitelist + token issue; persists only with Firebase, else returns an honest "queued" (not stored). |
| Login / account recovery (email or phone) | PARTIAL | Real lookup code; needs Firebase to resolve. Spend-token withheld on email-only login (`needsOtp`). |
| Member space `/mon-espace` | REAL (shell) / PARTIAL (data) | Renders; status/ACU come from APIs that need Firebase. Logged-out → redirects to `/login` (verified). |
| Public contribution ledger | REAL | Aggregates real verified payments; before live shows `configured:false` honestly. **No invented numbers.** |
| 23 AI agents / growth tools | PARTIAL | Real multi-provider calls (Claude→OpenAI→Gemini); **no keys ⇒ 503, not canned text.** ACU-metered. |
| Merit candidate scoring | REAL | `lib/scoring` computes from inputs; `/candidates` uses clearly-labeled "Profil exemple" (not real people). |
| Payments (checkout + webhook) | PARTIAL | Real BitriPay integration, fail-closed, idempotent, amount-verified; needs gateway keys. |
| Blog / SEO engine | REAL | 42 articles, FAQ/Breadcrumb/Speakable JSON-LD, `/llms.txt`, sitemap — all served (verified 200). |
| Weekly newsletter | PARTIAL | Real build + HMAC unsubscribe + idempotency; needs Resend + Cloud Scheduler. |
| Field encryption | REAL | `lib/crypto.ts` AES-256-GCM. |
| Demo dashboards | HONEST EMPTY | Converted to `PreLaunchState` — no dummy data (verified: zero dummy strings in rendered HTML). |

**Removed/neutralised earlier so nothing fake ships:** `lib/mockData.ts` (deleted), fabricated member/candidate names, invented public member-count stats, dormant NextAuth demo credential.
