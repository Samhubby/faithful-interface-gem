import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ADS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/admin/ads")({
  component: AdsPage,
});

function AdsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing"
        accent="Ads"
        subtitle="Campaign performance across channels."
        actions={<Button className="gap-2"><Plus className="h-4 w-4" /> New campaign</Button>}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Spend (NPR)</th>
              <th className="px-4 py-3">Leads</th>
              <th className="px-4 py-3">CPL</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ADS.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.channel}</td>
                <td className="px-4 py-3">{a.spend.toLocaleString()}</td>
                <td className="px-4 py-3 text-accent">{a.leads}</td>
                <td className="px-4 py-3">{Math.round(a.spend / a.leads).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider ring-1 ${
                    a.status === "Active"
                      ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
                      : "bg-muted text-muted-foreground ring-border"
                  }`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
