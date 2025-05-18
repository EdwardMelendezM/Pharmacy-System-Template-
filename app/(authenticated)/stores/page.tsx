"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersList } from "@/modules/users/components/users-list"
import { StoresList } from "@/modules/users/components/stores-list"
import { ActiveUsersView } from "@/modules/users/components/active-users-view"
import { UserRolesView } from "@/modules/users/components/user-roles-view"
import Link from "next/link"

export default function StoresPage() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users & Tiendas</h1>
        <div className="flex gap-2">
          <Link href="/users/add-company">
            <Button variant="outline">Add Tienda</Button>
          </Link>
        </div>
      </div>

      <StoresList />
    </div>
  )
}
