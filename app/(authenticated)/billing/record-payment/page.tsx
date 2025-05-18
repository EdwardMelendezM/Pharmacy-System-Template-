"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RecordPaymentForm } from "@/modules/billing/components/record-payment-form"

export default function RecordPaymentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/billing">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Registrar pago</h1>
      </div>

      <RecordPaymentForm />
    </div>
  )
}
