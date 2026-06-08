import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { useStore } from "@/lib/store";
import { Calendar, Phone, Mail, MapPin, GraduationCap, MessageSquare, User } from "lucide-react";
import type { Lead } from "@/lib/types";

function fmt(d?: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

export function LeadDetailsDialog({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const users = useStore((s) => s.users);
  const followup = useStore((s) => s.followups.find((f) => f.leadId === lead?.id));
  if (!lead) return null;
  const assignee = users.find((u) => u.username === lead.assignedTo);
  const lastInteraction = lead.interactions?.[lead.interactions.length - 1];

  return (
    <Dialog open={!!lead} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="rounded bg-muted px-2 py-0.5">Lead ID: {lead.id.slice(-4)}</span>
            <StatusBadge status={lead.status} />
            {followup && <span className="rounded bg-primary/15 text-primary px-2 py-0.5">{followup.attempts}/{followup.maxAttempts} attempts</span>}
          </div>
          <DialogTitle className="text-3xl mt-2">{lead.fullName}</DialogTitle>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{lead.intake}</span>
            <span className="inline-flex items-center gap-1">Logged {fmt(lead.createdAt)}</span>
            <span>Course: <span className="text-primary">{lead.course}</span></span>
          </div>
        </DialogHeader>

        <Section title="Personal Profile" icon={<User className="h-3.5 w-3.5" />}>
          <Grid>
            <Field label="Primary Contact" value={lead.phone} icon={<Phone className="h-3 w-3" />} />
            <Field label="Email" value={lead.email} icon={<Mail className="h-3 w-3" />} />
            <Field label="Location" value={lead.address} icon={<MapPin className="h-3 w-3" />} />
            <Field label="Gender" value={lead.gender} />
          </Grid>
        </Section>

        <Section title="Application Info">
          <Grid>
            <Field label="Source" value={lead.source} />
            <Field label="Ad Source" value={lead.adSource} />
            <Field label="Interested Course" value={lead.course} />
            <Field label="Intake" value={lead.intake} />
          </Grid>
        </Section>

        <Section title="Assignment & Team">
          <Grid>
            <Field label="Assigned To" value={assignee ? `${assignee.firstName} ${assignee.lastName} (${assignee.role})` : "Unassigned"} />
          </Grid>
        </Section>

        <Section title="Follow-up Timeline" icon={<Calendar className="h-3.5 w-3.5" />}>
          <Grid cols={4}>
            <Field label="Visit Date" value={fmt(lead.visitDate)} />
            <Field label="Last Follow-up" value={fmt(followup?.lastContactedAt)} />
            <Field label="Next Follow-up" value={fmt(lead.nextFollowUpDate)} highlight />
            <Field label="Attempts" value={followup ? `${followup.attempts}/${followup.maxAttempts}` : "—"} />
          </Grid>
        </Section>

        <Section title="Academic Standing" icon={<GraduationCap className="h-3.5 w-3.5" />}>
          <Grid>
            <Field label="Previous Institution" value={lead.institution} />
            <Field label="Qualification" value={lead.qualification} />
            <Field label="GPA / Grade" value={lead.gpa} highlight />
          </Grid>
        </Section>

        {(lead.remarks || lastInteraction?.remarks) && (
          <Section title="Remarks" icon={<MessageSquare className="h-3.5 w-3.5" />}>
            {lastInteraction?.remarks && (
              <div className="rounded-lg border border-border bg-card/60 p-3 mb-2">
                <div className="text-[10px] uppercase tracking-widest text-accent mb-1">Current Remark</div>
                <p className="text-sm italic">"{lastInteraction.remarks}"</p>
              </div>
            )}
            {lead.remarks && (
              <div className="rounded-lg border border-dashed border-border p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Original Intent</div>
                <p className="text-sm">{lead.remarks}</p>
              </div>
            )}
          </Section>
        )}

        {lead.friends && lead.friends.length > 0 && (
          <Section title="Friends Also Interested">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {lead.friends.map((f, i) => (
                <div key={i} className="rounded-md border border-border bg-card/60 p-2 text-xs">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-muted-foreground">{f.phone}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {lead.interactions && lead.interactions.length > 0 && (
          <Section title="Interaction Log">
            <div className="space-y-2">
              {[...lead.interactions].reverse().map((i, idx) => (
                <div key={idx} className="rounded-md border border-border bg-card/40 p-2 text-xs flex flex-wrap gap-2 items-center">
                  <span className="text-muted-foreground">{fmt(i.at)}</span>
                  <StatusBadge status={i.status} />
                  {i.nextFollowUpDate && <span className="text-accent">→ next: {fmt(i.nextFollowUpDate)}</span>}
                  {i.remarks && <span className="basis-full text-foreground/80 italic">"{i.remarks}"</span>}
                </div>
              ))}
            </div>
          </Section>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-accent mb-2 border-b border-border pb-1.5">
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}
function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const c = cols === 4 ? "sm:grid-cols-4" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";
  return <div className={`grid grid-cols-1 ${c} gap-3`}>{children}</div>;
}
function Field({ label, value, icon, highlight }: { label: string; value?: string | null; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-md ${highlight ? "bg-primary/10 ring-1 ring-primary/30" : ""} px-2 py-1.5`}>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1">{icon}{label}</div>
      <div className={`text-sm ${highlight ? "text-accent font-semibold" : "text-foreground"}`}>{value || "—"}</div>
    </div>
  );
}
