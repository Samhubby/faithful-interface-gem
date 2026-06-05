import { createFileRoute } from "@tanstack/react-router";
import { AdmissionView } from "@/components/modules/admission-view";
export const Route = createFileRoute("/_app/counsellor/admission")({ component: () => <AdmissionView /> });
