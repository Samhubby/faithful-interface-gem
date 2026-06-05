import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, useSessionGuard } from "@/components/app-sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const session = useSessionGuard();
  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar session={session} />
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">PGS · LMS</span>
                <span className="mx-2 text-border">/</span>
                <span className="capitalize">{session.role}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold leading-tight">{session.displayName}</div>
                <div className="text-[10px] uppercase tracking-widest text-accent">{session.role}</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-sm font-semibold text-accent ring-1 ring-primary/30">
                {session.displayName.slice(0, 1).toUpperCase()}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
          <footer className="border-t border-border px-6 py-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
            <span>© 2026 PGS LMS · Secure Lead Management System</span>
            <span>v1.0</span>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
