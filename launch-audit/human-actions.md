# Human Action List — what only you can do (each unblocks a NO-GO gate)

Code is as far as it can go. Each item below is an **external credential / infrastructure / content / business** action. The moment one is supplied, the audit loop resumes and the matching gate becomes testable.

| # | Action | Unblocks gate | Why only a human | What I'll do once supplied |
|---|--------|---------------|------------------|----------------------------|
| 1 | **Create Firebase project + service account**, set `FIREBASE_*` secrets in App Hosting, deploy `firestore.rules`/`storage.rules` | 3 Critical functionality, 5 Data integrity | Requires your Google Cloud account + billing | Test real register/login persistence, transactions, tenant isolation, restore drill |
| 2 | **Mobile-money gateway contract + sandbox keys** (Airtel/Orange/M-Pesa or BitriPay) | 6 Financial integrity | Merchant KYB/contract is a business+legal step | Run the full payments matrix (success/fail/timeout/duplicate/forged webhook/refund/reversal), prove zero ledger difference |
| 3 | **SMS/WhatsApp OTP provider** (Africa's Talking/Twilio) + sender registration | 3 (secure re-auth) | Account + sender approval | Test OTP issue/verify/expiry/replay, account recovery on a shared phone |
| 4 | **AI provider keys** (Anthropic/OpenAI/Gemini) with budget | 8 Reliability, AI quality | Paid accounts | Build the eval set, measure task success/hallucination/injection/cost, verify fallback |
| 5 | **Staging environment** on Firebase App Hosting + `firebase deploy` | 11 Operational, 7 Performance | Needs your project + deploy approval | Deploy→smoke→rollback drill, load/soak tests, production-config validation |
| 6 | **Monitoring/alerting** (Sentry DSN, uptime, cost alerts) | 9 Observability | Account provisioning | Trigger controlled failures, prove alerts fire to a named owner |
| 7 | **Founder real photo + verified bio**; **legal pages** (terms/privacy/refund), company registration | 2 Fitness, Privacy/Legal | Real identity + legal content/sign-off | Populate `lib/founder.ts`; wire legal pages; re-run truth audit |
| 8 | **Cloud Scheduler** jobs for `/api/seo/autopilot` + `/api/newsletter/send` (Bearer `CRON_SECRET`) | Feature completeness | Needs your GCP project | Verify cron firing + idempotency |
| 9 | **Resend (email) key** + verified sending domain | Newsletter | Domain DNS + account | Test newsletter send/unsubscribe/idempotency with captured outbox |

**Recommended order:** 1 → 4 → 2 → 3 → 5 → 6 → 7 → 8/9. Item 1 (Firebase) unblocks the most at once.
