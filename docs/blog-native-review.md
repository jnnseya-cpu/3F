# Blog — Native-speaker review (Lingala & Swahili)

**Status:** all **26 French articles score ≥ 90/100** on the on-page SEO rubric
(`lib/seoScore.ts`) with FAQ + rich structured data. The **9 Lingala/Swahili
articles below need a native writer** to reach ≥ 90 — the gap is genuine content
(they are 82–156 words; the rubric needs ≥ 300 incl. FAQ), and it would be
irresponsible to auto-generate political copy in these languages without review.

## What each article needs to reach ≥ 90
Use any **French article as the template** (e.g. `parti-politique-ia-rdc`,
`selection-candidats-merite`). For each article below:
1. **Title → 40–65 characters**, containing the first word of the main keyword.
2. **Meta description → 120–155 characters**, containing the main keyword.
3. **Body → 350+ words** (natural, authentic, DRC-grounded), keeping the
   `{texte|/chemin}` internal-link tokens — aim for **5+ internal links**.
4. **Add a 3-question `faq: [{ q, a }]`** (answers 2–3 sentences) — this feeds
   the FAQ section + FAQPage schema and counts toward the word count.
5. Never invent member-count statistics.

Verify with: `npx tsx` on the audit script, or check the SEO panel on each
article page (must read ≥ 90).

## The 9 articles

### Lingala (ln)
- **lingala-parti-ia-congo** — keyword « parti politiki Congo »
  - Title (87 → 40–65): "Congo Liboso: parti ya politiki ya liboso na RDC oyo esalisami na mayele ya masini (IA)"
  - Fix: shorten title; add keyword to description; expand body 156 → 350+; add FAQ.
- **lingala-kokota-parti** — keyword « kokota parti Congo »
  - Title (75 → 40–65): "Ndenge ya kokota na parti ya politiki na Congo: dolar moko (1 USD) na sanza"
  - Fix: shorten title; expand body 101 → 350+; add FAQ.
- **lingala-kopona-candidats** — keyword « kopona ba-candidats Congo »
  - Title (74 → 40–65): "Suka ya bolamu ya bato: ndenge Congo Liboso eponaka ba-candidats na mayele"
  - Fix: shorten title + include keyword; expand body 122 → 350+; add FAQ.
- **lingala-diaspora-congo** — keyword « diaspora Congo »
  - Title (71 → 40–65): "Bana-Congo ya libanda: bosala mpo na ekolo kozanga kotika mboka na bino"
  - Fix: shorten title + include « diaspora »; expand body 99 → 350+; add FAQ.
- **lingala-mpo-na-nini-parti-sika** — keyword « parti sika Congo 2027 »
  - Title OK (57). Fix: description → 110–160 (currently 109); expand body 115 → 350+; add FAQ.

### Swahili (sw)
- **swahili-chama-ia-congo** — keyword « chama cha kisiasa Congo »
  - Title (77 → 40–65): "Congo Kwanza: chama cha kwanza cha kisiasa DRC kinachotumia akili bandia (AI)"
  - Fix: shorten title; add keyword to description; expand body 136 → 350+; add FAQ.
- **swahili-jiunge-chama** — keyword « kujiunga chama Congo »
  - Title (73 → 40–65): "Jinsi ya kujiunga na chama cha kisiasa Congo: dola moja (1 USD) kwa mwezi"
  - Fix: shorten title; expand body 82 → 350+; add FAQ.
- **swahili-chagua-wagombea** — keyword « kuchagua wagombea Congo »
  - Title (72 → 40–65): "Mwisho wa upendeleo: jinsi Congo Kwanza inavyochagua wagombea kwa ustadi"
  - Fix: shorten title + include keyword; add keyword to description; expand body 106 → 350+; add FAQ.
- **swahili-vijana-ajira-siasa** — keyword « vijana wasomi Congo »
  - Title (69 → 40–65): "Kijana msomi usiye na ajira Congo? Ustadi wako una thamani ya kisiasa"
  - Fix: shorten title + include keyword; expand body 110 → 350+; add FAQ.

All edits live in `frontend/src/lib/blogPosts.ts`.
