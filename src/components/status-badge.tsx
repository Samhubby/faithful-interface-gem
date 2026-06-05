import type { LeadStatus } from "@/lib/types";

const TONE: Record<LeadStatus | "default", string> = {
  Interested: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  Admitted: "bg-primary/20 text-primary ring-primary/40",
  "Will Apply for Next Intake": "bg-indigo-400/15 text-indigo-300 ring-indigo-400/30",
  "Will Visit College": "bg-sky-400/15 text-sky-300 ring-sky-400/30",
  "Will Revisit": "bg-sky-400/15 text-sky-300 ring-sky-400/30",
  "Follow-up Required": "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  "Want Detail in WhatsApp": "bg-teal-400/15 text-teal-300 ring-teal-400/30",
  CNR: "bg-zinc-400/15 text-zinc-300 ring-zinc-400/30",
  "Incoming Call Blocked": "bg-rose-400/15 text-rose-300 ring-rose-400/30",
  "Expensive Fee": "bg-orange-400/15 text-orange-300 ring-orange-400/30",
  "Not Interested": "bg-destructive/15 text-destructive ring-destructive/30",
  "Joined Another College": "bg-destructive/15 text-destructive ring-destructive/30",
  Dead: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
  "CSV Upload": "bg-muted text-muted-foreground ring-border",
  default: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = TONE[(status as LeadStatus) ?? "default"] ?? TONE.default;
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}
