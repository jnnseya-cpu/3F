/**
 * Founder profile — single source of truth for the landing founder block.
 *
 * IMPORTANT (honesty): fill ONLY verified, true information here. Any field left
 * empty is hidden on the page — we never invent biography, titles, or a track
 * record for a real person. `statement` is the founder's own message/vision
 * (positioning), not a claim of fact.
 *
 *   photoUrl     → put a real photo at /public/founder.jpg (or a URL) to show it.
 *   bio          → real biography paragraphs. Empty array = section hidden.
 *   credentials  → verified facts only (education, roles, work). Empty = hidden.
 *   birthplace   → real, or leave ''.
 */

export interface FounderCredential {
  label: string;   // e.g. "Formation", "Parcours", "Origine"
  value: string;   // the verified fact
}

export interface Founder {
  name: string;
  role: string;
  photoUrl: string;          // '' → shows initials avatar instead
  initials: string;
  statement: string[];       // founder's own words (vision / why) — paragraphs
  bio: string[];             // verified biography paragraphs ('' entries ignored)
  credentials: FounderCredential[];  // verified facts only
  pledges: string[];         // public commitments the founder/party stands behind
}

export const FOUNDER: Founder = {
  name: 'Justin Nseya',
  role: 'Fondateur & Président',
  photoUrl: '',              // ← add /public/founder.jpg then set '/founder.jpg'
  initials: 'JN',

  statement: [
    "J'ai fondé Le Congo D'Abord parce que notre pays n'a pas un problème de richesse — il a un problème de confiance. Trop de partis ont demandé la voix et l'argent des Congolais, puis ont oublié le village dès le pouvoir atteint.",
    "Nous construisons l'inverse : un parti où chaque franc cotisé est visible publiquement, et où le mérite — pas l'argent, la tribu ou le piston — décide qui vous représente. La technologie n'est pas là pour impressionner ; elle est là pour rendre la triche impossible.",
  ],

  // Fill with REAL, verifiable biography. Left empty = the section is hidden.
  bio: [],

  // Fill with REAL, verifiable facts only. Left empty = the section is hidden.
  credentials: [],

  pledges: [
    'Chaque cotisation suivie dans un registre public.',
    'Sélection des candidats par un score de mérite transparent.',
    'Rapports de dépenses publiés chaque trimestre.',
  ],
};
