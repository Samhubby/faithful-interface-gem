import { useState } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { useStore, store } from "@/lib/store";
import { adSchema } from "@/lib/schemas";
import type { AdSource } from "@/lib/types";

export function AdsView() {
  const list = useStore((s) => s.ads);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdSource | null>(null);
  return (
    <div className="space-y-6">
      <PageHeader
        title="MARKETING"
        accent="SOURCES"
        subtitle="Track and manage your advertisement channels and inquiry sources."
        actions={
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Ad Source
          </Button>
        }
      />
      <div className="rounded-xl border border-border bg-card/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Source Name</TableHead>
              <TableHead className="text-right">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="flex items-center gap-2"><Megaphone className="h-4 w-4 text-accent" />{a.name}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4 text-primary" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Delete ${a.name}?`)) { store.removeAd(a.id); toast.success("Removed"); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AdDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}

function AdDialog({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (v: boolean) => void; initial: AdSource | null }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [err, setErr] = useState("");
  function submit() {
    const parsed = adSchema.safeParse({ name });
    if (!parsed.success) return setErr(parsed.error.issues[0]?.message ?? "Invalid");
    try {
      if (initial) { store.updateAd(initial.id, parsed.data.name); toast.success("Updated"); }
      else { store.addAd(parsed.data.name); toast.success("Added"); }
      onOpenChange(false); setName(""); setErr("");
    } catch (e) { toast.error((e as Error).message); }
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setName(""); setErr(""); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Ad Source" : "Add Ad Source"}</DialogTitle>
          <DialogDescription>Track a new marketing or referral channel.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Source Name</Label>
          <Input value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} placeholder="e.g. Facebook" />
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
