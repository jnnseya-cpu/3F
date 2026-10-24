# Evidence Ledger (condensed)

| Test ID | Area | Method | Result | Evidence |
|---|---|---|---|---|
| E-01 | Build | `next build` | PASS (Compiled successfully) | terminal |
| E-02 | Types | `tsc --noEmit` | PASS (exit 0) | terminal |
| E-03 | Lint | `next lint` | PASS (0 errors, 1 non-blocking font warning) | terminal |
| E-04 | Deps | `npm audit` + remediation | prod highs 14→6; criticals/highs fixed or documented non-exploitable | DEPLOYMENT.md |
| E-05 | API fuzz | curl: empty/huge/wrong-type/traversal/null-byte/injection/no-auth/no-cron-secret | all 4xx/403/503, no 5xx stack leak | terminal |
| E-06 | Headers | `curl -I /` | 6/6 security headers present | terminal |
| E-07 | Secrets | grep NEXT_PUBLIC_* | only GA/Pixel/SiteURL (non-secret) | terminal |
| E-08 | Novice mobile | Playwright 360px slow-3G walk | landing ~2s DCL, accents OK, mon-espace→login, 0 console errors | scratchpad/nv-*.png |
| E-09 | Graceful degradation | curl ledger/webhook/AI | configured:false / 503 / 503 — honest, no fabrication | terminal |
| E-10 | Routes | 19-route smoke | all 200 | terminal |

NOT TESTED (no access): live DB, payments sandbox, AI output, email/SMS, load, deploy/rollback, restore, monitoring, privacy deletion. See human-actions.md.
