'use client';

import { User, AlertCircle, CheckCircle, Star } from 'lucide-react';
import ScoreBar from './ScoreBar';
import ContributionBadge from './ContributionBadge';
import { SCORING_WEIGHTS, getScoreColor } from '@/lib/scoring';
import type { Member, CandidateScore } from '@/lib/types';

interface CandidateCardProps {
  member: Member;
  scores: CandidateScore;
  rank: 1 | 2 | 3;
  justification?: string;
  riskFlags?: string[];
  roleName: string;
}

const RANK_CONFIG = {
  1: { label: '1er choix', color: 'text-drc-yellow', bg: 'bg-drc-yellow', border: 'border-l-4 border-drc-yellow', star: 'text-drc-yellow' },
  2: { label: '2e choix', color: 'text-gray-500', bg: 'bg-gray-400', border: 'border-l-4 border-gray-400', star: 'text-gray-400' },
  3: { label: '3e choix', color: 'text-yellow-700', bg: 'bg-yellow-700', border: 'border-l-4 border-yellow-700', star: 'text-yellow-700' },
};

export default function CandidateCard({ member, scores, rank, justification, riskFlags = [], roleName }: CandidateCardProps) {
  const config = RANK_CONFIG[rank];
  const totalColor = getScoreColor(scores.total);

  const scoreItems = [
    { label: 'Éducation', score: scores.education, weight: SCORING_WEIGHTS.education },
    { label: 'Expérience', score: scores.workExperience, weight: SCORING_WEIGHTS.workExperience },
    { label: 'Crédibilité locale', score: scores.localCredibility, weight: SCORING_WEIGHTS.localCredibility },
    { label: 'Leadership', score: scores.leadership, weight: SCORING_WEIGHTS.leadership },
    { label: 'Cotisation', score: scores.contributionStatus, weight: SCORING_WEIGHTS.contributionStatus },
    { label: 'Formation', score: scores.trainingCompletion, weight: SCORING_WEIGHTS.trainingCompletion },
    { label: 'Intégrité', score: scores.integrityScore, weight: SCORING_WEIGHTS.integrityScore },
    { label: 'Langues', score: scores.languageAbility, weight: SCORING_WEIGHTS.languageAbility },
  ];

  return (
    <div className={`card ${config.border} relative`}>
      {/* Rank badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <Star className={`w-4 h-4 ${config.star}`} />
        <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          {member.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photoUrl} alt={member.firstName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="pr-16">
          <h3 className="font-bold text-gray-900">{member.firstName} {member.lastName}</h3>
          <p className="text-sm text-gray-500">{member.location.province} · {member.work.jobTitle || 'Membre actif'}</p>
          <div className="mt-1 flex items-center gap-2">
            <ContributionBadge status={member.contributionStatus} />
          </div>
        </div>
      </div>

      {/* Role */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-xs text-gray-500">Proposé pour</p>
        <p className="text-sm font-semibold text-drc-blue-dark">{roleName}</p>
      </div>

      {/* Total Score */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-semibold text-gray-700">Score total IA</span>
        <div className="text-right">
          <span className="text-2xl font-black" style={{ color: totalColor }}>{scores.total}</span>
          <span className="text-gray-400 text-sm">/100</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-1 mb-4">
        {scoreItems.map(item => (
          <ScoreBar
            key={item.label}
            label={item.label}
            score={item.score}
            weight={item.weight}
            compact
          />
        ))}
      </div>

      {/* AI Justification */}
      {justification && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-drc-blue mt-0.5 shrink-0" />
            <p className="text-xs text-gray-700">{justification}</p>
          </div>
        </div>
      )}

      {/* Risk Flags */}
      {riskFlags.length > 0 && (
        <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
          {riskFlags.map((flag, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-700">{flag}</p>
            </div>
          ))}
        </div>
      )}

      {/* Human Review Notice */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-drc-yellow shrink-0" />
        <p className="text-xs text-gray-500 italic">Révision humaine obligatoire avant toute nomination officielle.</p>
      </div>
    </div>
  );
}
