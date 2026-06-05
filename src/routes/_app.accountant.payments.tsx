import { createFileRoute } from "@tanstack/react-router";
import { PaymentsView } from "@/components/modules/payments-view";
export const Route = createFileRoute("/_app/accountant/payments")({ component: PaymentsView });
