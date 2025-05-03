"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionSummaryView } from "@/modules/pos/components/session-summary-view"
import { OrdersSummaryView } from "@/modules/pos/components/orders-summary-view"
import { DailyClosureView } from "@/modules/pos/components/daily-closure-view"
import Link from "next/link"

export default function POSPage() {
  const [activeTab, setActiveTab] = useState("pos")

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Point of Sale</h1>
        <div className="flex gap-2">
          <Link href="/pos/open-drawer">
            <Button variant="outline">Open Drawer</Button>
          </Link>
          <Link href="/pos/end-shift">
            <Button variant="outline">End Shift</Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="pos">POS</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="daily-closure">Daily Closure</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="flex-1 flex flex-col mt-4">
          <div className="flex flex-1 gap-6">
            <div className="w-2/3 flex flex-col">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search products..." className="pl-8" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-auto flex-1 pb-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-muted rounded-md mb-2"></div>
                      <h3 className="font-medium text-sm truncate">Product {i + 1}</h3>
                      <p className="text-sm text-muted-foreground">${(9.99 + i).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="w-1/3">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Current Sale</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-auto mb-4">
                    <p className="text-center text-muted-foreground py-8">No items added yet</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>$0.00</span>
                    </div>

                    <Button className="w-full">Checkout</Button>
                    <Button variant="outline" className="w-full">
                      Hold Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <SessionSummaryView />
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <OrdersSummaryView />
        </TabsContent>

        <TabsContent value="daily-closure" className="mt-4">
          <DailyClosureView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
