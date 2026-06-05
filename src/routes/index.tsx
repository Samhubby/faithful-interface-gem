import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, ArrowRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_HOME, setSession } from "@/lib/session";
import { store } from "@/lib/store";
import { loginSchema } from "@/lib/schemas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — PGS LMS" },
      { name: "description", content: "Staff sign-in for the Presidential Graduate School Lead Management System." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const u = store
        .listUsers()
        .find((x) => x.username.toLowerCase() === username.trim().toLowerCase());
      if (!u || u.password !== password) {
        toast.error("Invalid credentials");
        return;
      }
      setSession({
        username: u.username,
        displayName: `${u.firstName} ${u.lastName}`.trim(),
        role: u.role,
      });
      toast.success(`Welcome, ${u.firstName}`);
      navigate({ to: ROLE_HOME[u.role] });
    }, 250);
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      <section className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-deep">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 10%, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%), radial-gradient(50% 40% at 90% 90%, color-mix(in oklab, var(--teal) 35%, transparent), transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
            <GraduationCap className="h-6 w-6 text-accent" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-foreground">Presidential</div>
            <div className="text-sm text-accent">Graduate School</div>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-5xl xl:text-6xl font-bold text-foreground leading-[1.05]">
            Lead<br />Management<br />System<span className="text-accent">.</span>
          </h1>
          <p className="max-w-md text-muted-foreground">
            One workspace for admissions, counselling and outreach calls — purpose-built for PGS staff.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-10 bg-border" />
          LMS Enterprise Edition · 2026
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 backdrop-blur p-8 shadow-2xl">
          <header className="mb-6">
            <h2 className="font-display text-2xl font-semibold">Staff Sign-in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </header>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs uppercase tracking-wider text-muted-foreground">
                Staff username
              </Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                Secret key
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-2">
              {loading ? "Signing in…" : "Launch dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Presidential Graduate School · Internal Network
          </div>

          <div className="mt-6 rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground">Demo accounts</div>
            <div>admin / admin · muktinath / muktinath · dikshyant / dikshyant · bishnu / bishnu</div>
          </div>
        </div>
      </section>
    </main>
  );
}
