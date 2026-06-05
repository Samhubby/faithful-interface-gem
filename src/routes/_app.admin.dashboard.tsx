import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, FileWarning, GraduationCap, TrendingUp, UserPlus, PhoneIncoming, Users2 } from "lucide-react";
import { PageHeader, StatCard } from "@/components/page-header";
import { COURSES } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admission"
        accent="Analytics"
        subtitle="Real-time view of admissions, leads and outreach performance — Summer 2026."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Best Admission Day" value="2" hint="2026-05-26" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Total Enrolled" value="5" hint="4 enrollments completed" tone="primary" icon={<GraduationCap className="h-4 w-4" />} />
        <StatCard label="Today's Admissions" value="0" hint="Updated in real time" tone="accent" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Documents Pending" value="3" hint="Needs follow-up" tone="warn" icon={<FileWarning className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Today's Walk-in Leads" value="0" tone="accent" icon={<UserPlus className="h-4 w-4" />} />
        <StatCard label="Total Walk-in Leads" value="7" icon={<Users2 className="h-4 w-4" />} />
        <StatCard label="Enrollment Completed" value="4" tone="primary" icon={<PhoneIncoming className="h-4 w-4" />} />
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Course enrolment
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {COURSES.map((c) => (
            <div
              key={c.code}
              className="rounded-xl border border-border bg-card/60 p-4 transition hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-base font-semibold">{c.code}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{c.name}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  Total: <span className="font-semibold text-accent">{c.total}</span>
                </div>
                <div className="text-muted-foreground">
                  Today: <span className="font-semibold text-foreground">{c.today}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
