import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { LEADS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

export const Route = createFileRoute("/_app/caller/follow-up")({
  component: () => {
    const rows = LEADS.filter((l) => ["Follow up", "Contacted"].includes(l.status));
    return (
      <div className="space-y-6">
        <PageHeader title="Follow" accent="Up" subtitle="Schedule call-backs and log outcomes." />
        <div className="grid gap-3">
          {rows.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-4">
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.phone} · {l.course}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={l.status} />
                <Button size="sm" className="gap-1"><PhoneCall className="h-3.5 w-3.5" /> Call</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
