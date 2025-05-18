"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersList } from "@/modules/users/components/users-list"
import { StoresList } from "@/modules/users/components/stores-list"
import { ActiveUsersView } from "@/modules/users/components/active-users-view"
import { UserRolesView } from "@/modules/users/components/user-roles-view"

export default function PaginaUsuarios() {
  const [pestanaActiva, setPestanaActiva] = useState("usuarios")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>

        <Tabs value={pestanaActiva} onValueChange={setPestanaActiva} className="w-full md:w-auto">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="usuarios-activos">Usuarios Activos</TabsTrigger>
            <TabsTrigger value="roles-usuarios">Roles de Usuario</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={pestanaActiva} onValueChange={setPestanaActiva}>
        <TabsContent value="usuarios" className="mt-4">
          <UsersList />
        </TabsContent>
        <TabsContent value="usuarios-activos" className="mt-4">
          <ActiveUsersView />
        </TabsContent>
        <TabsContent value="roles-usuarios" className="mt-4">
          <UserRolesView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
