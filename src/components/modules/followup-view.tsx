import { useMemo, useState } from "react";
import { Search, Phone, Trash2 } from "lucide-react";
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
import { useStore, store } from "@/lib/store";
import { LEAD_STATUSES, type FollowUp, type LeadStatus } from "@/lib/types";
import { getSession } from "@/lib/session";

interface Props {
  scopeToAssigned?: boolean;
  canDelete?: boolean;
}

export function FollowupView({ scopeToAssigned = false, canDelete = true }: Props) {
  const session = getSession();
  const all = useStore((s) => s.followups);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [active, setActive] = useState<FollowUp | null>(null);

  const list = useMemo(() => {
    return all.filter((f) => {
      if (scopeToAssigned && session && f.assignedTo !== session.username) return false;
      if (statusFilter !== "all" && f.lastStatus !== statusFilter) return false;
      const q = query.trim().toLowerCase();
      if (q && !f.name.toLowerCase().includes(q) && !f.number.includes(q)) return false;
      return true;
    });
  }, [all, query, statusFilter, scopeToAssigned, session]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="FOLLOW-UP"
        accent="MANAGEMENT"
        subtitle="Track scheduled interactions and overdue lead engagements."
      />
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name..." className="pl-9" />
          </div>
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
              <TableHead>Attempts</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium uppercase">{f.name}</TableCell>
                <TableCell>{f.number}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-card border border-border px-2 py-0.5 text-xs">
                    {f.attempts}/{f.maxAttempts}
                  </span>
                </TableCell>
                <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.type}</TableCell>
                <TableCell>{f.lastStatus ? <StatusBadge status={f.lastStatus} /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="gap-1 text-primary" onClick={() => setActive(f)}>
                    <Phone className="h-3.5 w-3.5" /> Log call
                  </Button>
                  {canDelete && (
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Remove follow-up?")) { store.removeFollowup(f.id); toast.success("Removed"); } }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No follow-ups in your queue.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">Showing {list.length} of {all.length} records</div>
      </div>
      <LogCallDialog followup={active} onClose={() => setActive(null)} />
    </div>
  );
}

function LogCallDialog({ followup, onClose }: { followup: FollowUp | null; onClose: () => void }) {
  const [status, setStatus] = useState<LeadStatus>("Interested");
  const [note, setNote] = useState("");
  if (!followup) return null;
  return (
    <Dialog open={!!followup} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Call — {followup.name}</DialogTitle>
          <DialogDescription>Attempt {followup.attempts + 1}/{followup.maxAttempts}. Record the new status from this contact.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">New Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Notes</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional notes from the call..." />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            store.incrementAttempt(followup.id, status);
            toast.success("Call logged");
            setStatus("Interested"); setNote("");
            onClose();
          }}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
