/**
 * Weekly newsletter builder — single source of the email template + links.
 * Reused by /api/newsletter/send. No dependencies: returns an HTML string.
 *
 * Sells platform features with many hyperlinks (feature grid + rotating
 * spotlight + latest blog articles). Every link is absolute (email clients
 * require it) and carries a ?utm so opens can be attributed later.
 */

import { BLOG_POSTS } from './blogPosts';

const BLUE = '#007FFF';
const YELLOW = '#FCD116';
const DARK = '#0055CC';

/** Feature → path + one-line pitch. The hyperlink catalogue the email sells. */
export const FEATURES: Array<{ path: string; label: string; pitch: string }> = [
  { path: '/register', label: "S'inscrire au parti", pitch: "Devenez membre en 6 étapes — 1 USD/mois." },
  { path: '/candidates', label: 'Sélection des candidats IA', pitch: 'Choisis au mérite, pas par argent.' },
  { path: '/contributions', label: 'Cotisations transparentes', pitch: 'Chaque dollar tracé par Mobile Money.' },
  { path: '/training', label: 'Académie Politique', pitch: '14 modules de formation gratuits.' },
  { path: '/projects', label: 'Projets nationaux (SNTO)', pitch: 'De la promesse à la livraison.' },
  { path: '/infrastructure', label: 'Infrastructure participative', pitch: 'Votre village devient un projet.' },
  { path: '/policy', label: 'Politiques publiques', pitch: 'Des propositions chiffrées, pas des slogans.' },
  { path: '/ethics', label: 'Éthique & intégrité', pitch: 'L’IA protège le parti de la corruption.' },
  { path: '/dashboard', label: 'Tableau de bord national', pitch: 'La transparence en temps réel.' },
  { path: '/growth', label: 'Moteur de croissance IA', pitch: '10 outils pour mobiliser en un clic.' },
  { path: '/province', label: 'Votre province', pitch: 'Le parti dans les 26 provinces.' },
  { path: '/invite', label: 'Inviter vos proches', pitch: '1 membre amène 1 membre.' },
];

/** Rotating weekly spotlight — one feature highlighted per week. */
const SPOTLIGHTS = [
  { path: '/candidates', title: 'Cette semaine : la sélection au mérite',
    body: "Fini le favoritisme. Notre formule à 8 critères choisit les candidats sur la compétence, l'intégrité et l'ancrage local — pas sur l'argent." },
  { path: '/training', title: "Cette semaine : l'Académie Politique",
    body: '14 modules gratuits — leadership, gouvernance, finances publiques, éthique. Chaque module suivi augmente votre score de sélection.' },
  { path: '/projects', title: 'Cette semaine : le SNTO',
    body: 'Manifeste → Programme → Projets → Livraison. 11 agents IA transforment chaque promesse en projet national suivi.' },
  { path: '/contributions', title: 'Cette semaine : la transparence financière',
    body: 'Un dollar par mois, par Mobile Money, chaque paiement tracé. Le parti appartient à ses membres cotisants — pas aux financiers de l’ombre.' },
  { path: '/growth', title: 'Cette semaine : le moteur de croissance IA',
    body: '10 outils pour créer posts, publicités, campagnes email et scripts vidéo — et faire grandir le mouvement en un clic.' },
];

function utm(base: string, path: string): string {
  const sep = path.includes('?') ? '&' : '?';
  return `${base}${path}${sep}utm_source=newsletter&utm_medium=email&utm_campaign=weekly`;
}

/**
 * Build the weekly newsletter HTML.
 * @param base absolute site URL (e.g. https://congodabord.cd)
 * @param firstName recipient first name (optional)
 * @param unsubscribeUrl absolute one-click unsubscribe link (required for compliance)
 * @param weekIndex integer to rotate the spotlight deterministically
 */
export function buildNewsletterHtml(
  base: string,
  firstName: string,
  unsubscribeUrl: string,
  weekIndex: number,
): { subject: string; html: string; text: string } {
  const spot = SPOTLIGHTS[weekIndex % SPOTLIGHTS.length];
  const latest = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,';
  const subject = `Le Congo D'Abord — ${spot.title.replace('Cette semaine : ', '')}`;

  const featureRows = FEATURES.map(f =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">
      <a href="${utm(base, f.path)}" style="color:${BLUE};font-weight:700;text-decoration:none">${f.label}</a>
      <div style="color:#666;font-size:13px">${f.pitch}</div>
    </td></tr>`).join('');

  const articleRows = latest.map(p =>
    `<li style="margin-bottom:8px">
      <a href="${utm(base, '/blog/' + p.slug)}" style="color:${BLUE};text-decoration:none">${p.title}</a>
    </li>`).join('');

  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#222">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:${BLUE};padding:24px;text-align:center">
      <div style="height:6px;background:linear-gradient(90deg,${BLUE} 33%,${YELLOW} 33%,${YELLOW} 66%,#CE1126 66%)"></div>
      <h1 style="color:#fff;margin:16px 0 4px;font-size:22px">Le Congo D'Abord</h1>
      <p style="color:${YELLOW};margin:0;font-weight:700;font-size:13px">La compétence avant les promesses</p>
    </div>
    <div style="padding:24px">
      <p style="font-size:15px">${greeting}</p>
      <p style="font-size:15px;line-height:1.6">Voici votre point hebdomadaire sur le mouvement qui transforme la RDC — un parti dirigé par des citoyens et renforcé par l'intelligence artificielle.</p>

      <div style="background:#eef5ff;border-left:4px solid ${BLUE};padding:16px;margin:20px 0;border-radius:6px">
        <h2 style="margin:0 0 8px;color:${DARK};font-size:17px">${spot.title}</h2>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6">${spot.body}</p>
        <a href="${utm(base, spot.path)}" style="display:inline-block;background:${BLUE};color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px">Découvrir →</a>
      </div>

      <h3 style="color:${DARK};font-size:16px;margin:24px 0 8px">Toute la plateforme, en un clic</h3>
      <table style="width:100%;border-collapse:collapse">${featureRows}</table>

      <h3 style="color:${DARK};font-size:16px;margin:24px 0 8px">Derniers articles</h3>
      <ul style="padding-left:18px;margin:0">${articleRows}</ul>

      <div style="text-align:center;margin:28px 0 8px">
        <a href="${utm(base, '/register')}" style="display:inline-block;background:${YELLOW};color:${DARK};padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:800;font-size:15px">Rejoindre le parti — 1 USD/mois</a>
      </div>
    </div>
    <div style="background:#f4f6f8;padding:16px 24px;text-align:center;color:#888;font-size:12px">
      <p style="margin:0 0 6px">Le Congo D'Abord · Kinshasa, RD Congo · contact@congodabord.cd</p>
      <p style="margin:0"><a href="${unsubscribeUrl}" style="color:#888">Se désabonner</a></p>
    </div>
  </div></body></html>`;

  const text = `${greeting}\n\n${spot.title}\n${spot.body}\n${utm(base, spot.path)}\n\n` +
    FEATURES.map(f => `- ${f.label}: ${utm(base, f.path)}`).join('\n') +
    `\n\nRejoindre: ${utm(base, '/register')}\n\nSe désabonner: ${unsubscribeUrl}`;

  return { subject, html, text };
}
