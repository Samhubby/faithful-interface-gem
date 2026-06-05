import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { LEADS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/counsellor/leads")({
  component: () => {
    const rows = LEADS.filter((l) => ["Muktinath", "Sabina", "Rajesh", "Shruti"].includes(l.assigned));
    return (
      <div className="space-y-6">
        <PageHeader title="My" accent="Leads" subtitle="Leads currently assigned to your queue." />
        <div className="overflow-hidden rounded-xl border border-border bg-card/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{l.name} <span className="ml-1 text-xs text-muted-foreground">{l.id}</span></td>
                  <td className="px-4 py-3">{l.phone}</td>
                  <td className="px-4 py-3 text-accent">{l.course}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
