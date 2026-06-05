import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAFF } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const rows = STAFF.filter(
    (u) =>
      (role === "all" || u.role.toLowerCase() === role) &&
      (u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.username.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User"
        accent="Management"
        subtitle="Administer system access, roles, and staff account details."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New user
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users…"
              className="pl-9"
            />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="counsellor">Counsellor</SelectItem>
              <SelectItem value="caller">Caller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">User details</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((u) => (
                <tr key={u.username} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.username}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] uppercase tracking-wider text-primary ring-1 ring-primary/30">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="text-primary">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>
            Total users: <span className="font-semibold text-foreground">{rows.length}</span>
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled>‹</Button>
            <Button size="sm" variant="outline">1</Button>
            <Button size="sm" variant="outline" disabled>›</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
