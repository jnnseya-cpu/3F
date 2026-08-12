'use client';

import { useState, useEffect } from 'react';
import { humanFetch } from '@/lib/humanClient';
import { Send, Bot, User, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';


function getMemberId(): string | null {
  try { return localStorage.getItem('lcd_member_id'); } catch { return null; }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface NTOSAgentPanelProps {
  agentId: string;
  agentName: string;
  agentSubtitle: string;
  agentDescription: string;
  inputLabel: string;
  placeholder: string;
  examplePrompts: string[];
  accentColor?: string;
  demoResponse: (q: string) => string;
}

export default function NTOSAgentPanel({
  agentId,
  agentName,
  agentSubtitle,
  agentDescription,
  inputLabel,
  placeholder,
  examplePrompts,
  demoResponse,
}: NTOSAgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bonjour ! Je suis l'${agentName} du Système National de Transformation Opérationnel (SNTO). ${agentDescription}\n\nComment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sendMessage = async (text?: string) => {
    const content = text || input;
    if (!content.trim() || loading) return;

    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await humanFetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName: `SNTO-${agentId}`, message: content, memberId: getMemberId() }),
      });

      if (res.ok) {
        const data = await res.json();
        const suffix = typeof data.acuRemaining === 'number' ? `\n\n— ${data.acuRemaining} ACUs restants` : '';
        setMessages(prev => [...prev, { role: 'assistant', content: data.response + suffix, timestamp: new Date() }]);
      } else if (res.status === 402) {
        const data = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `\u26a1 ${data.message || 'Action IA non disponible.'}\n\nChaque action IA consomme des ACUs (unités de calcul IA). Les ACUs s'obtiennent uniquement via la cotisation : 1 USD/mois = 5 ACUs, 12 USD/an = 80 ACUs.\n\nVoici un exemple de démonstration (sans IA) :\n\n${demoResponse(content)}`,
          timestamp: new Date(),
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: demoResponse(content), timestamp: new Date() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: demoResponse(content), timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-drc-blue px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-drc-yellow rounded-xl flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-drc-blue-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-black text-sm leading-tight">{agentName}</h3>
          <p className="text-drc-yellow text-xs font-semibold">{agentSubtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-drc-yellow" />
          <span className="text-drc-yellow text-xs font-bold">SNTO</span>
        </div>
      </div>

      {/* Example prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-2">Exemples de requêtes :</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-drc-blue' : 'bg-drc-yellow'
            }`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-white" />
                : <Bot className="w-4 h-4 text-drc-blue-dark" />}
            </div>
            <div className={`max-w-[82%] rounded-xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-drc-blue text-white rounded-tr-none'
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {mounted ? msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-drc-yellow flex items-center justify-center">
              <Bot className="w-4 h-4 text-drc-blue-dark" />
            </div>
            <div className="bg-gray-100 rounded-xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-4 h-4 text-drc-blue animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <p className="text-xs text-gray-400 mb-1.5">{inputLabel}</p>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={placeholder}
            rows={2}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-drc-blue focus:border-transparent"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-drc-blue text-white p-2 rounded-lg hover:bg-drc-blue-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-end"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
