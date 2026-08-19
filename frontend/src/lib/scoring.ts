// Le Congo D'Abord — Candidate Scoring Formula
// Total Score = (Education × 0.15) + (WorkExperience × 0.20) + (LocalCredibility × 0.15)
//             + (Leadership × 0.15) + (ContributionStatus × 0.10) + (TrainingCompletion × 0.10)
//             + (IntegrityScore × 0.10) + (LanguageAbility × 0.05)

import { CandidateScore, ContributionStatus, Member } from './types';

export const SCORING_WEIGHTS = {
  education: 0.15,
  workExperience: 0.20,
  localCredibility: 0.15,
  leadership: 0.15,
  contributionStatus: 0.10,
  trainingCompletion: 0.10,
  integrityScore: 0.10,
  languageAbility: 0.05,
} as const;

export function calculateCandidateScore(
  education: number,
  workExperience: number,
  localCredibility: number,
  leadership: number,
  contributionStatus: number,
  trainingCompletion: number,
  integrityScore: number,
  languageAbility: number,
): CandidateScore {
  const total =
    education * SCORING_WEIGHTS.education +
    workExperience * SCORING_WEIGHTS.workExperience +
    localCredibility * SCORING_WEIGHTS.localCredibility +
    leadership * SCORING_WEIGHTS.leadership +
    contributionStatus * SCORING_WEIGHTS.contributionStatus +
    trainingCompletion * SCORING_WEIGHTS.trainingCompletion +
    integrityScore * SCORING_WEIGHTS.integrityScore +
    languageAbility * SCORING_WEIGHTS.languageAbility;

  return {
    education,
    workExperience,
    localCredibility,
    leadership,
    contributionStatus,
    trainingCompletion,
    integrityScore,
    languageAbility,
    total: Math.round(total * 10) / 10,
  };
}

export function contributionStatusToScore(status: ContributionStatus): number {
  switch (status) {
    case 'Active': return 100;
    case 'Grace Period': return 60;
    case 'Exempted': return 80;
    case 'Under Review': return 40;
    case 'Suspended': return 0;
    case 'Ineligible': return 0;
    default: return 0;
  }
}

export function isEligibleForSelection(status: ContributionStatus): boolean {
  return status === 'Active' || status === 'Exempted';
}

export function educationLevelToScore(level: string): number {
  const scores: Record<string, number> = {
    'None': 0,
    'Primary': 20,
    'Secondary': 40,
    'Vocational': 55,
    'Bachelor': 70,
    'Master': 85,
    'PhD': 100,
  };
  return scores[level] || 0;
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#15803D'; // emerald — excellent (semantic)
  if (score >= 60) return '#22c55e'; // green — good
  if (score >= 45) return '#FCD116'; // yellow — average
  if (score >= 30) return '#f97316'; // orange — below average
  return '#CE1126'; // red — poor
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 45) return 'Moyen';
  if (score >= 30) return 'Faible';
  return 'Insuffisant';
}

export function scoreMemberForCandidate(member: Member): CandidateScore {
  const contribScore = contributionStatusToScore(member.contributionStatus);
  const langScore = Math.min(100, (member.political.languagesSpoken.length / 5) * 100);

  return calculateCandidateScore(
    member.education.score,
    member.work.score,
    member.localCredibilityScore,
    member.leadershipScore,
    contribScore,
    member.trainingCompletion,
    member.integrityScore,
    langScore,
  );
}

export function rankCandidates(members: Member[]): Member[] {
  // Filter to eligible only
  const eligible = members.filter(m => isEligibleForSelection(m.contributionStatus));
  // Sort by total score descending
  return eligible
    .map(m => ({ member: m, score: scoreMemberForCandidate(m) }))
    .sort((a, b) => b.score.total - a.score.total)
    .map(({ member }) => member);
}
