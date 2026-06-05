import { createFileRoute } from "@tanstack/react-router";
import { FollowupView } from "@/components/modules/followup-view";
export const Route = createFileRoute("/_app/caller/follow-up")({ component: () => <FollowupView scopeToAssigned canDelete={false} /> });
