import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ADMISSIONS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/counsellor/admission")({
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Admission" accent="Tracking" subtitle="Admissions from your counselling sessions." />
      <div className="overflow-hidden rounded-xl border border-border bg-card/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Adm. ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Documents</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ADMISSIONS.map((a) => (
              <tr key={a.admissionId} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.admissionId}</td>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-accent">{a.course}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.documents}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
