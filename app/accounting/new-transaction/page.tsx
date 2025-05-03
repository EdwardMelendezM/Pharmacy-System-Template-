"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NewTransactionForm } from "@/modules/accounting/components/new-transaction-form"

export default function NewTransactionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/accounting">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Transaction</h1>
      </div>

      <NewTransactionForm />
    </div>
  )
}
