"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EndShiftForm } from "@/modules/pos/components/end-shift-form"

export default function EndShiftPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/pos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">End Shift</h1>
      </div>

      <EndShiftForm />
    </div>
  )
}
