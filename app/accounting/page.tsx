"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartOfAccountsView } from "@/modules/accounting/components/chart-of-accounts-view"
import { JournalEntriesView } from "@/modules/accounting/components/journal-entries-view"
import { TrialBalanceView } from "@/modules/accounting/components/trial-balance-view"
import { PLByAccountView } from "@/modules/accounting/components/pl-by-account-view"
import Link from "next/link"

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("ledger")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounting</h1>
        <div className="flex gap-2">
          <Link href="/accounting/new-transaction">
            <Button>New Transaction</Button>
          </Link>
          <Link href="/accounting/generate-report">
            <Button variant="outline">Generate Report</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,780.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,540.00</div>
            <p className="text-xs text-muted-foreground">+4.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,240.00</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="ledger">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="pl-account">P&L by Account</TabsTrigger>
        </TabsList>
        <TabsContent value="ledger" className="mt-4">
          <ChartOfAccountsView />
        </TabsContent>
        <TabsContent value="journal" className="mt-4">
          <JournalEntriesView />
        </TabsContent>
        <TabsContent value="trial-balance" className="mt-4">
          <TrialBalanceView />
        </TabsContent>
        <TabsContent value="pl-account" className="mt-4">
          <PLByAccountView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
