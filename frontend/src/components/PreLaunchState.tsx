import Link from 'next/link';
import { Database, ArrowRight } from 'lucide-react';

/**
 * Honest pre-launch empty state — replaces illustrative/demo data. Shown until
 * the data source (Firebase) is connected and real records exist. Never
 * displays fabricated numbers.
 */
export default function PreLaunchState({
  title = 'Données réelles au lancement',
  message = "Cette section affichera des données réelles dès l'ouverture des inscriptions et la connexion de la base de données (lancement national : 4 janvier 2027). Nous ne montrons aucun chiffre inventé.",
  cta = true,
}: {
  title?: string;
  message?: string;
  cta?: boolean;
}) {
  return (
    <div className="surface-lg p-8 sm:p-12 text-center max-w-2xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
        <Database className="w-7 h-7 text-drc-blue" />
      </div>
      <h2 className="font-display text-xl font-extrabold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
      {cta && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/register" className="btn-primary text-sm flex items-center gap-2">
            Prendre ma place — gratuit <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/promesses" className="text-sm font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-drc-blue hover:text-white transition-colors">
            Nos engagements vérifiables
          </Link>
        </div>
      )}
    </div>
  );
}
