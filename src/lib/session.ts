// Re-exports for backwards compatibility + sync-readable cached session.
// The real source of truth is `@/lib/auth` (Supabase). We mirror the resolved
// session into localStorage so legacy synchronous callers (modules that filter
// "assigned to me") can keep working until they are migrated to server-driven data.
export { ROLE_LABEL, ROLE_HOME, type Role, type Session, signOut } from "./auth";
import type { Session } from "./auth";

const KEY = "lms_session_cache_v1";

export function cacheSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
