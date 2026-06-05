import { useState } from "react";
import { CalendarCheck, GraduationCap, TrendingUp, Users as UsersIcon, Mail } from "lucide-react";
import { PageHeader, StatCard } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { INTAKES, type Intake } from "@/lib/types";

export function ReportsView() {
  const leads = useStore((s) => s.leads);
  const admissions = useStore((s) => s.admissions);
  const courses = useStore((s) => s.courses);
  const users = useStore((s) => s.users);
  const [intake, setIntake] = useState<Intake>("Summer 6");

  const today = new Date().toDateString();
  const intakeLeads = leads.filter((l) => l.intake === intake);
  const intakeAdmits = admissions.filter((a) => a.intake === intake);
  const todayWalkIns = leads.filter((l) => l.source === "Walk-in" && new Date(l.createdAt).toDateString() === today);
  const todayAdmits = admissions.filter((a) => new Date(a.createdAt).toDateString() === today);
  const counsellors = users.filter((u) => u.role === "counsellor");

  return (
    <div className="space-y-6">
      <PageHeader
        title="DAILY WALK-IN"
        accent="REPORT"
        subtitle={`Reporting Date: ${new Date().toLocaleDateString()} · Intake: ${intake}`}
        actions={
          <Select value={intake} onValueChange={(v) => setIntake(v as Intake)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>{INTAKES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Today's Visitors" value={todayWalkIns.length} icon={<UsersIcon className="h-4 w-4" />} tone="primary" />
        <StatCard label="Counselling Done" value={leads.filter((l) => ["Interested", "Will Visit College", "Will Revisit", "Follow-up Required"].includes(l.status)).length} icon={<CalendarCheck className="h-4 w-4" />} tone="accent" />
        <StatCard label="Today's Admissions" value={todayAdmits.length} icon={<TrendingUp className="h-4 w-4" />} tone="default" />
        <StatCard label="Intake Walk-ins" value={intakeLeads.filter((l) => l.source === "Walk-in").length} icon={<UsersIcon className="h-4 w-4" />} />
        <StatCard label="Intake Admissions" value={intakeAdmits.length} icon={<GraduationCap className="h-4 w-4" />} tone="primary" />
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Course-wise Performance Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Counselling</TableHead>
              <TableHead className="text-right">Admissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => {
              const v = intakeLeads.filter((l) => l.course === c.name).length;
              const cs = intakeLeads.filter((l) => l.course === c.name && ["Interested", "Will Visit College", "Follow-up Required"].includes(l.status)).length;
              const ad = intakeAdmits.filter((a) => a.course === c.name).length;
              return (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="text-right">{v}</TableCell>
                  <TableCell className="text-right">{cs}</TableCell>
                  <TableCell className={`text-right ${ad ? "text-primary" : ""}`}>{ad}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Counsellor Productivity</h3>
        {counsellors.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground uppercase tracking-widest">No counsellors configured</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {counsellors.map((c) => {
              const assigned = intakeLeads.filter((l) => l.assignedTo === c.username);
              const closed = assigned.filter((l) => l.status === "Admitted");
              return (
                <div key={c.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="font-medium">{c.firstName} {c.lastName}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Assigned:</span> <span className="text-primary">{assigned.length}</span></div>
                    <div><span className="text-muted-foreground">Admitted:</span> <span className="text-accent">{closed.length}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card/40 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" /> Report Distribution</h3>
          <span className="text-[10px] uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-400/30 rounded-full px-2 py-0.5">Automated delivery enabled</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {counsellors.map((c) => (
            <span key={c.id} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">{c.email}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
