import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/page-header";
import { PhoneCall, PhoneOutgoing, UserPlus, Clock } from "lucide-react";
import { LEADS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/caller/dashboard")({
  component: () => {
    const mine = LEADS.filter((l) => ["Dikshyant", "Vivek", "Dristi", "Elyana", "Pragyan"].includes(l.assigned));
    return (
      <div className="space-y-8">
        <PageHeader title="Caller" accent="Workspace" subtitle="Your call queue for the day." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Calls Today" value="18" tone="primary" icon={<PhoneOutgoing className="h-4 w-4" />} />
          <StatCard label="Connected" value="12" tone="accent" icon={<PhoneCall className="h-4 w-4" />} />
          <StatCard label="New Leads" value={mine.length} icon={<UserPlus className="h-4 w-4" />} />
          <StatCard label="Avg Talk Time" value="3m 12s" hint="this week" icon={<Clock className="h-4 w-4" />} />
        </div>

        <section>
          <h2 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Call queue</h2>
          <div className="grid gap-3">
            {mine.slice(0, 6).map((l) => (
              <div key={l.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-sm font-semibold text-accent ring-1 ring-primary/30">{l.name.slice(0,1)}</div>
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.phone} · {l.course}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />
                  <Button size="sm" className="gap-1"><PhoneCall className="h-3.5 w-3.5" /> Call</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  },
});
