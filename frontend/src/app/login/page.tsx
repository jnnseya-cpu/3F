'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { humanFetch } from '@/lib/humanClient';
import { saveSession } from '@/lib/memberSession';
import { LogIn, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * Member sign-in / account recovery. Looks up the member by email or phone and
 * restores their session. Degrades gracefully before Firebase is connected.
 */
export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!identifier.trim()) return;
    setLoading(true);
    try {
      const res = await humanFetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 503) {
        setNotice(data.message || 'La connexion sera disponible au lancement.');
        return;
      }
      if (res.status === 404 || data.found === false) {
        setError("Aucun compte trouvé. Vérifiez l'identifiant ou créez un compte gratuit.");
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Connexion impossible pour le moment.');
        return;
      }
      saveSession({ memberId: data.memberId, memberToken: data.memberToken, firstName: data.firstName });
      router.push('/mon-espace');
    } catch {
      setError('Connexion impossible. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="surface-lg overflow-hidden">
          <div className="hero-gradient px-6 py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
              <LogIn className="w-6 h-6 text-drc-yellow" />
            </div>
            <h1 className="text-white text-2xl font-black">Accéder à mon espace</h1>
            <p className="text-blue-100/80 text-sm mt-1">Retrouvez votre compte membre.</p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            <div>
              <label className="form-label" htmlFor="identifier">Email ou téléphone</label>
              <input
                id="identifier"
                className="form-input"
                placeholder="votre@email.com ou +243 81 234 5678"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>

            {error && <p className="text-sm bg-red-50 text-red-700 rounded-lg px-3 py-2">{error}</p>}
            {notice && <p className="text-sm bg-blue-50 text-blue-700 rounded-lg px-3 py-2">{notice}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continuer <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-xs text-gray-400 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              La vérification par code SMS s’active au lancement pour sécuriser totalement votre compte.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore membre ?{' '}
          <Link href="/register" className="font-bold text-drc-blue hover:underline">Créer un compte gratuit</Link>
        </p>
      </div>
    </div>
  );
}
