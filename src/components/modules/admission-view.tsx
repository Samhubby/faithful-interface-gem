import { useMemo, useState } from "react";
import { Plus, Download, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { useStore, store } from "@/lib/store";
import { admissionSchema, type AdmissionInput } from "@/lib/schemas";
import { GENDERS, INTAKES, type Admission, type Intake } from "@/lib/types";

interface Props {
  readonly?: boolean;
}

const CHECKLIST_FIELDS: Array<{ key: keyof Admission["checklist"]; label: string }> = [
  { key: "photo", label: "Photo" },
  { key: "citizenship", label: "Citizenship" },
  { key: "transcript", label: "Transcript" },
  { key: "provisional", label: "Provisional" },
  { key: "characterCertificate", label: "Character Certificate" },
  { key: "migration", label: "Migration" },
  { key: "diploma", label: "Diploma" },
  { key: "equivalency", label: "Equivalency" },
  { key: "supportingDocs", label: "Supporting Docs" },
];

export function AdmissionView({ readonly = false }: Props) {
  const list = useStore((s) => s.admissions);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Admission | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? list.filter((a) => a.fullName.toLowerCase().includes(q) || a.phone.includes(q) || a.course.toLowerCase().includes(q)) : list;
  }, [list, query]);

  function downloadCsv() {
    const headers = ["Name", "Phone", "Email", "Course", "Intake", "Status", "Total Fee", "Paid", "Payment"];
    const rows = filtered.map((a) => [a.fullName, a.phone, a.email, a.course, a.intake, a.admissionStatus, a.totalFee ?? "", a.amountPaid ?? "", a.paymentStatus]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `admissions-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="STUDENT"
        accent="ADMISSIONS"
        subtitle="Verified Enrollment Registry"
        actions={
          !readonly && (
            <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="h-4 w-4" /> New Admission
            </Button>
          )
        }
      />
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student name..." className="pl-9" />
          </div>
          <Button onClick={downloadCsv} className="gap-2 bg-primary text-primary-foreground"><Download className="h-4 w-4" /> Download CSV</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              {!readonly && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.fullName}</TableCell>
                <TableCell>{a.phone}</TableCell>
                <TableCell className="text-primary text-xs uppercase">{a.course}</TableCell>
                <TableCell>{a.intake} 2026</TableCell>
                <TableCell><span className="text-xs uppercase tracking-wider">{a.admissionStatus}</span></TableCell>
                <TableCell>
                  <span className={`text-xs uppercase tracking-wider ${a.paymentStatus === "Paid" ? "text-emerald-400" : a.paymentStatus === "Partial" ? "text-amber-400" : "text-destructive"}`}>{a.paymentStatus}</span>
                </TableCell>
                {!readonly && (
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4 text-primary" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete admission?")) { store.removeAdmission(a.id); toast.success("Deleted"); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={readonly ? 6 : 7} className="text-center text-sm text-muted-foreground py-8">No admissions yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AdmissionDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}

// Default total fee inferred from course name keyword.
function feeForCourse(course: string): number {
  const c = course.toLowerCase();
  if (c.includes("master") || c.startsWith("m")) return 50000;
  if (c.includes("bachelor") || c.startsWith("b")) return 75000;
  return 0;
}

function defaultForm(): AdmissionInput {
  return {
    fullName: "",
    gender: "Male",
    dob: "",
    maritalStatus: "Single",
    phone: "",
    altPhone: "",
    email: "",
    permanentAddress: "",
    temporaryAddress: "",
    fatherName: "",
    motherName: "",
    occupation: "",
    company: "",
    yearsExperience: 0,
    course: "",
    intake: "Fall 1",
    previouslyApplied: false,
    previouslyAppliedYear: "",
    admissionStatus: "Active",
    scholarshipType: "None",
    scholarshipAmount: 0,
    referralName: "",
    referralPhone: "",
    totalFee: 0,
    amountPaid: 0,
    remarks: "",
  };
}

function AdmissionDialog({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (v: boolean) => void; initial: Admission | null }) {
  const courses = useStore((s) => s.courses);
  const [form, setForm] = useState<AdmissionInput>(() => initial ? mapToInput(initial) : defaultForm());
  const [checklist, setChecklist] = useState<Admission["checklist"]>(() => initial?.checklist ?? {
    photo: false, citizenship: false, transcript: false, provisional: false, characterCertificate: false,
    migration: false, diploma: false, equivalency: false, supportingDocs: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const parsed = admissionSchema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[i.path.join(".")] = i.message));
      setErrors(e);
      toast.error("Please complete required fields");
      return;
    }
    const d = parsed.data;
    const totalFee = d.totalFee ?? 0;
    const amountPaid = d.amountPaid ?? 0;
    const paymentStatus: Admission["paymentStatus"] = totalFee === 0 ? "Due" : amountPaid >= totalFee ? "Paid" : amountPaid > 0 ? "Partial" : "Due";
    const payload: Omit<Admission, "id" | "createdAt"> = {
      fullName: d.fullName,
      gender: d.gender as Admission["gender"],
      dob: d.dob || undefined,
      maritalStatus: d.maritalStatus,
      phone: d.phone,
      altPhone: d.altPhone || undefined,
      email: d.email,
      permanentAddress: d.permanentAddress,
      temporaryAddress: d.temporaryAddress || undefined,
      fatherName: d.fatherName || undefined,
      motherName: d.motherName || undefined,
      occupation: d.occupation || undefined,
      company: d.company || undefined,
      yearsExperience: d.yearsExperience,
      course: d.course,
      intake: d.intake as Intake,
      previouslyApplied: d.previouslyApplied,
      previouslyAppliedYear: d.previouslyAppliedYear || undefined,
      admissionStatus: d.admissionStatus,
      scholarshipType: d.scholarshipType,
      scholarshipAmount: d.scholarshipAmount,
      referralName: d.referralName || undefined,
      referralPhone: d.referralPhone || undefined,
      totalFee,
      amountPaid,
      paymentStatus,
      checklist,
      remarks: d.remarks || undefined,
    };
    if (initial) { store.updateAdmission(initial.id, payload); toast.success("Admission updated"); }
    else { store.addAdmission(payload); toast.success("Admission created"); }
    onOpenChange(false);
    setForm(defaultForm());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Admission" : "Student Admission Form"}</DialogTitle>
          <DialogDescription>Complete all required fields. Validation errors will appear in red.</DialogDescription>
        </DialogHeader>

        <SectionHeader title="Personal Identity" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Full Name *" error={errors.fullName}><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label="Gender *">
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as AdmissionInput["gender"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Date of Birth"><Input type="date" value={form.dob ?? ""} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></Field>
          <Field label="Marital Status">
            <Select value={form.maritalStatus} onValueChange={(v) => setForm({ ...form, maritalStatus: v as AdmissionInput["maritalStatus"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Single", "Married", "Other"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <SectionHeader title="Contact & Address" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Phone *" error={errors.phone}><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Alternate Phone"><Input value={form.altPhone ?? ""} onChange={(e) => setForm({ ...form, altPhone: e.target.value })} /></Field>
          <Field label="Email *" error={errors.email}><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label=" " ><div className="text-xs text-muted-foreground">—</div></Field>
          <Field label="Permanent Address *" error={errors.permanentAddress}><Input value={form.permanentAddress} onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })} /></Field>
          <Field label="Temporary Address"><Input value={form.temporaryAddress ?? ""} onChange={(e) => setForm({ ...form, temporaryAddress: e.target.value })} /></Field>
        </div>

        <SectionHeader title="Family Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Father's Name"><Input value={form.fatherName ?? ""} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} /></Field>
          <Field label="Mother's Name"><Input value={form.motherName ?? ""} onChange={(e) => setForm({ ...form, motherName: e.target.value })} /></Field>
        </div>

        <SectionHeader title="Professional Background" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Current Occupation"><Input value={form.occupation ?? ""} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder="Student" /></Field>
          <Field label="Company / Organization"><Input value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
          <Field label="Years of Experience"><Input type="number" min={0} value={form.yearsExperience ?? 0} onChange={(e) => setForm({ ...form, yearsExperience: Number(e.target.value) })} /></Field>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <div>
            <SectionHeader title="Program Selection" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Course *" error={errors.course} className="col-span-2">
                <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v, totalFee: feeForCourse(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Intake">
                <Select value={form.intake} onValueChange={(v) => setForm({ ...form, intake: v as AdmissionInput["intake"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{INTAKES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Admission Status">
                <Select value={form.admissionStatus} onValueChange={(v) => setForm({ ...form, admissionStatus: v as AdmissionInput["admissionStatus"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Active", "On Hold", "Withdrawn"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="col-span-2 flex items-center gap-2">
                <Checkbox checked={form.previouslyApplied} onCheckedChange={(v) => setForm({ ...form, previouslyApplied: !!v })} id="prev" />
                <Label htmlFor="prev" className="text-xs uppercase tracking-widest text-muted-foreground">Previously Applied?</Label>
              </div>
              {form.previouslyApplied && (
                <Field label="Previously Applied Year" className="col-span-2"><Input value={form.previouslyAppliedYear ?? ""} onChange={(e) => setForm({ ...form, previouslyAppliedYear: e.target.value })} placeholder="e.g. 2024" /></Field>
              )}
            </div>
          </div>
          <div>
            <SectionHeader title="Scholarship & Referral" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Scholarship Type *" className="col-span-2">
                <Select value={form.scholarshipType} onValueChange={(v) => setForm({ ...form, scholarshipType: v as AdmissionInput["scholarshipType"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["None", "Merit", "Need-based", "Sports", "Sibling"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Scholarship Amount" className="col-span-2"><Input type="number" min={0} value={form.scholarshipAmount ?? 0} onChange={(e) => setForm({ ...form, scholarshipAmount: Number(e.target.value) })} /></Field>
              <Field label="Referral Name"><Input value={form.referralName ?? ""} onChange={(e) => setForm({ ...form, referralName: e.target.value })} /></Field>
              <Field label="Referral Phone"><Input value={form.referralPhone ?? ""} onChange={(e) => setForm({ ...form, referralPhone: e.target.value })} /></Field>
            </div>
          </div>
        </div>

        <SectionHeader title="Mandatory Checklist" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CHECKLIST_FIELDS.map((c) => (
            <label key={c.key} className="flex items-center gap-2 rounded-md border border-border p-2 text-xs uppercase tracking-wider cursor-pointer">
              <Checkbox checked={checklist[c.key]} onCheckedChange={(v) => setChecklist({ ...checklist, [c.key]: !!v })} />
              {c.label}
            </label>
          ))}
        </div>

        <SectionHeader title="Payments" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Total Fee (NPR)"><Input type="number" min={0} value={form.totalFee ?? 0} onChange={(e) => setForm({ ...form, totalFee: Number(e.target.value) })} /></Field>
          <Field label="Amount Paid (NPR)"><Input type="number" min={0} value={form.amountPaid ?? 0} onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) })} /></Field>
        </div>

        <div className="mt-3">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Remarks / Notes</Label>
          <Textarea value={form.remarks ?? ""} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Any additional notes..." />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" onClick={() => { setForm(defaultForm()); setErrors({}); }}>Reset</Button>
          <Button onClick={submit}>{initial ? "Save changes" : "Complete Admission"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function mapToInput(a: Admission): AdmissionInput {
  return {
    fullName: a.fullName,
    gender: a.gender,
    dob: a.dob ?? "",
    maritalStatus: a.maritalStatus ?? "Single",
    phone: a.phone,
    altPhone: a.altPhone ?? "",
    email: a.email,
    permanentAddress: a.permanentAddress,
    temporaryAddress: a.temporaryAddress ?? "",
    fatherName: a.fatherName ?? "",
    motherName: a.motherName ?? "",
    occupation: a.occupation ?? "",
    company: a.company ?? "",
    yearsExperience: a.yearsExperience ?? 0,
    course: a.course,
    intake: a.intake,
    previouslyApplied: !!a.previouslyApplied,
    previouslyAppliedYear: a.previouslyAppliedYear ?? "",
    admissionStatus: a.admissionStatus,
    scholarshipType: a.scholarshipType,
    scholarshipAmount: a.scholarshipAmount ?? 0,
    referralName: a.referralName ?? "",
    referralPhone: a.referralPhone ?? "",
    totalFee: a.totalFee ?? 0,
    amountPaid: a.amountPaid ?? 0,
    remarks: a.remarks ?? "",
  };
}

function SectionHeader({ title }: { title: string }) {
  return <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mt-4 mb-2 border-b border-border pb-2">{title}</h3>;
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
