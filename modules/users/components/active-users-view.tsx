"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for active users
const activeUsers = [
  {
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    user_id: 101,
    username: "sarah.johnson",
    email: "sarah@medicorp.com",
    last_login: "2023-05-01T14:30:00Z",
  },
  {
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    user_id: 102,
    username: "mark.wilson",
    email: "mark@medicorp.com",
    last_login: "2023-05-02T09:15:00Z",
  },
  {
    company_id: 2,
    company_name: "HealthPlus Supplies",
    user_id: 201,
    username: "david.miller",
    email: "david@healthplus.com",
    last_login: "2023-05-01T11:45:00Z",
  },
  {
    company_id: 2,
    company_name: "HealthPlus Supplies",
    user_id: 202,
    username: "jennifer.adams",
    email: "jennifer@healthplus.com",
    last_login: "2023-05-03T16:20:00Z",
  },
  {
    company_id: 3,
    company_name: "Wellness Distributors",
    user_id: 301,
    username: "lisa.brown",
    email: "lisa@wellness.com",
    last_login: "2023-05-02T13:10:00Z",
  },
  {
    company_id: 4,
    company_name: "PharmaTech Solutions",
    user_id: 401,
    username: "james.wilson",
    email: "james@pharmatech.com",
    last_login: "2023-05-03T10:05:00Z",
  },
  {
    company_id: 5,
    company_name: "MediSupply Co.",
    user_id: 501,
    username: "jennifer.lee",
    email: "jennifer@medisupply.com",
    last_login: "2023-05-01T15:30:00Z",
  },
]

export function ActiveUsersView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")

  // Get unique companies for the filter
  const companies = [...new Set(activeUsers.map((user) => user.company_name))]

  // Filter users based on search term and selected company
  const filteredUsers = activeUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCompany = selectedCompany === "all" || user.company_name === selectedCompany

    return matchesSearch && matchesCompany
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by username or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <TableHead>Company</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.company_name}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.last_login).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
