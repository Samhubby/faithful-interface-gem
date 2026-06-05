import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/page-header";
import { GraduationCap, PhoneCall, UserPlus, Target } from "lucide-react";
import { LEADS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/counsellor/dashboard")({
  component: CounsellorDashboard,
});

function CounsellorDashboard() {
  const mine = LEADS.filter((l) => ["Muktinath", "Sabina", "Rajesh", "Shruti"].includes(l.assigned));
  return (
    <div className="space-y-8">
      <PageHeader
        title="Counsellor"
        accent="Workspace"
        subtitle="Your assigned leads, follow-ups and admissions for the day."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Leads" value={mine.length} tone="primary" icon={<UserPlus className="h-4 w-4" />} />
        <StatCard label="Follow-ups Today" value="3" tone="warn" icon={<PhoneCall className="h-4 w-4" />} />
        <StatCard label="Admitted (Month)" value="2" tone="accent" icon={<GraduationCap className="h-4 w-4" />} />
        <StatCard label="Target" value="6" hint="4 to go" icon={<Target className="h-4 w-4" />} />
      </div>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Recent activity</h2>
        <div className="grid gap-3">
          {mine.slice(0, 5).map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4">
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.course} · {l.phone}</div>
              </div>
              <StatusBadge status={l.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
