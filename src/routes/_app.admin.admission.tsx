import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ADMISSIONS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/admin/admission")({
  component: AdmissionPage,
});

function AdmissionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admission" accent="Records" subtitle="Confirmed and in-progress admissions." />
      <div className="overflow-hidden rounded-xl border border-border bg-card/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Admission ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Documents</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ADMISSIONS.map((a) => (
              <tr key={a.admissionId} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.admissionId}</td>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-accent">{a.course}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider ring-1 ${
                    a.documents === "Complete"
                      ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
                      : "bg-amber-400/15 text-amber-300 ring-amber-400/30"
                  }`}>{a.documents}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider ring-1 ${
                    a.fee === "Paid"
                      ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
                      : "bg-destructive/15 text-destructive ring-destructive/30"
                  }`}>{a.fee}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
