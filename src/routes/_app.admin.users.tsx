import { createFileRoute } from "@tanstack/react-router";
import { UsersView } from "@/components/modules/users-view";
export const Route = createFileRoute("/_app/admin/users")({ component: UsersView });
