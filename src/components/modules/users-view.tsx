import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { useStore, store } from "@/lib/store";
import { userSchema, type UserInput } from "@/lib/schemas";
import type { User } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/session";

const ROLES: User["role"][] = ["caller", "admin", "counsellor", "accountant"];

export function UsersView() {
  const users = useStore((s) => s.users);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const list = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesR = roleFilter === "all" || u.role === roleFilter;
    return matchesQ && matchesR;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="USER"
        accent="MANAGEMENT"
        subtitle="Administer system access, roles, and staff account details."
        actions={
          <Button
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <UsersIcon className="h-4 w-4" />
            New User
          </Button>
        }
      />
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Select Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Details</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="font-medium">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md border border-primary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    {ROLE_LABEL[u.role]}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(u); setOpen(true); }}>
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      if (u.username === "admin") return toast.error("Cannot delete primary admin");
                      if (confirm(`Delete user ${u.username}?`)) { store.removeUser(u.id); toast.success("User removed"); }
                    }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">No users match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">Total users: {users.length}</div>
      </div>

      <UserDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}

function UserDialog({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (v: boolean) => void; initial: User | null }) {
  const [form, setForm] = useState<UserInput>(() => ({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    username: initial?.username ?? "",
    email: initial?.email ?? "",
    role: initial?.role ?? "caller",
    password: "",
    confirmPassword: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setForm({ firstName: "", lastName: "", username: "", email: "", role: "caller", password: "", confirmPassword: "" });
    setErrors({});
  }

  function submit() {
    // For edits, password may be blank → allow keeping old
    const target = initial && !form.password && !form.confirmPassword
      ? { ...form, password: initial.password, confirmPassword: initial.password }
      : form;
    const parsed = userSchema.safeParse(target);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[i.path.join(".")] = i.message));
      setErrors(e);
      return;
    }
    try {
      if (initial) {
        store.updateUser(initial.id, {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          username: parsed.data.username,
          email: parsed.data.email,
          role: parsed.data.role,
          password: parsed.data.password,
        });
        toast.success("User updated");
      } else {
        store.addUser({ ...parsed.data });
        toast.success("User created");
      }
      onOpenChange(false);
      reset();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit User" : "User Registration"}</DialogTitle>
          <DialogDescription>{initial ? "Update staff account details." : "Create a new staff account and assign appropriate permissions."}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName}>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </Field>
          <Field label="Last Name" error={errors.lastName}>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </Field>
          <Field label="Username" error={errors.username}>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </Field>
          <Field label="System Role" error={errors.role}>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Email Address" className="sm:col-span-2" error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label={initial ? "New Password (optional)" : "Password"} error={errors.password}>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Confirm Password" error={errors.confirmPassword}>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{initial ? "Save changes" : "Register Account"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, error, className }: { label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
