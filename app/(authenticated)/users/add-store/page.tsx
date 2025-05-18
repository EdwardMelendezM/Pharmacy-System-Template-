"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AddStoreForm } from "@/modules/users/components/add-store-form"

export default function AddStorePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Añadir Nueva Tienda</h1>
      </div>

      <AddStoreForm />
    </div>
  )
}
