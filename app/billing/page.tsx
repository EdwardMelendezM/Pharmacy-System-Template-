"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceHeaderView } from "@/modules/billing/components/invoice-header-view"
import { InvoiceLinesView } from "@/modules/billing/components/invoice-lines-view"
import { CustomerLedgerView } from "@/modules/billing/components/customer-ledger-view"
import { MonthlyRevenueView } from "@/modules/billing/components/monthly-revenue-view"
import Link from "next/link"

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("invoices")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Billing</h1>
        <div className="flex gap-2">
          <Link href="/billing/create-invoice">
            <Button>Create Invoice</Button>
          </Link>
          <Link href="/billing/record-payment">
            <Button variant="outline">Record Payment</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,540.00</div>
            <p className="text-xs text-muted-foreground">12 invoices pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$16,240.00</div>
            <p className="text-xs text-muted-foreground">28 invoices paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,180.00</div>
            <p className="text-xs text-muted-foreground">5 invoices overdue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="invoice-lines">Invoice Lines</TabsTrigger>
          <TabsTrigger value="customer-ledger">Customer Ledger</TabsTrigger>
          <TabsTrigger value="monthly-revenue">Monthly Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
          <InvoiceHeaderView />
        </TabsContent>
        <TabsContent value="invoice-lines" className="mt-4">
          <InvoiceLinesView />
        </TabsContent>
        <TabsContent value="customer-ledger" className="mt-4">
          <CustomerLedgerView />
        </TabsContent>
        <TabsContent value="monthly-revenue" className="mt-4">
          <MonthlyRevenueView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
