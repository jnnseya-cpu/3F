'use client';

import { useEffect, useState, useCallback } from 'react';
import { Radar, Sparkles, CheckCircle2, Clock, Archive, Zap, RefreshCw, Lock } from 'lucide-react';

/**
 * Operator-only Trend Intelligence console. NOT linked anywhere and NOT visible
 * to users: the trend layer runs invisibly in the background (see lib/trend/cycle
 * + the SEO autopilot cron). This page exists purely for operator oversight and
 * requires the admin key; every API call is admin-gated server-side.
 */
interface Opp { topic_id: string; market: string; locale: string; demand: number; opportunity_score: number; confidence: number; disposition: string; families: string[]; gatePassed: boolean; }
interface Brief { id: string; version: number; status: string; topic_id: string; market: string; opportunity_score: number; confidence: number; allowed_channels: string[]; }

const DISPO: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  brief: { label: 'Brief éligible', cls: 'bg-emerald-50 text-emerald-700', icon: Sparkles },
  auto_eligible: { label: 'Auto (opt-in)', cls: 'bg-blue-50 text-blue-700', icon: Zap },
  watch: { label: 'Surveiller', cls: 'bg-yellow-50 text-yellow-700', icon: Clock },
  archive: { label: 'Archivé', cls: 'bg-gray-100 text-gray-500', icon: Archive },
};

export default function TrendConsole() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [opps, setOpps] = useState<Opp[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { try { const k = sessionStorage.getItem('lcd_admin_key'); if (k) setKey(k); } catch { /* */ } }, []);
  const H = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }), [key]);

  const refresh = useCallback(async () => {
    const [o, b] = await Promise.all([
      fetch('/api/trend/opportunities', { headers: H() }),
      fetch('/api/trend/briefs', { headers: H() }),
    ]);
    if (o.status === 401 || b.status === 401) { setAuthed(false); return; }
    setAuthed(true);
    setOpps((await o.json()).opportunities || []);
    setBriefs((await b.json()).briefs || []);
  }, [H]);

  const unlock = async () => {
    try { sessionStorage.setItem('lcd_admin_key', key); } catch { /* */ }
    setMsg(null); await refresh();
  };
  const post = async (body: object) => { const r = await fetch('/api/trend/observations', { method: 'POST', headers: H(), body: JSON.stringify(body) }); return r.json(); };

  const analyzePlatform = async () => { setBusy(true); const d = await post({ source: 'platform' }); setMsg(d.total > 0 ? `${d.total} signaux réels analysés.` : (d.note || 'Aucun signal réel.')); await refresh(); setBusy(false); };
  const seed = async () => { setBusy(true); const d = await post({ seed: true }); setMsg(`Exemple : ${d.accepted} acceptés. Total ${d.total}.`); await refresh(); setBusy(false); };
  const create = async (o: Opp) => { setBusy(true); const r = await fetch('/api/trend/briefs', { method: 'POST', headers: H(), body: JSON.stringify({ op: 'create', topic_id: o.topic_id, market: o.market }) }); const d = await r.json(); setMsg(r.ok ? `Brief créé (${d.brief.id})` : d.error); await refresh(); setBusy(false); };
  const approve = async (id: string) => { setBusy(true); await fetch('/api/trend/briefs', { method: 'POST', headers: H(), body: JSON.stringify({ op: 'approve', id }) }); setMsg(`Approuvé (${id})`); await refresh(); setBusy(false); };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="surface-lg p-8 w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4"><Lock className="w-6 h-6 text-drc-blue" /></div>
          <h1 className="font-display text-xl font-extrabold text-gray-900">Console opérateur — Trend Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">Accès réservé. La couche de tendance fonctionne automatiquement en arrière-plan ; cette page sert uniquement à la supervision.</p>
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="Clé administrateur (SENTINEL_ADMIN_KEY)" className="form-input mb-3" />
          <button onClick={unlock} className="btn-primary w-full">Déverrouiller</button>
          {msg && <p className="text-sm text-red-600 mt-3">{msg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="inline-flex items-center gap-2 text-drc-yellow text-xs font-bold uppercase tracking-widest mb-2"><Radar className="w-4 h-4" /> Opérateur · Trend Intelligence</p>
          <h1 className="text-2xl md:text-3xl font-black">Supervision de la couche de tendance</h1>
          <p className="text-blue-100/90 mt-1 text-sm max-w-2xl">Fonctionne automatiquement (cron). Cette vue permet de superviser les signaux, scores et briefs. Invisible pour les utilisateurs.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={analyzePlatform} disabled={busy} className="btn-primary flex items-center gap-2 disabled:opacity-60"><Radar className="w-4 h-4" /> Analyser les signaux</button>
          <button onClick={seed} disabled={busy} className="text-sm font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-drc-blue hover:text-white transition-colors flex items-center gap-2"><Sparkles className="w-4 h-4" /> Exemple</button>
          <button onClick={refresh} disabled={busy} className="text-sm font-semibold text-gray-600 border border-gray-200 bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Rafraîchir</button>
          {msg && <span className="text-sm text-gray-600 bg-white border border-black/5 rounded-lg px-3 py-2">{msg}</span>}
        </div>

        <section>
          <h2 className="font-display text-xl font-extrabold text-gray-900 mb-3">Opportunités détectées</h2>
          {opps.length === 0 ? <div className="surface p-6 text-sm text-gray-500">Aucune opportunité.</div> : (
            <div className="space-y-3">{opps.map(o => { const d = DISPO[o.disposition] || DISPO.archive; const Icon = d.icon; return (
              <div key={o.topic_id + o.market} className="surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-bold text-gray-900">{o.topic_id} <span className="text-xs text-gray-400 font-normal">· {o.market}/{o.locale}</span></p><p className="text-xs text-gray-500 mt-0.5">Sources : {o.families.join(', ')}</p></div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${d.cls}`}><Icon className="w-3 h-3" /> {d.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4"><Metric label="Score" value={o.opportunity_score} accent /><Metric label="Confiance" value={o.confidence} /><Metric label="Demande" value={o.demand} /></div>
                {(o.disposition === 'brief' || o.disposition === 'auto_eligible') && <button onClick={() => create(o)} disabled={busy} className="btn-primary !py-2 !px-3 text-xs mt-4">Créer un brief</button>}
              </div>); })}</div>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl font-extrabold text-gray-900 mb-3">Briefs de croissance</h2>
          {briefs.length === 0 ? <div className="surface p-6 text-sm text-gray-500">Aucun brief.</div> : (
            <div className="space-y-3">{briefs.map(b => (
              <div key={b.id} className="surface p-5 flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-mono text-sm text-gray-900">{b.id} <span className="text-xs text-gray-400">v{b.version}</span></p><p className="text-xs text-gray-500 mt-0.5">{b.topic_id} · {b.market} · {b.allowed_channels.join(', ')} · score {b.opportunity_score}/conf {b.confidence}</p></div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>{b.status}</span>
                  {b.status !== 'approved' && <button onClick={() => approve(b.id)} disabled={busy} className="text-xs font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-drc-blue hover:text-white flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Approuver</button>}
                </div>
              </div>))}</div>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (<div className="rounded-xl border border-black/5 bg-white p-3 text-center"><p className={`font-display text-2xl font-extrabold tabular-nums ${accent ? 'text-drc-blue' : 'text-gray-900'}`}>{value}</p><p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p></div>);
}
