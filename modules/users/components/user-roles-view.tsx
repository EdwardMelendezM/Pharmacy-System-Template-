"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for user roles
const userRoles = [
  {
    user_id: 101,
    username: "sarah.johnson",
    role_id: 1,
    role_name: "Administrator",
  },
  {
    user_id: 102,
    username: "mark.wilson",
    role_id: 2,
    role_name: "Pharmacist",
  },
  {
    user_id: 201,
    username: "david.miller",
    role_id: 1,
    role_name: "Administrator",
  },
  {
    user_id: 202,
    username: "jennifer.adams",
    role_id: 3,
    role_name: "Cashier",
  },
  {
    user_id: 301,
    username: "lisa.brown",
    role_id: 4,
    role_name: "Inventory Manager",
  },
  {
    user_id: 401,
    username: "james.wilson",
    role_id: 2,
    role_name: "Pharmacist",
  },
  {
    user_id: 501,
    username: "jennifer.lee",
    role_id: 5,
    role_name: "Finance Manager",
  },
  {
    user_id: 102,
    username: "mark.wilson",
    role_id: 6,
    role_name: "Sales Representative",
  },
  {
    user_id: 202,
    username: "jennifer.adams",
    role_id: 7,
    role_name: "Store Manager",
  },
]

// Role colors for badges
const roleColors: Record<string, string> = {
  Administrator: "bg-red-100 text-red-800",
  Pharmacist: "bg-green-100 text-green-800",
  Cashier: "bg-blue-100 text-blue-800",
  "Inventory Manager": "bg-purple-100 text-purple-800",
  "Finance Manager": "bg-yellow-100 text-yellow-800",
  "Sales Representative": "bg-pink-100 text-pink-800",
  "Store Manager": "bg-indigo-100 text-indigo-800",
}

export function UserRolesView() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter users based on search term
  const filteredRoles = userRoles.filter(
    (role) =>
      role.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group roles by username
  const groupedRoles: Record<string, typeof userRoles> = {}
  filteredRoles.forEach((role) => {
    if (!groupedRoles[role.username]) {
      groupedRoles[role.username] = []
    }
    groupedRoles[role.username].push(role)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by username or role..."
            className="pl-8 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <DownloadIcon className="h-4 w-4" />
          <span className="sr-only">Download data</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(groupedRoles).length > 0 ? (
              Object.entries(groupedRoles).map(([username, roles]) => (
                <TableRow key={username}>
                  <TableCell className="font-medium">{username}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role, index) => (
                        <Badge
                          key={`${role.user_id}-${role.role_id}`}
                          variant="outline"
                          className={roleColors[role.role_name] || "bg-gray-100 text-gray-800"}
                        >
                          {role.role_name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
