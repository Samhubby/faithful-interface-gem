import { useMemo, useState } from "react";
import { Search, Eye, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LeadDetailsDialog } from "@/components/lead-details-dialog";
import { useStore, store } from "@/lib/store";
import { LEAD_STATUSES, type FollowUp, type Lead, type LeadStatus } from "@/lib/types";
import { getSession } from "@/lib/session";

interface Props {
  scopeToAssigned?: boolean;
  canDelete?: boolean;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function FollowupView({ scopeToAssigned = false, canDelete = true }: Props) {
  const session = getSession();
  const all = useStore((s) => s.followups);
  const leads = useStore((s) => s.leads);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dueFilter, setDueFilter] = useState<"due" | "upcoming" | "all">("due");
  const [active, setActive] = useState<FollowUp | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  const today = todayISO();

  const list = useMemo(() => {
    return all.filter((f) => {
      if (scopeToAssigned && session && f.assignedTo !== session.username) return false;
      if (statusFilter !== "all" && f.lastStatus !== statusFilter) return false;
      if (dueFilter === "due") {
        // due today or overdue (or no date — treat as due)
        if (f.nextFollowUpDate && f.nextFollowUpDate > today) return false;
      } else if (dueFilter === "upcoming") {
        if (!f.nextFollowUpDate || f.nextFollowUpDate <= today) return false;
      }
      if (f.attempts >= f.maxAttempts && dueFilter !== "all") return false;
      const q = query.trim().toLowerCase();
      if (q && !f.name.toLowerCase().includes(q) && !f.number.includes(q)) return false;
      return true;
    });
  }, [all, query, statusFilter, dueFilter, scopeToAssigned, session, today]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="FOLLOW-UP"
        accent="QUEUE"
        subtitle="Leads scheduled for follow-up today. Log each interaction (up to 5 attempts per lead)."
      />
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or number..." className="pl-9" />
          </div>
          <Select value={dueFilter} onValueChange={(v) => setDueFilter(v as typeof dueFilter)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="due">Due / Overdue</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead className="text-center">Attempts</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Follow-up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((f) => {
              const overdue = f.nextFollowUpDate && f.nextFollowUpDate < today;
              const exhausted = f.attempts >= f.maxAttempts;
              return (
                <TableRow key={f.id}>
                  <TableCell className="font-semibold">{f.name}</TableCell>
                  <TableCell>{f.number}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ring-1 ${exhausted ? "bg-destructive/15 text-destructive ring-destructive/30" : "bg-card ring-border"}`}>
                      {f.attempts}/{f.maxAttempts}
                    </span>
                  </TableCell>
                  <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.type}</TableCell>
                  <TableCell>{f.lastStatus ? <StatusBadge status={f.lastStatus} /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell className={`text-xs ${overdue ? "text-destructive font-semibold" : ""}`}>
                    {f.nextFollowUpDate ? new Date(f.nextFollowUpDate).toLocaleDateString() : "—"}
                    {overdue && <span className="ml-1 text-[9px] uppercase">overdue</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" title="View details" onClick={() => {
                      const lead = leads.find((l) => l.id === f.leadId);
                      if (lead) setViewLead(lead);
                    }}>
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Update interaction" disabled={exhausted} onClick={() => setActive(f)}>
                      {exhausted ? <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> : <Pencil className="h-4 w-4 text-accent" />}
                    </Button>
                    {canDelete && (
                      <Button size="icon" variant="ghost" title="Remove" onClick={() => { if (confirm("Remove follow-up?")) { store.removeFollowup(f.id); toast.success("Removed"); } }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {list.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No follow-ups due. 🎉</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">
          Showing {list.length} of {all.length} records · Today is {new Date().toLocaleDateString()}
        </div>
      </div>
      <UpdateInteractionDialog followup={active} onClose={() => setActive(null)} />
      <LeadDetailsDialog lead={viewLead} onClose={() => setViewLead(null)} />
    </div>
  );
}

function UpdateInteractionDialog({ followup, onClose }: { followup: FollowUp | null; onClose: () => void }) {
  const session = getSession();
  const [status, setStatus] = useState<LeadStatus>("CNR");
  const [nextDate, setNextDate] = useState("");
  const [remarks, setRemarks] = useState("");
  if (!followup) return null;
  const nextAttempt = followup.attempts + 1;
  return (
    <Dialog open={!!followup} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" /> Update Interaction
          </DialogTitle>
          <DialogDescription className="uppercase text-[10px] tracking-widest">
            Logging session for {followup.name} · Attempt {nextAttempt}/{followup.maxAttempts}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">New Lead Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Next Follow Up Date</Label>
            <Input type="date" value={nextDate} min={todayISO()} onChange={(e) => setNextDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Session Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Called, will visit on Friday..." rows={4} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            store.incrementAttempt(followup.id, {
              newStatus: status,
              nextFollowUpDate: nextDate || undefined,
              remarks: remarks || undefined,
              by: session?.username,
            });
            toast.success("Interaction logged");
            setStatus("CNR"); setNextDate(""); setRemarks("");
            onClose();
          }}>Submit Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
