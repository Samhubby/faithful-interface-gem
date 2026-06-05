import { createFileRoute } from "@tanstack/react-router";
import { PhoneCall, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { LEADS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/admin/follow-up")({
  component: FollowUpPage,
});

function FollowUpPage() {
  const rows = LEADS.filter((l) => ["Follow up", "Contacted", "New"].includes(l.status));
  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow"
        accent="Up"
        subtitle="Pending callbacks and counsellor touchpoints."
      />

      <div className="grid gap-3">
        {rows.map((l) => (
          <article key={l.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4 transition hover:border-primary/40">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-sm font-semibold text-accent ring-1 ring-primary/30">
                {l.name.slice(0, 1)}
              </div>
              <div>
                <div className="font-medium">{l.name} <span className="ml-1 text-xs text-muted-foreground">· {l.id}</span></div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {l.course} · {l.source} · Assigned to {l.assigned}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={l.status} />
              <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                <CalendarClock className="h-3.5 w-3.5" /> {l.date}
              </div>
              <Button size="sm" className="gap-1">
                <PhoneCall className="h-3.5 w-3.5" /> Call
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
