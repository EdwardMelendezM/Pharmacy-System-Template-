"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for company overview
const companyOverview = [
  {
    company_id: 1,
    name: "MediCorp Pharmaceuticals",
    ruc: "20123456789",
    total_users: 15,
    registration_date: "2020-01-15T00:00:00Z",
  },
  {
    company_id: 2,
    name: "HealthPlus Supplies",
    ruc: "20234567890",
    total_users: 8,
    registration_date: "2020-03-22T00:00:00Z",
  },
  {
    company_id: 3,
    name: "Wellness Distributors",
    ruc: "20345678901",
    total_users: 5,
    registration_date: "2021-05-10T00:00:00Z",
  },
  {
    company_id: 4,
    name: "PharmaTech Solutions",
    ruc: "20456789012",
    total_users: 12,
    registration_date: "2019-11-05T00:00:00Z",
  },
  {
    company_id: 5,
    name: "MediSupply Co.",
    ruc: "20567890123",
    total_users: 7,
    registration_date: "2022-02-18T00:00:00Z",
  },
]

export function CompanyOverviewView() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter companies based on search term
  const filteredCompanies = companyOverview.filter(
    (company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.ruc.includes(searchTerm),
  )

  // Calculate total companies and users
  const totalCompanies = companyOverview.length
  const totalUsers = companyOverview.reduce((sum, company) => sum + company.total_users, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                <h3 className="text-2xl font-bold">{totalCompanies}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">{totalUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by company name or RUC..."
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
              <TableHead>Company Name</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Total Users</TableHead>
              <TableHead>Registration Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company.company_id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.ruc}</TableCell>
                  <TableCell>{company.total_users}</TableCell>
                  <TableCell>{new Date(company.registration_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
