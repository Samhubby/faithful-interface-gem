import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/page-header";
import { LEADS, COURSES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_app/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const total = LEADS.length;
  const admitted = LEADS.filter((l) => l.status === "Admitted").length;
  const lost = LEADS.filter((l) => l.status === "Lost").length;
  const conv = Math.round((admitted / total) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        accent="Overview"
        subtitle="Weekly performance summary across the funnel."
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Leads" value={total} tone="primary" />
        <StatCard label="Admitted" value={admitted} tone="accent" />
        <StatCard label="Lost" value={lost} tone="danger" />
        <StatCard label="Conversion" value={`${conv}%`} tone="accent" />
      </div>

      <section className="rounded-xl border border-border bg-card/60 p-5">
        <h2 className="font-display text-lg font-semibold">Course-wise enrolment</h2>
        <div className="mt-4 space-y-3">
          {COURSES.map((c) => {
            const pct = Math.min(100, Math.round((c.total / 12) * 100));
            return (
              <div key={c.code}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.code} — {c.name}</span>
                  <span className="font-semibold text-accent">{c.total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
