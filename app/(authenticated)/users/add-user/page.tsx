"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AddUserForm } from "@/modules/users/components/add-user-form"

export default function AddUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New User</h1>
      </div>

      <AddUserForm />
    </div>
  )
}
