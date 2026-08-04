/**
 * AI Growth Engine — tool configurations.
 * Each tool renders through GrowthToolPanel and generates via /api/growth/generate.
 */

export interface GrowthField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

export interface GrowthTool {
  id: string;
  name: string;
  short: string;
  description: string;
  icon: string; // lucide icon name resolved in components
  color: string;
  fields: GrowthField[];
  cta: string;
  demo: (inputs: Record<string, string>) => string;
}

export const GROWTH_TOOLS: GrowthTool[] = [
  {
    id: 'social-post',
    name: 'Générateur de Posts Sociaux IA',
    short: 'Posts sociaux',
    description: 'Crée des publications optimisées pour Facebook, WhatsApp, X et Instagram — dans les 5 langues nationales.',
    icon: 'MessageSquare',
    color: 'bg-blue-600',
    cta: 'Générer le post',
    fields: [
      { id: 'topic', label: 'Sujet du post', placeholder: 'Ex : Lancement de la plateforme IA du parti', type: 'text' },
      { id: 'platform', label: 'Plateforme', placeholder: '', type: 'select', options: ['Facebook', 'WhatsApp', 'X / Twitter', 'Instagram', 'TikTok'] },
      { id: 'tone', label: 'Ton', placeholder: '', type: 'select', options: ['Inspirant', 'Informatif', 'Mobilisateur', 'Célébration'] },
      { id: 'language', label: 'Langue', placeholder: '', type: 'select', options: ['Français', 'Lingala', 'Kikongo', 'Tshiluba', 'Kiswahili'] },
    ],
    demo: (i) => `🇨🇩 ${i.topic || 'Le Congo D’Abord'} !\n\nLe premier parti politique congolais propulsé par l'intelligence artificielle est là. La compétence avant les promesses — du village jusqu'à la Présidence.\n\n✅ Sélection des candidats au mérite\n✅ Cotisation transparente : 1 USD/mois\n✅ 26 provinces, 5 langues, 1 vision\n\n👉 Rejoignez le mouvement : congodabord.cd/register\n\n#CongoDAbord #RDC #LeCongoDAbord #Kinshasa #Transformation`,
  },
  {
    id: 'advert-creator',
    name: 'Créateur de Publicités IA',
    short: 'Publicités',
    description: 'Génère des annonces publicitaires complètes pour événements, tournées provinciales et campagnes de mobilisation.',
    icon: 'Megaphone',
    color: 'bg-red-600',
    cta: 'Créer la publicité',
    fields: [
      { id: 'event', label: 'Événement ou campagne', placeholder: 'Ex : Tournée du fondateur au Katanga', type: 'text' },
      { id: 'audience', label: 'Public cible', placeholder: 'Ex : Jeunes de Lubumbashi, 18-35 ans', type: 'text' },
      { id: 'format', label: 'Format', placeholder: '', type: 'select', options: ['Affiche', 'Radio (30s)', 'Facebook Ads', 'Bannière web', 'Flyer'] },
    ],
    demo: (i) => `📢 PUBLICITÉ — ${i.event || 'Grande Tournée Nationale'}\n\n━━━━━━━━━━━━━━━\nTITRE : « Le Congo D'Abord arrive chez vous ! »\n\nACCROCHE : Votre province mérite d'être entendue. Venez rencontrer le mouvement qui remplace les promesses par des projets chiffrés.\n\nCORPS : Le premier parti politique IA de la RDC ouvre ses portes à ${i.audience || 'tous les citoyens'}. Inscription sur place : 1 USD/mois, carte de membre numérique immédiate, accès à l'Académie Politique gratuite.\n\nAPPEL À L'ACTION : Rejoignez-nous — congodabord.cd\n\nVISUEL SUGGÉRÉ : Drapeau RDC, jeunes souriants, slogan « La compétence avant les promesses » en jaune sur bleu.`,
  },
  {
    id: 'email-campaign',
    name: 'Générateur de Campagnes Email IA',
    short: 'Campagnes email',
    description: 'Séquences email complètes : bienvenue aux membres, relance de cotisation, newsletters et appels à la mobilisation.',
    icon: 'Mail',
    color: 'bg-teal-600',
    cta: 'Générer la campagne',
    fields: [
      { id: 'goal', label: 'Objectif de la campagne', placeholder: 'Ex : Relancer les membres dont la cotisation expire', type: 'text' },
      { id: 'sequence', label: 'Type', placeholder: '', type: 'select', options: ['Email unique', 'Séquence de 3 emails', 'Newsletter mensuelle'] },
    ],
    demo: (i) => `📧 CAMPAGNE EMAIL — ${i.goal || 'Bienvenue aux nouveaux membres'}\n\n━━ EMAIL 1 (Jour 0) ━━\nObjet : Bienvenue dans Le Congo D'Abord, [Prénom] !\n\nBonjour [Prénom],\n\nVous venez de rejoindre le premier parti politique congolais propulsé par l'IA. Voici vos 3 premières étapes :\n1. Activez votre cotisation (1 USD/mois) pour devenir éligible\n2. Commencez l'Académie Politique — module « Leadership » recommandé\n3. Rejoignez votre cellule locale de [Province]\n\n━━ EMAIL 2 (Jour 3) ━━\nObjet : [Prénom], votre province a besoin de vous\n\nSaviez-vous que votre score de sélection augmente avec chaque module de formation complété ? ...\n\n━━ EMAIL 3 (Jour 7) ━━\nObjet : Votre première semaine — et maintenant ?\n\nRécapitulatif personnalisé + appel à parrainer un proche.`,
  },
  {
    id: 'landing-page',
    name: 'Constructeur de Pages IA',
    short: 'Pages de destination',
    description: 'Génère la structure et les textes complets d\'une page de destination pour chaque campagne ou province.',
    icon: 'Layout',
    color: 'bg-purple-600',
    cta: 'Construire la page',
    fields: [
      { id: 'purpose', label: 'But de la page', placeholder: 'Ex : Recrutement des membres de la diaspora en Europe', type: 'text' },
      { id: 'audience', label: 'Audience', placeholder: 'Ex : Diaspora congolaise en Belgique et France', type: 'text' },
    ],
    demo: (i) => `🖥️ PAGE DE DESTINATION — ${i.purpose || 'Recrutement diaspora'}\n\n━━ SECTION HERO ━━\nTitre : « Loin du pays, proche du changement »\nSous-titre : La diaspora congolaise construit la RDC de demain — depuis Bruxelles, Paris ou Montréal.\nCTA : [Rejoindre depuis l'étranger]\n\n━━ SECTION PREUVE ━━\n• 26 provinces couvertes • 5 langues • Bureau diaspora sur 5 continents\n\n━━ SECTION BÉNÉFICES ━━\n1. Votez et pesez sur les décisions du parti à distance\n2. Cotisation mobile : 12 USD/an depuis n'importe quel pays\n3. Éligibilité aux postes diaspora du parti\n\n━━ SECTION TÉMOIGNAGE ━━\n[Emplacement : membre diaspora + photo]\n\n━━ CTA FINAL ━━\n« Le Congo a besoin de toutes ses forces. » [S'inscrire — 2 minutes]`,
  },
  {
    id: 'hashtag',
    name: 'Générateur de Hashtags IA',
    short: 'Hashtags',
    description: 'Hashtags optimisés par plateforme et par campagne pour maximiser la portée organique en RDC et dans la diaspora.',
    icon: 'Hash',
    color: 'bg-cyan-600',
    cta: 'Générer les hashtags',
    fields: [
      { id: 'topic', label: 'Sujet de la campagne', placeholder: 'Ex : Lancement plateforme, jeunesse, élections', type: 'text' },
      { id: 'platform', label: 'Plateforme', placeholder: '', type: 'select', options: ['Facebook', 'X / Twitter', 'Instagram', 'TikTok'] },
    ],
    demo: (i) => `#️⃣ HASHTAGS — ${i.topic || 'Campagne générale'} (${i.platform || 'toutes plateformes'})\n\n━━ PRINCIPAUX (toujours utiliser) ━━\n#CongoDAbord #LeCongoDAbord #RDC\n\n━━ PORTÉE NATIONALE ━━\n#Kinshasa #Lubumbashi #Goma #RDCongo #Congolais #DRCongo\n\n━━ THÉMATIQUES ━━\n#CompétenceAvantPromesses #TransformationRDC #JeunesseCongolaise #MéritocratieRDC #IAAfrique\n\n━━ DIASPORA ━━\n#DiasporaCongolaise #CongolaisDeFrance #CongolaisDeBelgique\n\n💡 Conseil : 3-5 hashtags sur Facebook, 5-10 sur Instagram, 2-3 sur X.`,
  },
  {
    id: 'video-script',
    name: 'Générateur de Scripts Vidéo IA',
    short: 'Scripts vidéo',
    description: 'Scripts prêts à tourner pour TikTok, YouTube Shorts, spots TV et messages vidéo du fondateur.',
    icon: 'Video',
    color: 'bg-orange-600',
    cta: 'Écrire le script',
    fields: [
      { id: 'topic', label: 'Sujet de la vidéo', placeholder: 'Ex : Pourquoi 1 USD/mois change tout', type: 'text' },
      { id: 'duration', label: 'Durée', placeholder: '', type: 'select', options: ['30 secondes', '60 secondes', '3 minutes', '5 minutes'] },
      { id: 'style', label: 'Style', placeholder: '', type: 'select', options: ['Face caméra', 'Voix off + images', 'Interview', 'Animation'] },
    ],
    demo: (i) => `🎬 SCRIPT VIDÉO — ${i.topic || 'Le parti IA de la RDC'} (${i.duration || '60 secondes'})\n\n[0:00-0:05] ACCROCHE\nPlan serré. « Et si votre voix comptait vraiment ? »\n\n[0:05-0:20] PROBLÈME\nImages d'archives. « Depuis des décennies, la politique congolaise fonctionne aux promesses. Les mêmes discours. Les mêmes déceptions. »\n\n[0:20-0:40] SOLUTION\nÉcran de la plateforme. « Le Congo D'Abord change les règles : les candidats sont choisis par une formule publique à 8 critères. Pas par l'argent. Chaque dollar de cotisation est tracé. Chaque promesse devient un projet suivi. »\n\n[0:40-0:55] PREUVE\n« 26 provinces. 5 langues. 23 agents IA. Un système, pas des slogans. »\n\n[0:55-1:00] APPEL À L'ACTION\nLogo + URL. « Rejoignez-nous. congodabord.cd. Le Congo d'abord. »`,
  },
  {
    id: 'performance',
    name: 'Recommandations de Performance IA',
    short: 'Performance',
    description: 'Analyse vos résultats de campagne et recommande des améliorations concrètes et priorisées.',
    icon: 'TrendingUp',
    color: 'bg-green-600',
    cta: 'Analyser',
    fields: [
      { id: 'data', label: 'Décrivez vos résultats actuels', placeholder: 'Ex : 500 abonnés Facebook, 2% d’engagement, 30 inscriptions/semaine...', type: 'textarea' },
    ],
    demo: () => `📈 RECOMMANDATIONS DE PERFORMANCE\n\n🔴 PRIORITÉ 1 — Taux d'engagement\nVotre engagement est sous la moyenne (2% vs 4-6% attendu en RDC). Action : publiez 3x/semaine en Lingala — les posts en langues nationales font +80% d'engagement au Congo.\n\n🟠 PRIORITÉ 2 — Conversion inscription\n30 inscriptions/semaine pour 500 abonnés = bon ratio, mais le volume est le frein. Action : campagne de parrainage « 1 membre amène 1 membre ».\n\n🟡 PRIORITÉ 3 — WhatsApp inexploité\nWhatsApp est le premier réseau social de la RDC. Action : créez des groupes provinciaux + partagez chaque article du blog avec le bouton WhatsApp intégré.\n\n📊 Objectif 30 jours : 2 000 abonnés, 5% engagement, 100 inscriptions/semaine.`,
  },
  {
    id: 'audience',
    name: 'Optimisation d\'Audience IA',
    short: 'Audience',
    description: 'Identifie vos segments d\'audience les plus réceptifs et comment adapter le message à chacun.',
    icon: 'Users',
    color: 'bg-rose-600',
    cta: 'Optimiser',
    fields: [
      { id: 'current', label: 'Décrivez votre audience actuelle', placeholder: 'Ex : Majorité 18-35 ans à Kinshasa, peu de femmes, peu de diaspora...', type: 'textarea' },
    ],
    demo: () => `🎯 OPTIMISATION D'AUDIENCE\n\n━━ SEGMENTS À FORT POTENTIEL ━━\n\n1. JEUNES URBAINS (18-35, Kinshasa/Lubumbashi/Goma)\nMessage : emploi, formation gratuite, méritocratie\nCanal : TikTok + WhatsApp | Moment : 18h-22h\n\n2. FEMMES ENGAGÉES (25-45)\nMessage : « Briser les barrières par le mérite » — la formule de scoring ne connaît pas le genre\nCanal : Facebook + radio locale | Sous-représentées : priorité de croissance\n\n3. DIASPORA (Europe/Amérique)\nMessage : agir pour le pays à distance, cotisation en ligne\nCanal : Facebook + email | Pouvoir de cotisation 10x supérieur\n\n4. LEADERS COMMUNAUTAIRES RURAUX\nMessage : l'infrastructure participative — votre village devient visible\nCanal : radio + relais locaux (pas d'internet fiable)\n\n💡 Répartissez le budget : 40% jeunes urbains, 25% femmes, 20% diaspora, 15% ruraux.`,
  },
  {
    id: 'analytics',
    name: 'Analytique de Campagne IA',
    short: 'Analytique',
    description: 'Transforme vos chiffres bruts en tableau de bord d\'insights : ce qui marche, ce qui échoue, où investir.',
    icon: 'BarChart3',
    color: 'bg-indigo-600',
    cta: 'Analyser les données',
    fields: [
      { id: 'metrics', label: 'Collez vos chiffres de campagne', placeholder: 'Ex : Post A : 1200 vues, 45 partages. Post B : 300 vues, 2 partages. Email : 40% ouverture...', type: 'textarea' },
    ],
    demo: () => `📊 ANALYTIQUE DE CAMPAGNE\n\n━━ CE QUI FONCTIONNE ━━\n✅ Post A (1 200 vues, 45 partages) : ratio de partage exceptionnel (3,75%). Format à répliquer : contenu vidéo + langue nationale.\n✅ Taux d'ouverture email 40% : excellent (moyenne : 21%). Vos objets sont efficaces.\n\n━━ CE QUI ÉCHOUE ━━\n❌ Post B (300 vues, 2 partages) : format texte long sans visuel. À abandonner.\n\n━━ INSIGHTS CLÉS ━━\n1. Le contenu partageable (WhatsApp-friendly) surperforme de 15x\n2. Votre audience répond mieux le soir (pic 19h-21h)\n3. Les visuels drapeau RDC génèrent +60% d'engagement\n\n━━ OÙ INVESTIR ━━\n→ 70% vidéos courtes + visuels • 30% textes\n→ Doublez la fréquence WhatsApp/Facebook, réduisez X.`,
  },
  {
    id: 'posting-time',
    name: 'Meilleurs Horaires de Publication IA',
    short: 'Horaires optimaux',
    description: 'Recommande les jours et heures de publication optimaux par plateforme pour l\'audience congolaise et diaspora.',
    icon: 'Clock',
    color: 'bg-amber-600',
    cta: 'Recommander',
    fields: [
      { id: 'platform', label: 'Plateforme', placeholder: '', type: 'select', options: ['Facebook', 'WhatsApp', 'X / Twitter', 'Instagram', 'TikTok', 'Email'] },
      { id: 'audience', label: 'Audience principale', placeholder: '', type: 'select', options: ['RDC nationale', 'Kinshasa', 'Provinces Est', 'Diaspora Europe', 'Diaspora Amériques'] },
    ],
    demo: (i) => `⏰ HORAIRES OPTIMAUX — ${i.platform || 'Facebook'} / ${i.audience || 'RDC nationale'}\n\n━━ CRÉNEAUX D'OR (heure de Kinshasa, UTC+1) ━━\n🥇 19h00-21h00 — pic de connexion après le travail\n🥈 12h30-14h00 — pause déjeuner\n🥉 06h30-08h00 — trajet matinal\n\n━━ MEILLEURS JOURS ━━\n• Mardi et jeudi : engagement maximal\n• Dimanche 17h-20h : partages familiaux élevés\n• Éviter : lundi matin, samedi matin\n\n━━ SPÉCIFICITÉS RDC ━━\n• Les données mobiles coûtent cher : les posts légers (texte + 1 image) performent mieux en semaine\n• Fin de mois (25-30) : trafic réduit — budget data épuisé\n• Diaspora Europe : décalage -1h/-2h, publier 20h-22h heure de Paris\n\n📅 Calendrier suggéré : Mar 19h · Jeu 12h30 · Dim 17h.`,
  },
];

export function getGrowthTool(id: string): GrowthTool | undefined {
  return GROWTH_TOOLS.find(t => t.id === id);
}
