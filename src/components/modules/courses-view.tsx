import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { useStore, store } from "@/lib/store";
import { courseSchema } from "@/lib/schemas";
import type { Course } from "@/lib/types";

export function CoursesView() {
  const list = useStore((s) => s.courses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  return (
    <div className="space-y-6">
      <PageHeader
        title="ACADEMIC"
        accent="PROGRAMS"
        subtitle="Manage the list of available courses and academic offerings."
        actions={
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        }
      />
      <div className="rounded-xl border border-border bg-card/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Program Name</TableHead>
              <TableHead className="text-right">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{c.name}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}>
                    <Pencil className="h-4 w-4 text-primary" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Delete course ${c.name}?`)) { store.removeCourse(c.id); toast.success("Removed"); } }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CourseDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}

function CourseDialog({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (v: boolean) => void; initial: Course | null }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [err, setErr] = useState("");
  function submit() {
    const parsed = courseSchema.safeParse({ name });
    if (!parsed.success) return setErr(parsed.error.issues[0]?.message ?? "Invalid");
    try {
      if (initial) { store.updateCourse(initial.id, parsed.data.name); toast.success("Updated"); }
      else { store.addCourse(parsed.data.name); toast.success("Course added"); }
      onOpenChange(false); setName(""); setErr("");
    } catch (e) { toast.error((e as Error).message); }
  }
  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setName(""); setErr(""); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Program" : "Create Program"}</DialogTitle>
          <DialogDescription>Add a new academic course to the system.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Course Name</Label>
          <Input value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} placeholder="course name" />
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
