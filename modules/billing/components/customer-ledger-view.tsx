"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for customer ledger
const customerLedger = [
  {
    customer_id: 1,
    customer_name: "Hospital San Juan",
    total_billed: 15250.0,
    total_paid: 12500.0,
    balance: 2750.0,
  },
  {
    customer_id: 2,
    customer_name: "Clínica Santa María",
    total_billed: 23450.75,
    total_paid: 23450.75,
    balance: 0.0,
  },
  {
    customer_id: 3,
    customer_name: "Farmacia Universal",
    total_billed: 8750.5,
    total_paid: 5000.0,
    balance: 3750.5,
  },
  {
    customer_id: 4,
    customer_name: "Hospital Nacional",
    total_billed: 32100.0,
    total_paid: 28500.0,
    balance: 3600.0,
  },
  {
    customer_id: 5,
    customer_name: "Clínica Internacional",
    total_billed: 18750.25,
    total_paid: 18750.25,
    balance: 0.0,
  },
  {
    customer_id: 6,
    customer_name: "Farmacia Inkafarma",
    total_billed: 9500.0,
    total_paid: 7500.0,
    balance: 2000.0,
  },
]

export function CustomerLedgerView() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customerLedger.filter((customer) =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate totals
  const totalBilled = customerLedger.reduce((sum, customer) => sum + customer.total_billed, 0)
  const totalPaid = customerLedger.reduce((sum, customer) => sum + customer.total_paid, 0)
  const totalBalance = customerLedger.reduce((sum, customer) => sum + customer.balance, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Billed</p>
              <h3 className="text-2xl font-bold">S/ {totalBilled.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
              <h3 className="text-2xl font-bold">S/ {totalPaid.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
              <h3 className="text-2xl font-bold">S/ {totalBalance.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer name..."
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
              <TableHead>Customer</TableHead>
              <TableHead>Total Billed</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell className="font-medium">{customer.customer_name}</TableCell>
                  <TableCell>S/ {customer.total_billed.toFixed(2)}</TableCell>
                  <TableCell>S/ {customer.total_paid.toFixed(2)}</TableCell>
                  <TableCell className={customer.balance > 0 ? "text-red-600 font-medium" : ""}>
                    S/ {customer.balance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
