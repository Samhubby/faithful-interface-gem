import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/admin/courses")({
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course"
        accent="Catalogue"
        subtitle="Manage active programmes and enrolment capacity."
        actions={
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add course</Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {COURSES.map((c) => (
          <article key={c.code} className="rounded-xl border border-border bg-card/60 p-5 transition hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-lg font-semibold">{c.code}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.name}</div>
              </div>
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent ring-1 ring-accent/30">
                Active
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
                <div className="mt-1 font-display text-xl text-primary">{c.total}</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Today</div>
                <div className="mt-1 font-display text-xl">{c.today}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
