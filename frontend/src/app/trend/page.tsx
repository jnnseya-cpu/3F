'use client';

import { useEffect, useState, useCallback } from 'react';
import { Radar, Sparkles, CheckCircle2, Clock, Archive, Zap, RefreshCw } from 'lucide-react';

interface Opp {
  topic_id: string; market: string; locale: string;
  demand: number; opportunity_score: number; confidence: number;
  disposition: string; families: string[]; gatePassed: boolean;
  breakdown: Record<string, number>;
}
interface Brief { id: string; version: number; status: string; topic_id: string; market: string; opportunity_score: number; confidence: number; expires_at: string; allowed_channels: string[]; }

const DISPO: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  brief: { label: 'Brief éligible', cls: 'bg-emerald-50 text-emerald-700', icon: Sparkles },
  auto_eligible: { label: 'Auto (opt-in)', cls: 'bg-blue-50 text-blue-700', icon: Zap },
  watch: { label: 'Surveiller', cls: 'bg-yellow-50 text-yellow-700', icon: Clock },
  archive: { label: 'Archivé', cls: 'bg-gray-100 text-gray-500', icon: Archive },
};

export default function TrendConsole() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [o, b] = await Promise.all([
      fetch('/api/trend/opportunities').then(r => r.json()),
      fetch('/api/trend/briefs').then(r => r.json()),
    ]);
    setOpps(o.opportunities || []);
    setBriefs(b.briefs || []);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const analyzePlatform = async () => {
    setBusy(true); setMsg(null);
    const r = await fetch('/api/trend/observations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'platform' }) });
    const d = await r.json();
    setMsg(d.total > 0 ? `${d.total} signaux réels de la plateforme analysés (vues d'articles en direct).` : (d.note || 'Aucun signal réel disponible.'));
    await refresh(); setBusy(false);
  };
  const seed = async () => {
    setBusy(true); setMsg(null);
    const r = await fetch('/api/trend/observations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seed: true }) });
    const d = await r.json();
    setMsg(`Signaux d'exemple ingérés : ${d.accepted} acceptés, ${d.duplicate} doublons. Total ${d.total}.`);
    await refresh(); setBusy(false);
  };
  const create = async (o: Opp) => {
    setBusy(true); setMsg(null);
    const r = await fetch('/api/trend/briefs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'create', topic_id: o.topic_id, market: o.market }) });
    const d = await r.json();
    setMsg(r.ok ? `Brief créé (${d.brief.id})` : d.error);
    await refresh(); setBusy(false);
  };
  const approve = async (id: string) => {
    setBusy(true); setMsg(null);
    await fetch('/api/trend/briefs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'approve', id }) });
    setMsg(`Brief approuvé (${id})`); await refresh(); setBusy(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="inline-flex items-center gap-2 text-drc-yellow text-xs font-bold uppercase tracking-widest mb-3">
            <Radar className="w-4 h-4" /> Trend Intelligence · console
          </p>
          <h1 className="text-3xl md:text-4xl font-black">Lecture de la demande &amp; briefs de croissance</h1>
          <p className="text-blue-100/90 mt-2 max-w-2xl">
            Couche de pilotage sans clé : les signaux sont détectés, scorés (demande, confiance),
            puis convertis en un <strong>brief partagé</strong> pour les agents SEO et marketing. Mode brouillon.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={analyzePlatform} disabled={busy} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Radar className="w-4 h-4" /> Analyser les signaux de la plateforme
          </button>
          <button onClick={seed} disabled={busy} className="text-sm font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-drc-blue hover:text-white transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Signaux d&apos;exemple
          </button>
          <button onClick={refresh} disabled={busy} className="text-sm font-semibold text-gray-600 border border-gray-200 bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Rafraîchir
          </button>
          {msg && <span className="text-sm text-gray-600 bg-white border border-black/5 rounded-lg px-3 py-2">{msg}</span>}
        </div>

        <section>
          <h2 className="font-display text-xl font-extrabold text-gray-900 mb-3">Opportunités détectées</h2>
          {opps.length === 0 ? (
            <div className="surface p-6 text-sm text-gray-500">Aucune opportunité. Chargez des signaux pour voir le moteur de scoring en action.</div>
          ) : (
            <div className="space-y-3">
              {opps.map(o => {
                const d = DISPO[o.disposition] || DISPO.archive; const Icon = d.icon;
                return (
                  <div key={o.topic_id + o.market} className="surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">{o.topic_id} <span className="text-xs text-gray-400 font-normal">· {o.market}/{o.locale}</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">Sources : {o.families.join(', ')} · {o.gatePassed ? 'seuil franchi' : 'sous le seuil'}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${d.cls}`}><Icon className="w-3 h-3" /> {d.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <Metric label="Score" value={o.opportunity_score} accent />
                      <Metric label="Confiance" value={o.confidence} />
                      <Metric label="Demande" value={o.demand} />
                    </div>
                    {(o.disposition === 'brief' || o.disposition === 'auto_eligible') && (
                      <button onClick={() => create(o)} disabled={busy} className="btn-primary !py-2 !px-3 text-xs mt-4">Créer un brief</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl font-extrabold text-gray-900 mb-3">Briefs de croissance</h2>
          {briefs.length === 0 ? (
            <div className="surface p-6 text-sm text-gray-500">Aucun brief. Créez-en un depuis une opportunité éligible ci-dessus.</div>
          ) : (
            <div className="space-y-3">
              {briefs.map(b => (
                <div key={b.id} className="surface p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm text-gray-900">{b.id} <span className="text-xs text-gray-400">v{b.version}</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.topic_id} · {b.market} · canaux : {b.allowed_channels.join(', ')} · score {b.opportunity_score}/conf {b.confidence}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>{b.status}</span>
                    {b.status !== 'approved' && (
                      <button onClick={() => approve(b.id)} disabled={busy} className="text-xs font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-drc-blue hover:text-white transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approuver
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-xs text-gray-400">
          Chemin sans clé &amp; déterministe (aucun modèle requis). Persistance en mémoire pour cette démo ;
          la persistance Firestore et l&apos;enrichissement IA (via le routeur existant) sont les tranches suivantes.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3 text-center">
      <p className={`font-display text-2xl font-extrabold tabular-nums ${accent ? 'text-drc-blue' : 'text-gray-900'}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
    </div>
  );
}
