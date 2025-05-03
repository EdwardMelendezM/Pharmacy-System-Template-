"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for invoice headers
const invoiceHeaders = [
  {
    invoice_id: 1001,
    invoice_code: "F001-00001",
    customer_name: "Hospital San Juan",
    issue_date: "2023-04-15T00:00:00Z",
    total_amount: 1250.0,
    currency: "PEN",
    sunat_status: "Accepted",
  },
  {
    invoice_id: 1002,
    invoice_code: "F001-00002",
    customer_name: "Clínica Santa María",
    issue_date: "2023-04-16T00:00:00Z",
    total_amount: 3450.75,
    currency: "PEN",
    sunat_status: "Accepted",
  },
  {
    invoice_id: 1003,
    invoice_code: "F001-00003",
    customer_name: "Farmacia Universal",
    issue_date: "2023-04-18T00:00:00Z",
    total_amount: 875.5,
    currency: "PEN",
    sunat_status: "Rejected",
  },
  {
    invoice_id: 1004,
    invoice_code: "F001-00004",
    customer_name: "Hospital Nacional",
    issue_date: "2023-04-20T00:00:00Z",
    total_amount: 2100.0,
    currency: "PEN",
    sunat_status: "Pending",
  },
  {
    invoice_id: 1005,
    invoice_code: "F001-00005",
    customer_name: "Clínica Internacional",
    issue_date: "2023-04-22T00:00:00Z",
    total_amount: 1875.25,
    currency: "PEN",
    sunat_status: "Accepted",
  },
  {
    invoice_id: 1006,
    invoice_code: "F001-00006",
    customer_name: "Farmacia Inkafarma",
    issue_date: "2023-04-25T00:00:00Z",
    total_amount: 950.0,
    currency: "PEN",
    sunat_status: "Pending",
  },
]

// Status colors for badges
const statusColors: Record<string, string> = {
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
}

export function InvoiceHeaderView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter invoices based on search term and status
  const filteredInvoices = invoiceHeaders.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.sunat_status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by invoice code or customer..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
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
              <TableHead>Invoice Code</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>SUNAT Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.invoice_id}>
                  <TableCell className="font-medium">{invoice.invoice_code}</TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {invoice.currency} {invoice.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[invoice.sunat_status] || "bg-gray-100 text-gray-800"}
                    >
                      {invoice.sunat_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
