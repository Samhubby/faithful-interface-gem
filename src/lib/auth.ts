// Real auth backed by Lovable Cloud. Replaces the old localStorage session.
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "counsellor" | "caller" | "accountant";

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Management",
  counsellor: "Counsellor",
  caller: "Caller",
  accountant: "Accountant",
};

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin/dashboard",
  counsellor: "/counsellor/dashboard",
  caller: "/caller/follow-up",
  accountant: "/accountant/dashboard",
};

export interface Session {
  userId: string;
  username: string;
  displayName: string;
  email: string;
  role: Role;
}

const EMAIL_DOMAIN = "pgs.edu.np";

function toEmail(usernameOrEmail: string): string {
  return usernameOrEmail.includes("@")
    ? usernameOrEmail.trim().toLowerCase()
    : `${usernameOrEmail.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}

export async function signInWithUsername(usernameOrEmail: string, password: string) {
  const email = toEmail(usernameOrEmail);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("first_name,last_name,username,email").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id).limit(1),
  ]);

  const role = (roles?.[0]?.role as Role | undefined) ?? null;
  if (!role) return null;

  const first = profile?.first_name ?? "";
  const last = profile?.last_name ?? "";
  const username = profile?.username ?? user.email?.split("@")[0] ?? "user";
  const display = `${first} ${last}`.trim() || username;

  return {
    userId: user.id,
    username,
    displayName: display,
    email: profile?.email ?? user.email ?? "",
    role,
  };
}
