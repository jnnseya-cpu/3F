'use client';

import { useState } from 'react';
import { humanFetch } from '@/lib/humanClient';
import { Shield, ShieldAlert, ShieldCheck, Ban, Activity, Loader2, Bot, Lock } from 'lucide-react';

interface Incident { ip: string; type: string; detail: string; at: number; }
interface Report {
  blockedIps: Array<{ ip: string; minutesLeft: number }>;
  recentIncidents: Incident[];
  totalIncidents: number;
  aiAnalysis?: string;
}

export default function SecurityPage() {
  const [adminKey, setAdminKey] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const load = async (analyze = false) => {
    if (analyze) setAnalyzing(true); else setLoading(true);
    try {
      const res = await fetch(`/api/security/sentinel${analyze ? '?analyze=1' : ''}`, {
        headers: adminKey ? { Authorization: `Bearer ${adminKey}` } : {},
      });
      if (res.ok) setReport(await res.json());
      else if (res.status === 401) alert('Clé admin invalide');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue-dark text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-drc-yellow rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-drc-blue-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Sentinel — Agent Anti-Piratage</h1>
              <p className="text-blue-200">Protection IA en temps réel. Accès réservé aux humains.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Protection status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Bot, title: 'Blocage des bots', desc: 'Signatures de scripts et crawlers refusées', color: 'text-red-600' },
            { icon: Lock, title: 'Vérification humaine', desc: 'Preuve de travail cryptographique en navigateur', color: 'text-blue-600' },
            { icon: ShieldCheck, title: 'Anti-injection', desc: 'SQL, XSS, prompt-injection, path-traversal', color: 'text-green-600' },
          ].map(c => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <Icon className={`w-7 h-7 mb-3 ${c.color}`} />
                <h3 className="font-bold text-gray-900 text-sm">{c.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Admin controls */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-drc-blue" /> Tableau de bord Sentinel
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Clé administrateur (si configurée)</label>
              <input
                type="password"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="SENTINEL_ADMIN_KEY"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-drc-blue"
              />
            </div>
            <button onClick={() => load(false)} disabled={loading}
              className="bg-drc-blue text-white font-bold px-5 py-2 rounded-lg hover:bg-drc-blue-light disabled:opacity-40 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              Charger le rapport
            </button>
            <button onClick={() => load(true)} disabled={analyzing}
              className="bg-drc-yellow text-drc-blue-dark font-bold px-5 py-2 rounded-lg hover:bg-yellow-300 disabled:opacity-40 flex items-center gap-2">
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              Analyse IA des menaces
            </button>
          </div>
        </div>

        {report && (
          <>
            {report.aiAnalysis && (
              <div className="bg-drc-blue-dark text-white rounded-2xl p-6">
                <h3 className="font-black mb-3 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-drc-yellow" /> Analyse IA</h3>
                <pre className="whitespace-pre-wrap text-sm text-blue-100 font-sans leading-relaxed">{report.aiAnalysis}</pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2"><Ban className="w-5 h-5 text-red-600" /> IPs bloquées ({report.blockedIps.length})</h3>
                {report.blockedIps.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune IP bloquée actuellement.</p>
                ) : (
                  <div className="space-y-2">
                    {report.blockedIps.map(b => (
                      <div key={b.ip} className="flex justify-between text-sm bg-red-50 rounded-lg px-3 py-2">
                        <span className="font-mono text-red-700">{b.ip}</span>
                        <span className="text-red-500">{b.minutesLeft} min restantes</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-black text-gray-900 mb-4">Incidents récents ({report.totalIncidents} total)</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {report.recentIncidents.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucun incident.</p>
                  ) : report.recentIncidents.map((inc, i) => (
                    <div key={i} className="text-xs bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-drc-blue">{inc.type}</span>
                        <span className="text-gray-400">{new Date(inc.at).toLocaleTimeString('fr-FR')}</span>
                      </div>
                      <span className="font-mono text-gray-500">{inc.ip}</span>
                      <p className="text-gray-600 truncate">{inc.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
