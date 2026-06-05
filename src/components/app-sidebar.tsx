import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Megaphone,
  UserPlus,
  PhoneCall,
  GraduationCap,
  BarChart3,
  LogOut,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { clearSession, getSession, ROLE_LABEL, type Role, type Session } from "@/lib/session";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const NAV: Record<Role, Item[]> = {
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Courses", url: "/admin/courses", icon: BookOpen },
    { title: "Ads", url: "/admin/ads", icon: Megaphone },
    { title: "Leads", url: "/admin/leads", icon: UserPlus },
    { title: "Follow Up", url: "/admin/follow-up", icon: PhoneCall },
    { title: "Admission", url: "/admin/admission", icon: GraduationCap },
    { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  ],
  counsellor: [
    { title: "Dashboard", url: "/counsellor/dashboard", icon: LayoutDashboard },
    { title: "Leads", url: "/counsellor/leads", icon: UserPlus },
    { title: "Follow Up", url: "/counsellor/follow-up", icon: PhoneCall },
    { title: "Admission", url: "/counsellor/admission", icon: GraduationCap },
  ],
  caller: [{ title: "Follow Up", url: "/caller/follow-up", icon: PhoneCall }],
  accountant: [
    { title: "Dashboard", url: "/accountant/dashboard", icon: LayoutDashboard },
    { title: "Admission", url: "/accountant/admission", icon: GraduationCap },
    { title: "Payments", url: "/accountant/payments", icon: Wallet },
  ],
};

export function AppSidebar({ session }: { session: Session }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const items = NAV[session.role];

  function logout() {
    clearSession();
    navigate({ to: "/" });
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold">PGS · LMS</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {ROLE_LABEL[session.role]}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function useSessionGuard() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState<Session | null>(null);
  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/" });
      return;
    }
    setSessionState(s);
  }, [navigate]);
  return session;
}
