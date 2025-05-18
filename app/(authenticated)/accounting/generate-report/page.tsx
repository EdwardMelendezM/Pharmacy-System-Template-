"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GenerateReportForm } from "@/modules/accounting/components/generate-report-form"

export default function GenerateReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/accounting">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Generate Report</h1>
      </div>

      <GenerateReportForm />
    </div>
  )
}
