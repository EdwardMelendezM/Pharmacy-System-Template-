"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { planFeatures } from "@/lib/multi-tenancy/tenant-db"
import type { SubscriptionPlan } from "@/lib/multi-tenancy/types"
import { useTenant } from "@/lib/multi-tenancy/tenant-context"

export function PlanSelector() {
  const { tenant } = useTenant()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(tenant?.plan || "free")
  const [isChangingPlan, setIsChangingPlan] = useState(false)

  const handleChangePlan = async () => {
    setIsChangingPlan(true)

    // This would be replaced with an actual API call to update the subscription
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate success
    setIsChangingPlan(false)
    // In a real app, you would refresh the tenant data or redirect to checkout
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(planFeatures) as SubscriptionPlan[]).map((plan) => {
          const features = planFeatures[plan]
          const isCurrentPlan = tenant?.plan === plan
          const isSelected = selectedPlan === plan

          return (
            <Card key={plan} className={`relative ${isSelected ? "border-primary" : ""}`}>
              {isCurrentPlan && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Current Plan
                </div>
              )}
              <CardHeader>
                <CardTitle className="capitalize">{plan}</CardTitle>
                <CardDescription>
                  {plan === "free" && "Get started with basic features"}
                  {plan === "basic" && "For small pharmacies"}
                  {plan === "professional" && "For growing businesses"}
                  {plan === "enterprise" && "For large organizations"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  {plan === "free" && "$0"}
                  {plan === "basic" && "$29"}
                  {plan === "professional" && "$79"}
                  {plan === "enterprise" && "$199"}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to {features.maxUsers} users</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to {features.maxCompanies} companies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to {features.maxProducts} products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {features.advancedReporting ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Advanced reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {features.apiAccess ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {features.customBranding ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {features.multipleLocations ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Multiple locations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedPlan(plan)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : isSelected ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {selectedPlan !== tenant?.plan && (
        <div className="flex justify-center">
          <Button size="lg" onClick={handleChangePlan} disabled={isChangingPlan}>
            {isChangingPlan
              ? "Processing..."
              : `Upgrade to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`}
          </Button>
        </div>
      )}
    </div>
  )
}
