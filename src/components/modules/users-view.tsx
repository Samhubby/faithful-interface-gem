import { useEffect, useState } from "react";
import { Trash2, Search, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
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
import { ROLE_LABEL, type Role } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { createUser, deleteUser } from "@/lib/admin.functions";

const ROLES: Role[] = ["admin", "counsellor", "caller", "accountant"];

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role;
};

async function fetchUsers(): Promise<UserRow[]> {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, username, email")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const { data: roles, error: rErr } = await supabase.from("user_roles").select("user_id, role");
  if (rErr) throw rErr;
  const roleMap = new Map(roles.map((r) => [r.user_id, r.role as Role]));
  return (profiles ?? []).map((p) => ({
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    username: p.username,
    email: p.email,
    role: roleMap.get(p.id) ?? "caller",
  }));
}

export function UsersView() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const createFn = useServerFn(createUser);
  const deleteFn = useServerFn(deleteUser);

  async function reload() {
    try {
      setUsers(await fetchUsers());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    }
  }
  useEffect(() => {
    reload();
  }, []);

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
            onClick={() => setOpen(true)}
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
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
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
                  <div className="font-medium">
                    {u.firstName} {u.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md border border-primary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    {ROLE_LABEL[u.role]}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm(`Delete user ${u.username}? They will no longer be able to log in.`)) return;
                      try {
                        await deleteFn({ data: { userId: u.id } });
                        toast.success("User removed");
                        reload();
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Failed");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                  No users match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">
          Total users: {users.length}
        </div>
      </div>

      <UserDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={async (vals) => {
          try {
            await createFn({ data: vals });
            toast.success(`User created. They can sign in with ${vals.email}.`);
            setOpen(false);
            reload();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create user");
          }
        }}
      />
    </div>
  );
}

function UserDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (vals: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("caller");
  const [busy, setBusy] = useState(false);

  function reset() {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("caller");
  }

  // Auto-fill email from username
  useEffect(() => {
    if (username && !email) setEmail(`${username.toLowerCase()}@pgs.edu.np`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Registration</DialogTitle>
          <DialogDescription>
            Create a new staff account. They can sign in immediately with the email and password you set.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name">
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>
          <Field label="Last Name">
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
          <Field label="Username">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </Field>
          <Field label="System Role">
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Email Address" className="sm:col-span-2">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password (min 6 chars)" className="sm:col-span-2">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              busy ||
              !firstName ||
              !lastName ||
              !username ||
              !email ||
              password.length < 6
            }
            onClick={async () => {
              setBusy(true);
              await onCreate({ firstName, lastName, username, email, password, role });
              setBusy(false);
            }}
          >
            {busy ? "Creating…" : "Register Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
