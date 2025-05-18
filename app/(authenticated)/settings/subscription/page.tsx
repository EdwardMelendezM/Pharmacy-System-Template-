import { PlanSelector } from "@/modules/subscription/components/plan-selector"
import { BillingHistory } from "@/modules/subscription/components/billing-history"
import { PaymentMethods } from "@/modules/subscription/components/payment-methods"

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription plan and billing information</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
          <PlanSelector />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          <PaymentMethods />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          <BillingHistory />
        </section>
      </div>
    </div>
  )
}
