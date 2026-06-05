import { CalendarCheck, GraduationCap, TrendingUp, FileText, Users, Footprints } from "lucide-react";
import { PageHeader, StatCard } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { LEAD_SOURCES, type Intake } from "@/lib/types";

interface Props {
  intake?: Intake;
}

export function DashboardView({ intake = "Summer 6" }: Props) {
  const leads = useStore((s) => s.leads);
  const admissions = useStore((s) => s.admissions);
  const courses = useStore((s) => s.courses);

  const today = new Date().toDateString();
  const intakeLeads = leads.filter((l) => l.intake === intake);
  const intakeAdmits = admissions.filter((a) => a.intake === intake);
  const todaysAdmits = admissions.filter((a) => new Date(a.createdAt).toDateString() === today);
  const todayWalkIns = leads.filter((l) => l.source === "Walk-in" && new Date(l.createdAt).toDateString() === today);
  const docPending = admissions.filter((a) => Object.values(a.checklist).filter(Boolean).length < 6).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`ADMISSION ANALYTICS`}
        accent={`(${intake.toUpperCase()})`}
        subtitle="Admission Dashboard"
        actions={
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Best Admission Day" value={Math.max(2, todaysAdmits.length)} hint={new Date().toISOString().slice(0, 10)} icon={<CalendarCheck className="h-4 w-4" />} tone="accent" />
        <StatCard label="Total Enrolled" value={admissions.length} hint={`${intakeAdmits.length} for ${intake}`} icon={<GraduationCap className="h-4 w-4" />} tone="primary" />
        <StatCard label="Today's Admissions" value={todaysAdmits.length} hint="Updated in real time" icon={<TrendingUp className="h-4 w-4" />} tone="default" />
        <StatCard label="Document Pending" value={docPending} hint="Needs follow-up" icon={<FileText className="h-4 w-4" />} tone="warn" />
        <StatCard label="Today's Walk-in Leads" value={todayWalkIns.length} icon={<Users className="h-4 w-4" />} tone="default" />
        <StatCard label="Total Walk-in Leads" value={leads.filter((l) => l.source === "Walk-in").length} icon={<Footprints className="h-4 w-4" />} tone="default" />
        <StatCard label="Intake Walk-ins" value={intakeLeads.filter((l) => l.source === "Walk-in").length} tone="default" />
        <StatCard label="Enrollment Completed" value={intakeAdmits.length} tone="primary" />
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Course Enrolment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((c) => {
            const total = admissions.filter((a) => a.course === c.name).length;
            const todays = admissions.filter((a) => a.course === c.name && new Date(a.createdAt).toDateString() === today).length;
            return (
              <div key={c.id} className="rounded-lg border border-border bg-card p-3">
                <div className="font-medium">{c.name}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total: <span className={total ? "text-primary" : "text-emerald-400"}>{total}</span></span>
                  <span>Today: <span className={todays ? "text-accent" : "text-emerald-400"}>{todays}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Leads by Source</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LEAD_SOURCES.map((s) => (
            <div key={s} className="rounded-lg border border-border bg-card p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s}</div>
              <div className="mt-1 font-display text-2xl font-bold text-accent">{leads.filter((l) => l.source === s).length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
