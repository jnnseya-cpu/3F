/**
 * Blog SEO — Le Congo D'Abord
 *
 * Each article targets specific DRC political search keywords and contains
 * dense internal links (dynamic hyperlinks) to platform pages, plus
 * cross-links between related articles. Content blocks support inline
 * links via the {text|href} token syntax rendered by the blog pages.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  date: string;
  author: string;
  category: string;
  readMinutes: number;
  related: string[]; // slugs — dynamic cross-linking between articles
  content: string[]; // paragraphs; {text|/path} tokens become hyperlinks
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'parti-politique-ia-rdc',
    title: "Le premier parti politique propulsé par l'IA en RDC : comment ça marche",
    description:
      "Découvrez comment Le Congo D'Abord utilise 23 agents d'intelligence artificielle pour transformer la politique congolaise : sélection des candidats au mérite, transparence financière totale et projets nationaux suivis en temps réel.",
    keywords: ['parti politique RDC', 'intelligence artificielle Congo', 'politique congolaise', 'Congo D\'Abord', 'IA Afrique'],
    date: '2026-08-01',
    author: 'Le Congo D\'Abord',
    category: 'Innovation',
    readMinutes: 6,
    related: ['selection-candidats-merite', 'transparence-cotisations'],
    content: [
      "La République Démocratique du Congo entre dans une nouvelle ère politique. {Le Congo D'Abord|/} est le premier parti politique congolais dirigé par des citoyens et renforcé par l'intelligence artificielle — pas comme un slogan, mais comme une infrastructure réelle qui fonctionne aujourd'hui.",
      "Concrètement, {23 agents IA spécialisés|/projects} travaillent pour le parti 24 heures sur 24 : validation des {inscriptions de membres|/register}, cartographie des adhérents dans les 26 provinces, {analyse des CV et sélection des candidats|/candidates}, génération de {politiques publiques|/policy}, priorisation des {besoins d'infrastructure|/infrastructure} signalés par les citoyens, et bien plus.",
      "Le principe fondamental ne change jamais : l'IA propose, les humains décident. Aucune décision finale n'est prise par une machine. L'intelligence artificielle élimine le favoritisme et l'arbitraire — les organes du parti gardent le pouvoir de décision.",
      "Chaque membre est enregistré dans une structure à 7 niveaux, du village jusqu'à la présidence, en passant par les territoires, communes et quartiers. La diaspora congolaise d'Afrique, d'Europe, des Amériques et d'Asie est pleinement intégrée. Consultez le {tableau de bord national|/dashboard} pour voir la structure en action.",
      "Et parce que la confiance se mérite, toutes les données sensibles des membres sont protégées par un chiffrement AES-256 de niveau bancaire — le même standard que les institutions financières internationales.",
      "Rejoignez le mouvement dès aujourd'hui : {inscrivez-vous en 6 étapes simples|/register} et devenez acteur de la transformation nationale.",
    ],
  },
  {
    slug: 'selection-candidats-merite',
    title: 'Fin du favoritisme : comment nos candidats sont sélectionnés au mérite',
    description:
      "La formule de scoring à 8 critères du Congo D'Abord : éducation, expérience, crédibilité locale, leadership, cotisation, formation, intégrité et langues. Découvrez la sélection politique la plus transparente d'Afrique.",
    keywords: ['candidats élections RDC', 'méritocratie Congo', 'sélection candidats', 'élections 2028 RDC', 'scoring politique'],
    date: '2026-08-01',
    author: 'Le Congo D\'Abord',
    category: 'Transparence',
    readMinutes: 5,
    related: ['parti-politique-ia-rdc', 'academie-politique-formation'],
    content: [
      "Dans la politique congolaise traditionnelle, les candidatures s'achètent. Au {Congo D'Abord|/}, elles se méritent. Notre {système de sélection des candidats|/candidates} repose sur une formule publique à 8 critères que personne — pas même le fondateur — ne peut contourner.",
      "La formule : Éducation (15%) + Expérience professionnelle (20%) + Crédibilité locale (15%) + Leadership (15%) + Statut de cotisation (10%) + {Formation complétée|/training} (10%) + Score d'intégrité (10%) + Capacité linguistique (5%). Total : 100 points.",
      "Pour chaque poste — du chef de cellule au candidat député — l'intelligence artificielle analyse tous les profils éligibles et propose les 3 meilleurs, avec scores détaillés et justifications. Les organes du parti choisissent parmi ces trois. C'est la fin des parachutages.",
      "Une règle est inviolable : sans {cotisation à jour|/contributions}, aucune éligibilité. Un dollar par mois — la cotisation la plus accessible du pays — garantit que le parti appartient à ses membres cotisants, pas à des financiers de l'ombre.",
      "Chaque membre peut améliorer son score en suivant les {14 modules de l'Académie Politique|/training} : leadership, gouvernance locale, finances publiques, éthique. Votre avenir politique dépend de votre travail, pas de vos connexions.",
      "Vérifiez votre éligibilité : {créez votre profil dès maintenant|/register} et découvrez votre score.",
    ],
  },
  {
    slug: 'transparence-cotisations',
    title: 'Un dollar par mois : la cotisation qui change la politique congolaise',
    description:
      "Pourquoi la cotisation de 1 USD/mois du Congo D'Abord est révolutionnaire : transparence financière totale, indépendance vis-à-vis des financiers occultes, et un parti qui appartient réellement à ses membres.",
    keywords: ['cotisation parti politique', 'financement politique RDC', 'transparence Congo', 'mobile money RDC', 'adhésion parti'],
    date: '2026-08-02',
    author: 'Le Congo D\'Abord',
    category: 'Transparence',
    readMinutes: 4,
    related: ['selection-candidats-merite', 'parti-politique-ia-rdc'],
    content: [
      "Qui finance un parti le contrôle. C'est pourquoi {Le Congo D'Abord|/} a fait un choix radical : le parti est financé par ses membres, à raison d'un dollar par mois — ou 12 dollars par an, la formule recommandée.",
      "Chaque paiement passe par mobile money (M-Pesa, Orange Money, Airtel Money) et est enregistré dans le {système de suivi des cotisations|/contributions}. Chaque membre voit son statut. Chaque franc est traçable. La transparence n'est pas une promesse — c'est l'architecture même du système.",
      "La cotisation n'est pas qu'une contribution financière : c'est la clé de l'éligibilité. Sans cotisation à jour, aucune nomination, aucune candidature, aucun poste de direction. Cette règle s'applique à tous, du nouveau membre au cadre national. Découvrez comment cela alimente notre {sélection de candidats au mérite|/candidates}.",
      "Avec 100 000 membres cotisants, le parti dispose de 100 000 dollars mensuels — sans devoir un seul franc à un financier occulte. C'est l'indépendance politique par la base.",
      "Votre dollar compte. {Rejoignez le parti|/register} et participez au premier financement politique 100% transparent de la RDC.",
    ],
  },
  {
    slug: 'snto-promesses-projets',
    title: 'SNTO : le système qui transforme les promesses électorales en projets réels',
    description:
      "Manifeste → Programme → Projets → Livraison → Résultats. Le Système National de Transformation Opérationnel du Congo D'Abord suit chaque promesse jusqu'à sa réalisation, avec 11 agents IA dédiés.",
    keywords: ['développement RDC', 'projets nationaux Congo', 'promesses électorales', 'infrastructure Congo', 'transformation nationale'],
    date: '2026-08-02',
    author: 'Le Congo D\'Abord',
    category: 'Développement',
    readMinutes: 7,
    related: ['parti-politique-ia-rdc', 'infrastructure-participative'],
    content: [
      "Combien de promesses électorales avez-vous vu tenir en RDC ? Le {Système National de Transformation Opérationnel (SNTO)|/projects} existe pour une raison : qu'aucune promesse du Congo D'Abord ne se perde jamais entre le discours et la réalité.",
      "Le pipeline est simple et impitoyable : Manifeste → Programme → Projets → Livraison → Résultats → Réélection. Chaque étape a son agent IA. {L'Architecte du Manifeste|/projects/manifesto-architect} transforme la vision en programmes chiffrés. Le {Concepteur de Projets|/projects/project-designer} décompose chaque programme en projets finançables.",
      "Le {Costing National|/projects/national-costing} produit des budgets professionnels — CAPEX, OPEX, trois scénarios. Le {Courtier en Financement|/projects/funding-matchmaker} identifie les bailleurs adaptés : Banque Mondiale, BAD, financements PPP, avec un score de probabilité pour chacun.",
      "Ensuite vient l'exécution : la {Structure de Livraison|/projects/delivery-structure} assigne des responsables à 7 niveaux — du politique au communautaire — et {l'Affectation des Talents|/projects/talent-assignment} trouve le meilleur membre du parti pour diriger chaque projet.",
      "Enfin, le {Centre de Commandement|/projects/command-centre} affiche tout en temps réel : projets livrés, budgets, emplois créés, classement des provinces, performance des ministres. Quand nous gouvernerons, chaque citoyen pourra vérifier chaque promesse.",
      "La feuille de route couvre 10 ans : le premier mandat pour les fondations (routes, énergie, écoles, santé), le second pour la transformation (industrialisation, rail rapide, {villes intelligentes|/projects/development-strategist}). Explorez le {SNTO complet|/projects}.",
    ],
  },
  {
    slug: 'infrastructure-participative',
    title: "Votre village a un problème ? L'IA en fait un projet d'infrastructure",
    description:
      "Route coupée, école sans toit, pas d'eau potable : avec Le Congo D'Abord, chaque problème local signalé devient un dossier d'infrastructure classé, chiffré et suivi. La démocratie participative version RDC.",
    keywords: ['infrastructure RDC', 'développement local Congo', 'eau potable RDC', 'routes Congo', 'démocratie participative'],
    date: '2026-08-03',
    author: 'Le Congo D\'Abord',
    category: 'Développement',
    readMinutes: 5,
    related: ['snto-promesses-projets', 'parti-politique-ia-rdc'],
    content: [
      "Dans chaque village congolais, on connaît les problèmes par cœur : la route impraticable à la saison des pluies, l'école dont le toit fuit, la source d'eau à deux heures de marche. Ce qui manque, ce n'est pas le diagnostic — c'est le chemin entre le problème et la solution.",
      "{L'Agent Infrastructure|/infrastructure} du Congo D'Abord crée ce chemin. N'importe quel membre peut signaler un besoin local. L'IA le classe par sévérité (Critique, Élevé, Moyen, Faible), estime la population affectée, chiffre le coût de résolution et propose des solutions pragmatiques adaptées au contexte congolais.",
      "Ces dossiers alimentent directement le {SNTO|/projects} : les besoins les plus critiques deviennent des projets nationaux, avec budget, financement et responsables. Le problème de votre village peut devenir une priorité nationale — parce qu'il est documenté, chiffré et visible.",
      "C'est aussi cela, la structure à 7 niveaux : chaque village a une cellule, chaque cellule a une voix, et cette voix remonte jusqu'au {tableau de bord national|/dashboard} que consulte la direction du parti.",
      "Votre village mérite d'être entendu. {Devenez membre|/register}, signalez vos besoins, et suivez leur progression en toute transparence.",
    ],
  },
  {
    slug: 'academie-politique-formation',
    title: "L'Académie Politique : former la prochaine génération de dirigeants congolais",
    description:
      "14 modules gratuits de formation politique : leadership, gouvernance, finances publiques, éthique, droit électoral. Comment Le Congo D'Abord forme ses membres au lieu d'acheter ses cadres.",
    keywords: ['formation politique RDC', 'leadership Congo', 'académie politique', 'formation gratuite RDC', 'jeunesse congolaise'],
    date: '2026-08-03',
    author: 'Le Congo D\'Abord',
    category: 'Formation',
    readMinutes: 4,
    related: ['selection-candidats-merite', 'transparence-cotisations'],
    content: [
      "Un parti qui n'investit pas dans la formation de ses membres achète ses cadres ailleurs — avec tout ce que cela implique. {L'Académie Politique|/training} du Congo D'Abord fait le pari inverse : former gratuitement chaque membre qui veut apprendre.",
      "Le curriculum couvre 14 modules : leadership et prise de décision, gouvernance locale, finances publiques, communication politique, éthique et intégrité, droit électoral congolais, gestion de projets, mobilisation communautaire, et plus encore.",
      "La formation n'est pas décorative : elle compte pour 10% du {score de sélection des candidats|/candidates}. Un membre formé progresse dans le parti. Un membre non formé reste à la base. C'est la méritocratie appliquée, module après module.",
      "L'IA personnalise chaque parcours : selon votre profil et vos ambitions, {l'Agent Académie|/training} recommande les modules prioritaires, l'ordre optimal et le temps nécessaire — avec l'impact estimé sur votre score.",
      "L'éducation politique est la meilleure arme contre la manipulation. {Inscrivez-vous|/register}, formez-vous, et prenez votre place dans la transformation du Congo.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
