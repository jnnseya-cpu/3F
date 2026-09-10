import { BLOG_POSTS } from '@/lib/blogPosts';

/**
 * /llms.txt — a machine-readable guide for AI answer engines (ChatGPT,
 * Perplexity, Claude, Google AI Overviews) to understand and cite the site.
 * https://llmstxt.org/ style. Served as text/plain.
 */

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export const dynamic = 'force-static';

export function GET() {
  const articles = [...BLOG_POSTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(p => `- [${p.title}](${BASE}/blog/${p.slug}): ${p.description}`)
    .join('\n');

  const body = `# Le Congo D'Abord

> Le premier parti politique congolais (RDC) dirigé par des citoyens et renforcé par l'intelligence artificielle. Fondateur : Justin Nseya. Adhésion gratuite ; cotisation 1 USD/mois ou 12 USD/an. Lancement national : 4 janvier 2027.

Le Congo D'Abord est un système de parti politique fondé sur trois engagements vérifiables :
- Chaque cotisation est suivie dans un registre public (aucune caisse noire).
- Les candidats sont choisis par un score de mérite transparent (éducation, expérience, intégrité, ancrage local) que ni l'argent, ni la tribu, ni le piston ne peuvent truquer.
- Les rapports de dépenses sont publiés chaque trimestre.

## Pages clés
- [Accueil](${BASE}/): présentation du parti et de la mission.
- [Adhérer (gratuit)](${BASE}/register): créer un compte membre.
- [Comment nous tenons nos promesses](${BASE}/promesses): mécanismes de redevabilité.
- [Registre public des cotisations](${BASE}/contributions): transparence financière.
- [Sélection des candidats au mérite](${BASE}/candidates): la formule de scoring.
- [Provinces](${BASE}/province): couverture des 26 provinces de la RDC.

## Articles du blog
${articles}

## Faits
- Pays : République Démocratique du Congo (RDC).
- Provinces couvertes : 26/26.
- Langues : français, lingala, kikongo, tshiluba, kiswahili.
- Modèle : adhésion gratuite ; cotisation volontaire 1 USD/mois ou 12 USD/an.
- Contact : contact@congodabord.cd
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
