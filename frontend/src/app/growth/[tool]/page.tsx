import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GROWTH_TOOLS, getGrowthTool } from '@/lib/growthTools';
import GrowthToolPanel from '@/components/GrowthToolPanel';
import { ChevronRight, Rocket } from 'lucide-react';

export function generateStaticParams() {
  return GROWTH_TOOLS.map(t => ({ tool: t.id }));
}

export function generateMetadata({ params }: { params: { tool: string } }): Metadata {
  const tool = getGrowthTool(params.tool);
  if (!tool) return {};
  return { title: `${tool.name} — AI Growth Engine`, description: tool.description };
}

export default function GrowthToolPage({ params }: { params: { tool: string } }) {
  const tool = getGrowthTool(params.tool);
  if (!tool) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${tool.color} text-white py-10 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <Link href="/growth" className="hover:text-white flex items-center gap-1">
              <Rocket className="w-4 h-4" /> AI Growth Engine
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{tool.short}</span>
          </div>
          <h1 className="text-2xl font-black">{tool.name}</h1>
          <p className="text-white/80 mt-1 max-w-2xl">{tool.description}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <GrowthToolPanel toolId={tool.id} />
      </div>
    </div>
  );
}
