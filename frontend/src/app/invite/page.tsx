'use client';

import { useState, useEffect } from 'react';
import { humanFetch } from '@/lib/humanClient';
import { Users, Share2, Copy, Check, Gift, TrendingUp, Loader2, Sparkles } from 'lucide-react';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://congodabord.cd';

/** Derive a stable share code from the member id (or a random guest code). */
function getShareCode(): string {
  try {
    let code = localStorage.getItem('lcd_referral_code');
    if (!code) {
      const seed = localStorage.getItem('lcd_member_id') || Math.random().toString(36);
      code = seed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6).padEnd(6, 'X');
      localStorage.setItem('lcd_referral_code', code);
    }
    return code;
  } catch {
    return 'CONGO1';
  }
}

const MESSAGES = [
  {
    id: 'wa-personal',
    label: 'WhatsApp — personnel',
    text: (link: string) =>
      `Salut ! Je viens de rejoindre *Le Congo D'Abord*, le premier parti politique congolais dirigé par l'intelligence artificielle. 🇨🇩\n\nLes candidats sont choisis par compétence, pas par argent. La cotisation est de seulement 1 USD/mois et tout est transparent.\n\nRejoins-moi ici : ${link}`,
  },
  {
    id: 'wa-youth',
    label: 'WhatsApp — jeunes',
    text: (link: string) =>
      `🔥 Frère/Sœur, ça c'est du sérieux : *Le Congo D'Abord* forme gratuitement les jeunes au leadership et choisit ses candidats au MÉRITE.\n\nPas de piston. Pas de corruption. 1 USD/mois seulement.\n\nInscris-toi : ${link}`,
  },
  {
    id: 'wa-diaspora',
    label: 'WhatsApp — diaspora',
    text: (link: string) =>
      `De l'étranger, on peut enfin agir pour le pays. *Le Congo D'Abord* intègre pleinement la diaspora : vote, cotisation en ligne (12 USD/an), postes du parti.\n\nRejoins le mouvement : ${link}`,
  },
];

export default function InvitePage() {
  const [code, setCode] = useState('CONGO1');
  const [copied, setCopied] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setCode(getShareCode()); }, []);

  const link = `${BASE}/register?ref=${code}`;

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const loadCount = async () => {
    setLoading(true);
    try {
      const res = await humanFetch('/api/referral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, peek: true }),
      });
      if (res.ok) { const d = await res.json(); setCount(d.count); }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-drc-yellow rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-drc-blue-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Invitez, Grandissez le Mouvement</h1>
              <p className="text-blue-200">1 membre amène 1 membre. C&apos;est ainsi qu&apos;un pays se transforme.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Reward explainer */}
        <div className="bg-drc-yellow/10 border border-drc-yellow rounded-2xl p-6 flex items-start gap-4">
          <Gift className="w-8 h-8 text-drc-yellow-dark shrink-0" />
          <div>
            <h2 className="font-black text-gray-900">Chaque ami qui vous rejoint compte</h2>
            <p className="text-gray-600 text-sm mt-1">
              Partagez votre lien personnel. Chaque personne qui s&apos;inscrit et cotise grâce à vous
              vous rapproche des postes de leadership (la mobilisation compte dans votre score de sélection)
              et renforce votre cellule locale.
            </p>
          </div>
        </div>

        {/* Your link */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-3">Votre lien d&apos;invitation</h2>
          <div className="flex gap-2 flex-wrap">
            <code className="flex-1 min-w-[240px] bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-drc-blue font-mono break-all">{link}</code>
            <button
              onClick={() => copy(link, 'link')}
              className="bg-drc-blue text-white font-bold px-5 py-3 rounded-lg hover:bg-drc-blue-light flex items-center gap-2"
            >
              {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === 'link' ? 'Copié !' : 'Copier'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(MESSAGES[0].text(link))}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> WhatsApp
            </a>
          </div>
          <button onClick={loadCount} disabled={loading} className="mt-4 text-sm text-drc-blue font-semibold flex items-center gap-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {count !== null ? `${count} inscription(s) via votre lien` : 'Voir mes invitations'}
          </button>
        </div>

        {/* Ready-to-send messages */}
        <div>
          <h2 className="font-black text-gray-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-drc-blue" /> Messages prêts à partager
          </h2>
          <p className="text-gray-500 text-sm mb-4">Choisissez le message adapté, copiez, collez dans WhatsApp.</p>
          <div className="space-y-4">
            {MESSAGES.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-drc-blue bg-blue-50 px-3 py-1 rounded-full">{m.label}</span>
                  <button
                    onClick={() => copy(m.text(link), m.id)}
                    className="text-xs font-semibold text-drc-blue border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-drc-blue hover:text-white transition-colors flex items-center gap-1"
                  >
                    {copied === m.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === m.id ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 rounded-lg p-3 border border-gray-100">{m.text(link)}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
