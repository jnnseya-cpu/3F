import Link from 'next/link';
import type { Metadata } from 'next';
import { DRC_PROVINCES } from '@/lib/provinces';
import { MapPin, ChevronRight } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export const metadata: Metadata = {
  title: 'Le Congo D\'Abord dans les 26 provinces de la RDC',
  description:
    "Trouvez Le Congo D'Abord dans votre province : Kinshasa, Haut-Katanga, Nord-Kivu, Kongo Central et les 22 autres. Inscription, cotisation 1 USD/mois et engagement au mérite partout en RDC.",
  keywords: ['parti politique RDC provinces', '26 provinces Congo', 'engagement politique province', "Congo D'Abord"],
  alternates: { canonical: `${BASE}/province` },
};

export default function ProvinceIndexPage() {
  const provinces = [...DRC_PROVINCES].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-drc-yellow rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-drc-blue-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Le Congo D&apos;Abord dans vos 26 provinces</h1>
              <p className="text-blue-200">De Kinshasa au Haut-Katanga — le mouvement couvre toute la RDC.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {provinces.map(p => (
            <Link
              key={p.id}
              href={`/province/${p.id}`}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-drc-blue transition-all p-5 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-gray-900 group-hover:text-drc-blue transition-colors">{p.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{p.capital} · {p.territories.length} territoires</p>
                </div>
                <ChevronRight className="w-5 h-5 text-drc-blue" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
