import { createFileRoute } from "@tanstack/react-router";
import { AdsView } from "@/components/modules/ads-view";
export const Route = createFileRoute("/_app/admin/ads")({ component: AdsView });
