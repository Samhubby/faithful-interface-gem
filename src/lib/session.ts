// Re-exports for backwards compatibility with existing imports.
// All real auth lives in `@/lib/auth`.
export { ROLE_LABEL, ROLE_HOME, type Role, type Session, signOut } from "./auth";
