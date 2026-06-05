import { createFileRoute } from "@tanstack/react-router";
import { LeadsView } from "@/components/modules/leads-view";
export const Route = createFileRoute("/_app/counsellor/leads")({ component: () => <LeadsView scopeToAssigned /> });
