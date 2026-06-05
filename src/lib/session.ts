export type Role = "admin" | "counsellor" | "caller";

export interface Session {
  username: string;
  displayName: string;
  role: Role;
}

const KEY = "lms_session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin/dashboard",
  counsellor: "/counsellor/dashboard",
  caller: "/caller/dashboard",
};
