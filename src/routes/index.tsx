import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import pgsLogo from "@/assets/pgs-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_HOME, cacheSession } from "@/lib/session";
import { getCurrentSession, signInWithUsername } from "@/lib/auth";
import { bootstrapAdmin, userCount } from "@/lib/admin.functions";

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
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [bootstrapOpen, setBootstrapOpen] = useState(false);

  const checkCount = useServerFn(userCount);
  const doBootstrap = useServerFn(bootstrapAdmin);

  // If already signed in, jump straight to the role home.
  useEffect(() => {
    (async () => {
      const s = await getCurrentSession();
      if (s) {
        cacheSession(s);
        navigate({ to: ROLE_HOME[s.role] });
        return;
      }
      try {
        const { count } = await checkCount();
        setNeedsBootstrap(count === 0);
      } catch {
        /* ignore */
      }
    })();
  }, [navigate, checkCount]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }
    setLoading(true);
    try {
      await signInWithUsername(username, password);
      const s = await getCurrentSession();
      if (!s) throw new Error("Account has no role assigned. Contact an admin.");
      cacheSession(s);
      toast.success(`Welcome, ${s.displayName}`);
      navigate({ to: ROLE_HOME[s.role] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
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
          <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-white/20 shadow-lg">
            <img src={pgsLogo.url} alt="Presidential Graduate School" className="h-10 w-auto object-contain" />
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
                Username or email
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
                Password
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

          {needsBootstrap && (
            <div className="mt-6 rounded-lg border border-accent/40 bg-accent/5 p-4 text-sm">
              <div className="font-semibold text-foreground mb-1">First-time setup</div>
              <p className="text-muted-foreground mb-3">
                No admin account exists yet. Create the first administrator to get started.
              </p>
              {!bootstrapOpen ? (
                <Button variant="outline" size="sm" onClick={() => setBootstrapOpen(true)}>
                  Create first admin
                </Button>
              ) : (
                <BootstrapForm
                  onCreate={async (vals) => {
                    setLoading(true);
                    try {
                      await doBootstrap({ data: vals });
                      toast.success("Admin created. Signing you in…");
                      await signInWithUsername(vals.email, vals.password);
                      const s = await getCurrentSession();
                      if (s) {
                        cacheSession(s);
                        navigate({ to: ROLE_HOME[s.role] });
                      }
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Bootstrap failed");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  loading={loading}
                />
              )}
            </div>
          )}

          <div className="mt-6 border-t border-border pt-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Presidential Graduate School · Internal Network
          </div>
        </div>
      </section>
    </main>
  );
}

function BootstrapForm({
  onCreate,
  loading,
}: {
  onCreate: (v: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => void;
  loading: boolean;
}) {
  const [firstName, setFirstName] = useState("System");
  const [lastName, setLastName] = useState("Admin");
  const [username, setUsername] = useState("admin");
  const [email, setEmail] = useState("admin@pgs.edu.np");
  const [password, setPassword] = useState("");
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input
        placeholder="Password (min 6 chars)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        size="sm"
        disabled={loading || password.length < 6}
        onClick={() => onCreate({ firstName, lastName, username, email, password })}
      >
        {loading ? "Creating…" : "Create admin"}
      </Button>
    </div>
  );
}
