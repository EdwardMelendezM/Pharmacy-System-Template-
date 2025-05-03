"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersList } from "@/modules/users/components/users-list"
import { CompaniesList } from "@/modules/users/components/companies-list"
import { ActiveUsersView } from "@/modules/users/components/active-users-view"
import { UserRolesView } from "@/modules/users/components/user-roles-view"
import { CompanyOverviewView } from "@/modules/users/components/company-overview-view"
import Link from "next/link"

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users & Companies</h1>
        <div className="flex gap-2">
          <Link href="/users/add-user">
            <Button>Add User</Button>
          </Link>
          <Link href="/users/add-company">
            <Button variant="outline">Add Company</Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="active-users">Active Users</TabsTrigger>
          <TabsTrigger value="user-roles">User Roles</TabsTrigger>
          <TabsTrigger value="company-overview">Company Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UsersList />
        </TabsContent>
        <TabsContent value="companies" className="mt-4">
          <CompaniesList />
        </TabsContent>
        <TabsContent value="active-users" className="mt-4">
          <ActiveUsersView />
        </TabsContent>
        <TabsContent value="user-roles" className="mt-4">
          <UserRolesView />
        </TabsContent>
        <TabsContent value="company-overview" className="mt-4">
          <CompanyOverviewView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
