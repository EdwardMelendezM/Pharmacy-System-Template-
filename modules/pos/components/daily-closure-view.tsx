"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for daily POS closure
const dailyClosures = [
  {
    id: 1,
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    date: "2023-05-01",
    total_sales: 4250.75,
    total_cash: 1850.25,
    total_card: 2400.5,
    total_voucher: 0.0,
  },
  {
    id: 2,
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    date: "2023-05-02",
    total_sales: 5120.5,
    total_cash: 2350.0,
    total_card: 2620.5,
    total_voucher: 150.0,
  },
  {
    id: 3,
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    date: "2023-05-03",
    total_sales: 3875.25,
    total_cash: 1725.75,
    total_card: 1949.5,
    total_voucher: 200.0,
  },
  {
    id: 4,
    company_id: 2,
    company_name: "HealthPlus Supplies",
    date: "2023-05-01",
    total_sales: 3250.0,
    total_cash: 1450.0,
    total_card: 1800.0,
    total_voucher: 0.0,
  },
  {
    id: 5,
    company_id: 2,
    company_name: "HealthPlus Supplies",
    date: "2023-05-02",
    total_sales: 2980.75,
    total_cash: 1320.25,
    total_card: 1660.5,
    total_voucher: 0.0,
  },
  {
    id: 6,
    company_id: 2,
    company_name: "HealthPlus Supplies",
    date: "2023-05-03",
    total_sales: 3450.5,
    total_cash: 1550.0,
    total_card: 1750.5,
    total_voucher: 150.0,
  },
]

// Get unique companies for the filter
const uniqueCompanies = [...new Set(dailyClosures.map((closure) => closure.company_name))]

export function DailyClosureView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState("all")

  // Filter closures based on search term and company
  const filteredClosures = dailyClosures.filter((closure) => {
    const matchesSearch =
      closure.date.includes(searchTerm) || closure.company_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCompany = companyFilter === "all" || closure.company_name === companyFilter

    return matchesSearch && matchesCompany
  })

  // Calculate totals for filtered data
  const totalSales = filteredClosures.reduce((sum, closure) => sum + closure.total_sales, 0)
  const totalCash = filteredClosures.reduce((sum, closure) => sum + closure.total_cash, 0)
  const totalCard = filteredClosures.reduce((sum, closure) => sum + closure.total_card, 0)
  const totalVoucher = filteredClosures.reduce((sum, closure) => sum + closure.total_voucher, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-bold">S/ {totalSales.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cash</p>
              <h3 className="text-2xl font-bold">S/ {totalCash.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Card</p>
              <h3 className="text-2xl font-bold">S/ {totalCard.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Voucher</p>
              <h3 className="text-2xl font-bold">S/ {totalVoucher.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by date (YYYY-MM-DD)..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {uniqueCompanies.map((company) => (
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
              <TableHead>Date</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Cash</TableHead>
              <TableHead>Card</TableHead>
              <TableHead>Voucher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClosures.length > 0 ? (
              filteredClosures.map((closure) => (
                <TableRow key={closure.id}>
                  <TableCell className="font-medium">{closure.company_name}</TableCell>
                  <TableCell>{closure.date}</TableCell>
                  <TableCell>S/ {closure.total_sales.toFixed(2)}</TableCell>
                  <TableCell>S/ {closure.total_cash.toFixed(2)}</TableCell>
                  <TableCell>S/ {closure.total_card.toFixed(2)}</TableCell>
                  <TableCell>S/ {closure.total_voucher.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No closure data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
