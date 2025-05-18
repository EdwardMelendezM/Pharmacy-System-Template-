"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CreateInvoiceForm } from "@/modules/billing/components/create-invoice-form"

export default function CreateInvoicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/billing">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Crear Factura</h1>
      </div>

      <CreateInvoiceForm />
    </div>
  )
}
