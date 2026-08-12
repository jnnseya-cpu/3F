'use client';

import { useState } from 'react';
import { humanFetch } from '@/lib/humanClient';
import { Loader2, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';
import { getGrowthTool } from '@/lib/growthTools';


function getMemberId(): string | null {
  try { return localStorage.getItem('lcd_member_id'); } catch { return null; }
}

export default function GrowthToolPanel({ toolId }: { toolId: string }) {
  const tool = getGrowthTool(toolId);
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    tool?.fields.forEach(f => {
      init[f.id] = f.type === 'select' && f.options?.length ? f.options[0] : '';
    });
    return init;
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  if (!tool) return null;

  const generate = async () => {
    setLoading(true);
    setOutput('');
    setIsDemo(false);
    try {
      const res = await humanFetch('/api/growth/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, inputs, memberId: getMemberId() }),
      });
      if (res.ok) {
        const data = await res.json();
        const suffix = typeof data.acuRemaining === 'number' ? `\n\n— ${data.acuRemaining} ACUs restants` : '';
        setOutput(data.output + suffix);
      } else if (res.status === 402) {
        const d = await res.json().catch(() => ({}));
        setOutput(`\u26a1 ${d.message || 'Action IA non disponible.'}\n\nChaque génération consomme 2 ACUs. Les ACUs s'obtiennent via la cotisation : 1 USD/mois = 5 ACUs, 12 USD/an = 80 ACUs.\n\n──────────\nEXEMPLE DE DÉMONSTRATION (sans IA) :\n\n${tool.demo(inputs)}`);
        setIsDemo(true);
      } else {
        setOutput(tool.demo(inputs));
        setIsDemo(true);
      }
    } catch {
      setOutput(tool.demo(inputs));
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  // Enabled when the tool has no free-text fields (select-only tools),
  // or at least one free-text field is filled.
  const textFields = tool.fields.filter(f => f.type !== 'select');
  const canGenerate = textFields.length === 0 || textFields.some(f => inputs[f.id]?.trim());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-black text-gray-900 mb-4">Paramètres</h2>
        <div className="space-y-4">
          {tool.fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={inputs[field.id] || ''}
                  onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-drc-blue"
                />
              ) : field.type === 'select' ? (
                <select
                  value={inputs[field.id] || ''}
                  onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-drc-blue bg-white"
                >
                  {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={inputs[field.id] || ''}
                  onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-drc-blue"
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={generate}
          disabled={loading || !canGenerate}
          className="mt-6 w-full bg-drc-blue text-white font-black py-3 rounded-xl hover:bg-drc-blue-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Génération en cours…' : tool.cta}
        </button>
      </div>

      {/* Output */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900">Résultat</h2>
          {output && (
            <div className="flex gap-2">
              <button
                onClick={generate}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <RotateCcw className="w-3 h-3" /> Régénérer
              </button>
              <button
                onClick={copy}
                className="flex items-center gap-1 text-xs font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-drc-blue hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-[300px]">
          {loading && (
            <div className="h-full flex items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
          {!loading && !output && (
            <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm px-8">
              Remplissez les paramètres et cliquez sur «&nbsp;{tool.cta}&nbsp;» — le résultat apparaîtra ici, prêt à copier.
            </div>
          )}
          {output && (
            <>
              {isDemo && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                  Exemple de démonstration — la génération IA en direct s&apos;activera avec les clés API.
                </p>
              )}
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans bg-gray-50 rounded-xl p-4 border border-gray-100">{output}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
