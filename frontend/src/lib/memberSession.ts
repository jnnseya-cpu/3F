/**
 * Client-side member session — single source of truth for the member's
 * identity in the browser. Persists across the app (register, login, panels,
 * pay). Server remains authoritative; this is only a convenience cache.
 */

const ID_KEY = 'lcd_member_id';
const TOKEN_KEY = 'lcd_member_token';
const NAME_KEY = 'lcd_member_name';

export interface MemberSession {
  memberId: string;
  memberToken: string;
  firstName: string;
}

export function getSession(): MemberSession | null {
  try {
    const memberId = localStorage.getItem(ID_KEY) || '';
    if (!memberId) return null;
    return {
      memberId,
      memberToken: localStorage.getItem(TOKEN_KEY) || '',
      firstName: localStorage.getItem(NAME_KEY) || '',
    };
  } catch {
    return null;
  }
}

export function getMemberId(): string | null {
  try { return localStorage.getItem(ID_KEY); } catch { return null; }
}

export function getMemberToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}

export function saveSession(s: { memberId: string; memberToken?: string | null; firstName?: string | null }): void {
  try {
    if (s.memberId) localStorage.setItem(ID_KEY, s.memberId);
    if (s.memberToken) localStorage.setItem(TOKEN_KEY, s.memberToken);
    if (s.firstName) localStorage.setItem(NAME_KEY, s.firstName);
  } catch { /* private mode */ }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(ID_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
  } catch { /* ignore */ }
}
