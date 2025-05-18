"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ManageSuppliersView } from "@/modules/inventory/components/manage-suppliers-view"

export default function ManageSuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Manage Suppliers</h1>
      </div>

      <ManageSuppliersView />
    </div>
  )
}
