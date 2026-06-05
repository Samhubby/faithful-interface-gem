import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/components/modules/dashboard-view";

export const Route = createFileRoute("/_app/admin/dashboard")({ component: DashboardView });
