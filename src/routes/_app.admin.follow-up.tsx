import { createFileRoute } from "@tanstack/react-router";
import { FollowupView } from "@/components/modules/followup-view";
export const Route = createFileRoute("/_app/admin/follow-up")({ component: () => <FollowupView /> });
