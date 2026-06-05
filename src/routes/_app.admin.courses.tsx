import { createFileRoute } from "@tanstack/react-router";
import { CoursesView } from "@/components/modules/courses-view";
export const Route = createFileRoute("/_app/admin/courses")({ component: CoursesView });
