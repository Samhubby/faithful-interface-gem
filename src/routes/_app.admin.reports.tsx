import { createFileRoute } from "@tanstack/react-router";
import { ReportsView } from "@/components/modules/reports-view";
export const Route = createFileRoute("/_app/admin/reports")({ component: ReportsView });
