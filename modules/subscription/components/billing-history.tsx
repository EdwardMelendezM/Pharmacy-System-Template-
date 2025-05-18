"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Mock data for billing history
const mockInvoices = [
  {
    id: "INV-001",
    date: "2023-05-01",
    amount: "$29.00",
    status: "Paid",
    plan: "Basic",
  },
  {
    id: "INV-002",
    date: "2023-06-01",
    amount: "$29.00",
    status: "Paid",
    plan: "Basic",
  },
  {
    id: "INV-003",
    date: "2023-07-01",
    amount: "$79.00",
    status: "Paid",
    plan: "Professional",
  },
  {
    id: "INV-004",
    date: "2023-08-01",
    amount: "$79.00",
    status: "Paid",
    plan: "Professional",
  },
  {
    id: "INV-005",
    date: "2023-09-01",
    amount: "$79.00",
    status: "Pending",
    plan: "Professional",
  },
]

export function BillingHistory() {
  const [invoices] = useState(mockInvoices)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.plan}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
