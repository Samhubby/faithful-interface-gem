import { useState } from "react";
import { toast } from "sonner";
import { Wallet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatCard } from "@/components/page-header";
import { useStore, store } from "@/lib/store";
import type { Admission } from "@/lib/types";

export function PaymentsView() {
  const list = useStore((s) => s.admissions);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Admission | null>(null);

  const filtered = list.filter((a) => {
    const q = query.trim().toLowerCase();
    return !q || a.fullName.toLowerCase().includes(q) || a.phone.includes(q);
  });

  const totalBilled = list.reduce((s, a) => s + (a.totalFee ?? 0), 0);
  const totalPaid = list.reduce((s, a) => s + (a.amountPaid ?? 0), 0);
  const due = list.filter((a) => a.paymentStatus === "Due").length;
  const partial = list.filter((a) => a.paymentStatus === "Partial").length;

  return (
    <div className="space-y-6">
      <PageHeader title="PAYMENTS" accent="LEDGER" subtitle="Record installments and reconcile outstanding fees." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Billed" value={`NPR ${totalBilled.toLocaleString()}`} icon={<Wallet className="h-4 w-4" />} tone="primary" />
        <StatCard label="Total Collected" value={`NPR ${totalPaid.toLocaleString()}`} tone="accent" />
        <StatCard label="Partially Paid" value={partial} tone="warn" />
        <StatCard label="Outstanding" value={due} tone="danger" />
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or phone..." className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Total Fee</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => {
              const bal = (a.totalFee ?? 0) - (a.amountPaid ?? 0);
              return (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.fullName}<div className="text-xs text-muted-foreground">{a.phone}</div></TableCell>
                  <TableCell className="text-primary text-xs uppercase">{a.course}</TableCell>
                  <TableCell className="text-right">{(a.totalFee ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-emerald-300">{(a.amountPaid ?? 0).toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${bal > 0 ? "text-amber-300" : "text-muted-foreground"}`}>{bal.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`text-xs uppercase tracking-wider ${a.paymentStatus === "Paid" ? "text-emerald-400" : a.paymentStatus === "Partial" ? "text-amber-400" : "text-destructive"}`}>{a.paymentStatus}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-primary" onClick={() => setActive(a)}>Record</Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (<TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No admissions found.</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>

      <PaymentDialog admission={active} onClose={() => setActive(null)} />
    </div>
  );
}

function PaymentDialog({ admission, onClose }: { admission: Admission | null; onClose: () => void }) {
  const [amt, setAmt] = useState<number>(0);
  if (!admission) return null;
  const newPaid = (admission.amountPaid ?? 0) + amt;
  const total = admission.totalFee ?? 0;
  return (
    <Dialog open={!!admission} onOpenChange={(v) => { if (!v) { setAmt(0); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>{admission.fullName} — Course {admission.course}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm grid grid-cols-2 gap-3">
            <div><div className="text-muted-foreground text-xs uppercase">Total fee</div><div className="font-display text-lg">NPR {total.toLocaleString()}</div></div>
            <div><div className="text-muted-foreground text-xs uppercase">Paid so far</div><div className="font-display text-lg text-emerald-300">NPR {(admission.amountPaid ?? 0).toLocaleString()}</div></div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">New Payment (NPR)</Label>
            <Input type="number" min={0} value={amt} onChange={(e) => setAmt(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={amt <= 0} onClick={() => {
            const paymentStatus = newPaid >= total ? "Paid" : newPaid > 0 ? "Partial" : "Due";
            store.updateAdmission(admission.id, { amountPaid: newPaid, paymentStatus });
            toast.success("Payment recorded");
            setAmt(0); onClose();
          }}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
