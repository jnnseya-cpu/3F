import { Info } from 'lucide-react';

/**
 * Shown on pages whose figures are illustrative until real member and
 * project data replaces them. Protects the party's credibility: nobody
 * can accuse the platform of publishing fabricated statistics.
 */
export default function DemoDataBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800">
          <strong>Aperçu de démonstration</strong> — les chiffres affichés sont illustratifs.
          Les données réelles s&apos;afficheront au fur et à mesure des inscriptions et des projets validés.
        </p>
      </div>
    </div>
  );
}
