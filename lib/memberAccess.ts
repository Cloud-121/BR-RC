export const MEMBER_ACCESS_KEY = 'brrc-member-access';
export const MEMBER_CODE = '8167';

export function hasMemberAccess(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(MEMBER_ACCESS_KEY) === '1';
  } catch {
    return false;
  }
}

export function grantMemberAccess(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(MEMBER_ACCESS_KEY, '1');
  } catch {
    // sessionStorage may be unavailable; unlock still works for this session via React state
  }
}

export function isValidMemberCode(code: string): boolean {
  return code.trim() === MEMBER_CODE;
}
