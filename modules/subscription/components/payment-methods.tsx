"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, Trash2 } from "lucide-react"

// Mock data for payment methods
const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2024,
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2025,
    isDefault: false,
  },
]

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const handleRemove = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center justify-between rounded-lg border p-4 ${
              method.isDefault ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-muted p-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium capitalize">
                  {method.brand} •••• {method.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {method.expMonth}/{method.expYear}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!method.isDefault && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                    Set as default
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              {method.isDefault && <span className="text-sm font-medium text-primary">Default</span>}
            </div>
          </div>
        ))}

        {isAddingNew ? (
          <div className="rounded-lg border p-4">
            <p className="mb-4 text-sm">
              In a real application, this would integrate with a payment processor like Stripe to add a new payment
              method.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
              <Button>Add Payment Method</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setIsAddingNew(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
