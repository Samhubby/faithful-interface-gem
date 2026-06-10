import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { LeadDetailsDialog } from "@/components/lead-details-dialog";
import { DatePicker } from "@/components/date-picker";

import { useStore, store } from "@/lib/store";
import { leadSchema, type LeadInput } from "@/lib/schemas";
import {
  GENDERS,
  INTAKES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  QUALIFICATIONS,
  type Lead,
  type LeadSource,
} from "@/lib/types";
import { getSession } from "@/lib/session";

const TAB_LABELS: Record<LeadSource, { title: string; accent: string; subtitle: string }> = {
  "Walk-in": { title: "WALK-IN", accent: "LEADS", subtitle: "Manage your full admission pipeline and visitor inquiries." },
  Incoming: { title: "INCOMING", accent: "INQUIRIES", subtitle: "Track leads generated through phone calls and chat." },
  Website: { title: "WEBSITE", accent: "LEADS", subtitle: "Inbound enquiries submitted through pgs.edu.np forms." },
  AD: { title: "AD", accent: "CAMPAIGN LEADS", subtitle: "Leads attributed to running marketing campaigns." },
  "Event/Outreach": { title: "EVENT", accent: "OUTREACH LEADS", subtitle: "Captured at school fairs, college visits and outreach events." },
};

interface Props {
  // Restrict visible leads to those assigned to current user; admin sees all.
  scopeToAssigned?: boolean;
}

export function LeadsView({ scopeToAssigned = false }: Props) {
  const session = getSession();
  const all = useStore((s) => s.leads);
  const users = useStore((s) => s.users);
  const [tab, setTab] = useState<LeadSource>("Walk-in");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [viewing, setViewing] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return all.filter((l) => {
      if (l.source !== tab) return false;
      if (scopeToAssigned && session && l.assignedTo !== session.username) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      const q = query.trim().toLowerCase();
      if (q && !l.fullName.toLowerCase().includes(q) && !l.phone.includes(q)) return false;
      return true;
    });
  }, [all, tab, statusFilter, query, scopeToAssigned, session]);

  const meta = TAB_LABELS[tab];

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as LeadSource)}>
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none gap-2">
          {LEAD_SOURCES.map((s) => (
            <TabsTrigger key={s} value={s} className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-3 py-2 text-sm">
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <PageHeader
        title={meta.title}
        accent={meta.accent}
        subtitle={meta.subtitle}
        actions={
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> New Lead
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or phone..." className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => {
              const assignee = users.find((u) => u.username === l.assignedTo);
              return (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.fullName}</TableCell>
                  <TableCell>{l.phone}</TableCell>
                  <TableCell className="text-xs uppercase tracking-wider text-muted-foreground">{l.source}</TableCell>
                  <TableCell>{l.intake}</TableCell>
                  <TableCell className="text-primary text-xs uppercase">{l.course}</TableCell>
                  <TableCell>
                    <Select value={l.status} onValueChange={(v) => { store.updateLead(l.id, { status: v as Lead["status"] }); toast.success("Status updated"); }}>
                      <SelectTrigger className="h-7 w-[170px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs">{assignee ? `${assignee.firstName}` : <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" title="View" onClick={() => setViewing(l)}>
                      <Eye className="h-4 w-4 text-accent" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Edit" onClick={() => { setEditing(l); setOpen(true); }}>
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Delete" onClick={() => { if (confirm("Delete lead?")) { store.removeLead(l.id); toast.success("Deleted"); } }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">No leads here yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">
          Showing {filtered.length} of {all.filter((l) => l.source === tab).length} leads
        </div>
      </div>

      <LeadDialog open={open} onOpenChange={setOpen} initial={editing} defaultSource={tab} />
      <LeadDetailsDialog lead={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

function LeadDialog({ open, onOpenChange, initial, defaultSource }: { open: boolean; onOpenChange: (v: boolean) => void; initial: Lead | null; defaultSource: LeadSource }) {
  const courses = useStore((s) => s.courses);
  const ads = useStore((s) => s.ads);
  const users = useStore((s) => s.users);
  const counsellorsAndCallers = users.filter((u) => u.role === "counsellor" || u.role === "caller");

  const [form, setForm] = useState<LeadInput>(() => ({
    fullName: initial?.fullName ?? "",
    gender: initial?.gender ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    altPhone: initial?.altPhone ?? "",
    address: initial?.address ?? "",
    qualification: initial?.qualification ?? "",
    institution: initial?.institution ?? "",
    gpa: initial?.gpa ?? "",
    course: initial?.course ?? courses[0]?.name ?? "",
    intake: (initial?.intake as LeadInput["intake"]) ?? "Fall 1",
    source: initial?.source ?? defaultSource,
    adSource: initial?.adSource ?? "",
    status: initial?.status ?? "Interested",
    friend1Name: initial?.friends?.[0]?.name ?? "",
    friend1Phone: initial?.friends?.[0]?.phone ?? "",
    friend2Name: initial?.friends?.[1]?.name ?? "",
    friend2Phone: initial?.friends?.[1]?.phone ?? "",
    friend3Name: initial?.friends?.[2]?.name ?? "",
    friend3Phone: initial?.friends?.[2]?.phone ?? "",
    visitDate: initial?.visitDate ?? new Date().toISOString().slice(0, 10),
    nextFollowUpDate: initial?.nextFollowUpDate ?? "",
    remarks: initial?.remarks ?? "",
  }));
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[i.path.join(".")] = i.message));
      setErrors(e);
      toast.error("Please fix validation errors");
      return;
    }
    const d = parsed.data;
    const friends = [
      { name: d.friend1Name || "", phone: d.friend1Phone || "" },
      { name: d.friend2Name || "", phone: d.friend2Phone || "" },
      { name: d.friend3Name || "", phone: d.friend3Phone || "" },
    ].filter((f) => f.name || f.phone);
    const payload = {
      fullName: d.fullName,
      gender: (d.gender || undefined) as Lead["gender"],
      email: d.email || undefined,
      phone: d.phone,
      altPhone: d.altPhone || undefined,
      address: d.address || undefined,
      qualification: (d.qualification || undefined) as Lead["qualification"],
      institution: d.institution || undefined,
      gpa: d.gpa || undefined,
      course: d.course,
      intake: d.intake,
      source: d.source as LeadSource,
      adSource: d.adSource || undefined,
      status: d.status as Lead["status"],
      friends: friends.length ? friends : undefined,
      assignedTo: assignedTo || undefined,
      visitDate: d.visitDate || undefined,
      nextFollowUpDate: d.nextFollowUpDate || undefined,
      remarks: d.remarks || undefined,
    };
    if (initial) { store.updateLead(initial.id, payload); toast.success("Lead updated"); }
    else { store.addLead(payload); toast.success("Lead created"); }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Lead" : "Lead Registration"}</DialogTitle>
          <DialogDescription>Enter detailed visitor information to initiate the admission pipeline.</DialogDescription>
        </DialogHeader>

        <SectionHeader title="Basic Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name *" error={errors.fullName}><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label="Gender">
            <Select value={form.gender || ""} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
              <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Email" error={errors.email}><Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone *" error={errors.phone}><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Address"><Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          <Field label="Alternate Phone"><Input value={form.altPhone ?? ""} onChange={(e) => setForm({ ...form, altPhone: e.target.value })} /></Field>
        </div>

        <SectionHeader title="Academic Records" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Qualification">
            <Select value={form.qualification || ""} onValueChange={(v) => setForm({ ...form, qualification: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{QUALIFICATIONS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Institution"><Input value={form.institution ?? ""} onChange={(e) => setForm({ ...form, institution: e.target.value })} /></Field>
          <Field label="GPA / Percentage"><Input value={form.gpa ?? ""} onChange={(e) => setForm({ ...form, gpa: e.target.value })} /></Field>
          <Field label="Interested Course *" error={errors.course}>
            <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
              <SelectTrigger><SelectValue placeholder="Select Program" /></SelectTrigger>
              <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Intake *">
            <Select value={form.intake} onValueChange={(v) => setForm({ ...form, intake: v as LeadInput["intake"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{INTAKES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadInput["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <SectionHeader title="Visit & Follow-up" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Visit Date">
            <Input type="date" value={form.visitDate ?? ""} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} />
          </Field>
          <Field label="Next Follow Up Date">
            <Input type="date" value={form.nextFollowUpDate ?? ""} onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })} />
          </Field>
          <Field label="Remarks" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={form.remarks ?? ""}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Original intent, what they asked about, key context..."
            />
          </Field>
        </div>


        <SectionHeader title="Friends Also Interested" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-md border border-dashed border-border p-3 space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Friend {i}</Label>
              <Input
                placeholder="name"
                value={(form as any)[`friend${i}Name`] ?? ""}
                onChange={(e) => setForm({ ...form, [`friend${i}Name`]: e.target.value } as LeadInput)}
              />
              <Input
                placeholder="phone"
                value={(form as any)[`friend${i}Phone`] ?? ""}
                onChange={(e) => setForm({ ...form, [`friend${i}Phone`]: e.target.value } as LeadInput)}
              />
            </div>
          ))}
        </div>

        <SectionHeader title="Marketing & Assignment" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Source *">
            <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v as LeadInput["source"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAD_SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Ad Source">
            <Select value={form.adSource || ""} onValueChange={(v) => setForm({ ...form, adSource: v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>{ads.map((a) => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Assign To" className="sm:col-span-2">
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger><SelectValue placeholder="Select counsellor / caller" /></SelectTrigger>
              <SelectContent>
                {counsellorsAndCallers.map((u) => (
                  <SelectItem key={u.id} value={u.username}>{u.firstName} {u.lastName} ({u.role})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Clear All</Button>
          <Button onClick={submit}>{initial ? "Save changes" : "Create Lead Entry"}</Button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mt-4 mb-2 border-b border-border pb-2">
      {title}
    </h3>
  );
}

function Field({ label, children, error, className }: { label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
