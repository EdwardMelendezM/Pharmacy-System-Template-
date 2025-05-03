"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductInventoryView } from "@/modules/inventory/components/product-inventory-view"
import { LotTraceabilityView } from "@/modules/inventory/components/lot-traceability-view"
import { UomConversionView } from "@/modules/inventory/components/uom-conversion-view"
import { LowStockAlertView } from "@/modules/inventory/components/low-stock-alert-view"
import Link from "next/link"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <Link href="/inventory/add-product">
            <Button>Add Product</Button>
          </Link>
          <Link href="/inventory/manage-suppliers">
            <Button variant="outline">Manage Suppliers</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12 added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,580.00</div>
            <p className="text-xs text-muted-foreground">Based on cost price</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="products">Product Inventory</TabsTrigger>
          <TabsTrigger value="lot-traceability">Lot Traceability</TabsTrigger>
          <TabsTrigger value="uom-conversion">UOM Conversion</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alert</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <ProductInventoryView />
        </TabsContent>
        <TabsContent value="lot-traceability" className="mt-4">
          <LotTraceabilityView />
        </TabsContent>
        <TabsContent value="uom-conversion" className="mt-4">
          <UomConversionView />
        </TabsContent>
        <TabsContent value="low-stock" className="mt-4">
          <LowStockAlertView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
