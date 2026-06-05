import { createFileRoute } from "@tanstack/react-router";
import { FollowupView } from "@/components/modules/followup-view";
export const Route = createFileRoute("/_app/counsellor/follow-up")({ component: () => <FollowupView scopeToAssigned /> });
