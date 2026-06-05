import { statusTone } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status);
  const cls = {
    new: "bg-primary/15 text-primary ring-primary/30",
    contacted: "bg-accent/15 text-accent ring-accent/30",
    followup: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    admitted: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    lost: "bg-destructive/15 text-destructive ring-destructive/30",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ${cls}`}>
      {status}
    </span>
  );
}
