'use client';

import { useState, useEffect } from 'react';
import { trackAIAction } from '@/lib/analytics';
import { humanFetch } from '@/lib/humanClient';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';


function getMemberId(): string | null {
  try { return localStorage.getItem('lcd_member_id'); } catch { return null; }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAgentPanelProps {
  agentName: string;
  agentDescription: string;
  placeholderText?: string;
  systemContext?: string;
}

export default function AIAgentPanel({
  agentName,
  agentDescription,
  placeholderText = 'Posez votre question à cet agent IA...',
}: AIAgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bonjour ! Je suis l'${agentName} du Le Congo D’Abord. ${agentDescription} Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    trackAIAction(agentName);

    try {
      const res = await humanFetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName, message: input, memberId: getMemberId() }),
      });

      if (res.ok) {
        const data = await res.json();
        const suffix = typeof data.acuRemaining === 'number' ? `\n\n— ${data.acuRemaining} ACUs restants` : '';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response + suffix,
          timestamp: new Date(),
        }]);
      } else if (res.status === 402) {
        const d = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `\u26a1 ${d.message || 'Action IA non disponible.'}\n\nChaque action IA consomme des ACUs. Cotisez pour recharger (1 USD/mois = 5 ACUs, 12 USD/an = 80 ACUs).\n\nExemple de démonstration (sans IA) :\n\n${getDemoResponse(agentName, input)}`,
          timestamp: new Date(),
        }]);
      } else {
        // Demo response when API is not available
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: getDemoResponse(agentName, input),
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: getDemoResponse(agentName, input),
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-drc-blue px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-drc-yellow rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-drc-blue-dark" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">{agentName}</h3>
          <p className="text-blue-200 text-xs">{agentDescription}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-drc-yellow" />
          <span className="text-drc-yellow text-xs font-semibold">CDP-AI</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-drc-blue' : 'bg-drc-yellow'
            }`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-white" />
                : <Bot className="w-4 h-4 text-drc-blue-dark" />
              }
            </div>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
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
      <div className="border-t border-gray-200 p-3 flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={1}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-drc-blue focus:border-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="bg-drc-blue text-white p-2 rounded-lg hover:bg-drc-blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function getDemoResponse(agentName: string, question: string): string {
  const q = question.toLowerCase();

  if (q.includes('candidat') || q.includes('proposer') || q.includes('élire')) {
    return `En tant qu'Agent de Sélection CDP-AI, je peux proposer les 3 meilleurs candidats pour n'importe quel rôle dans notre structure. Pour cela, j'analyse :\n\n• Niveau d'éducation (15%)\n• Expérience professionnelle (20%)\n• Crédibilité locale (15%)\n• Leadership (15%)\n• Statut de cotisation (10%)\n• Formation complétée (10%)\n• Score d'intégrité (10%)\n• Capacité linguistique (5%)\n\nPour une sélection concrète, accédez à la page "Candidats IA" et sélectionnez le rôle souhaité.`;
  }

  if (q.includes('cotisation') || q.includes('paiement') || q.includes('5 usd')) {
    return `La cotisation mensuelle obligatoire est de **1 USD par mois**.\n\nRègle stricte : aucun membre avec une cotisation non à jour ne peut être éligible pour :\n• Une nomination interne\n• Un rôle de leadership\n• La liste des candidats aux élections\n• Les pools ministériels ou nationaux\n\nStatuts possibles : Actif ✓ | Période de grâce ⏳ | Suspendu ✗ | Inéligible ✗ | Exempté (décision officielle)`;
  }

  if (q.includes('province') || q.includes('territoire') || q.includes('structure')) {
    return `Le Congo D’Abord est structuré sur 7 niveaux :\n\n1. **National** — Direction nationale, Mr Justin Nseya\n2. **Provincial** — 26 provinces\n3. **Territoire/Ville** — 145 territoires, 33 villes\n4. **Commune/Secteur/Chefferie**\n5. **Quartier/Groupement**\n6. **Cellule/Village** — niveau de base\n7. **Diaspora** — Afrique, Europe, Amériques, Asie...\n\nChaque membre est géolocalisé dans cette hiérarchie.`;
  }

  return `Merci pour votre question. En tant que ${agentName}, voici ma réponse :\n\nLe Congo D'Abord s'appuie sur 12 agents spécialisés pour gérer chaque aspect du parti Le Congo D’Abord. Chaque décision importante reste entre les mains des organes humains du parti — l'IA propose, les humains décident.\n\nPour des informations spécifiques, n'hésitez pas à consulter les différentes sections de la plateforme ou à contacter la direction provinciale la plus proche.`;
}
