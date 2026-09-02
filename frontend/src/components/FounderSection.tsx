import Link from 'next/link';
import { FOUNDER } from '@/lib/founder';
import { Quote, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Founder credibility block. Renders only what is truthfully provided in
 * lib/founder.ts — empty bio/credentials/photo are hidden, never fabricated.
 */
export default function FounderSection() {
  const f = FOUNDER;
  const hasBio = f.bio.filter(Boolean).length > 0;
  const hasCreds = f.credentials.length > 0;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Portrait / identity */}
          <div className="lg:col-span-2">
            <div className="surface-lg overflow-hidden">
              <div className="aspect-[4/5] w-full relative flex items-center justify-center hero-gradient">
                {f.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.photoUrl} alt={f.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-7xl font-black text-white/90">{f.initials}</span>
                )}
              </div>
              <div className="p-5">
                <p className="font-display text-xl font-extrabold text-gray-900">{f.name}</p>
                <p className="text-sm text-drc-blue font-semibold">{f.role}</p>
                {hasCreds && (
                  <dl className="mt-4 space-y-2">
                    {f.credentials.map(c => (
                      <div key={c.label} className="text-sm">
                        <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">{c.label}</dt>
                        <dd className="text-gray-700">{c.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </div>

          {/* Statement + pledges */}
          <div className="lg:col-span-3">
            <p className="text-sm font-bold uppercase tracking-widest text-drc-red mb-3">Le fondateur</p>
            <div className="relative">
              <Quote className="w-8 h-8 text-drc-yellow mb-3" />
              {f.statement.map((p, i) => (
                <p key={i} className={`text-gray-800 leading-relaxed ${i === 0 ? 'text-xl font-semibold' : 'text-base mt-4 text-gray-600'}`}>
                  {p}
                </p>
              ))}
            </div>

            {hasBio && (
              <div className="mt-6 space-y-3">
                {f.bio.filter(Boolean).map((p, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
                ))}
              </div>
            )}

            {f.pledges.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Ses engagements publics</p>
                <ul className="space-y-2.5">
                  {f.pledges.map(pl => (
                    <li key={pl} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      {pl}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/promesses"
                  className="inline-flex items-center gap-2 text-sm font-bold text-drc-blue mt-5 hover:gap-3 transition-all"
                >
                  Comment nous tenons ces promesses <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            <p className="mt-6 text-xs text-gray-400 italic">
              Signé et assumé publiquement par le fondateur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
