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
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SystemModule, PermissionLevel } from "@/lib/models/user"

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("invoices")

  return (
    <ProtectedRoute module={SystemModule.BILLING} requiredPermission={PermissionLevel.STAFF}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Facturación</h1>
          <div className="flex gap-2">
            <Link href="/billing/create-invoice">
              <Button>Crear Factura</Button>
            </Link>
            <Link href="/billing/record-payment">
              <Button variant="outline">Registrar Pago</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,540.00</div>
              <p className="text-xs text-muted-foreground">12 facturas pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pagado Este Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$16,240.00</div>
              <p className="text-xs text-muted-foreground">28 facturas pagadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,180.00</div>
              <p className="text-xs text-muted-foreground">5 facturas vencidas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="invoice-lines">Líneas de Factura</TabsTrigger>
            <TabsTrigger value="customer-ledger">Libro del Cliente</TabsTrigger>
            <TabsTrigger value="monthly-revenue">Ingresos Mensuales</TabsTrigger>
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
    </ProtectedRoute>
  )
}
