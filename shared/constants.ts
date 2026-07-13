// Shared constants between frontend and backend

export const CONTRIBUTION_AMOUNT_USD = 1;
export const CONTRIBUTION_CURRENCY = 'USD';

export const PARTY_NAME = "Le Congo D'Abord";
export const PARTY_FOUNDER = 'Mr Justin Nseya';
export const PARTY_VERSION = '1.0.0';

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

export const CONTRIBUTION_STATUS_SCORES: Record<string, number> = {
  Active: 100,
  'Grace Period': 60,
  Exempted: 80,
  'Under Review': 40,
  Suspended: 0,
  Ineligible: 0,
};

export const DRC_PROVINCES_COUNT = 26;
export const DRC_TERRITORIES_COUNT = 145;
export const DRC_CITIES_COUNT = 33;

export const LANGUAGES = ['fr', 'ln', 'kg', 'ts', 'sw'] as const;
export type Language = typeof LANGUAGES[number];

// ── Encryption spec (must match frontend/src/lib/crypto.ts + backend/security.py) ──
export const ENCRYPTION = {
  ENVELOPE_PREFIX: 'lcd-e2ee-v1',
  ALGORITHM: 'AES-256-GCM',
  KDF: 'PBKDF2-SHA256',
  KDF_ITERATIONS: 310_000,
  SALT_BYTES: 16,
  IV_BYTES: 12,
} as const;

export const SENSITIVE_MEMBER_FIELDS = [
  'nationalId',
  'phone',
  'email',
  'address',
  'dateOfBirth',
] as const;
