"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

// Mock data for low stock alerts
const lowStockAlerts = [
  {
    product_id: 103,
    product_code: "MED003",
    product_name: "Amoxicilina 500mg",
    quantity_available: 350,
    reorder_point: 400,
    warehouse_name: "Main Warehouse",
    status: "Low Stock",
  },
  {
    product_id: 106,
    product_code: "MED006",
    product_name: "Aspirina 100mg",
    quantity_available: 0,
    reorder_point: 300,
    warehouse_name: "Main Warehouse",
    status: "Out of Stock",
  },
  {
    product_id: 108,
    product_code: "MED008",
    product_name: "Diclofenaco 50mg",
    quantity_available: 180,
    reorder_point: 250,
    warehouse_name: "Secondary Warehouse",
    status: "Low Stock",
  },
  {
    product_id: 110,
    product_code: "MED010",
    product_name: "Cetirizina 10mg",
    quantity_available: 120,
    reorder_point: 200,
    warehouse_name: "Main Warehouse",
    status: "Low Stock",
  },
  {
    product_id: 112,
    product_code: "MED012",
    product_name: "Metformina 850mg",
    quantity_available: 0,
    reorder_point: 150,
    warehouse_name: "Secondary Warehouse",
    status: "Out of Stock",
  },
]

// Status colors for badges
const statusColors: Record<string, string> = {
  "Low Stock": "bg-yellow-100 text-yellow-800",
  "Out of Stock": "bg-red-100 text-red-800",
}

export function LowStockAlertView() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter low stock alerts based on search term
  const filteredAlerts = lowStockAlerts.filter(
    (item) =>
      item.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Count by status
  const lowStockCount = lowStockAlerts.filter((item) => item.status === "Low Stock").length
  const outOfStockCount = lowStockAlerts.filter((item) => item.status === "Out of Stock").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-800" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <h3 className="text-2xl font-bold">{lowStockCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-800" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock Items</p>
                <h3 className="text-2xl font-bold">{outOfStockCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by product code or name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button>Create Purchase Order</Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <DownloadIcon className="h-4 w-4" />
            <span className="sr-only">Download data</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Code</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Reorder Point</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell className="font-medium">{item.product_code}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.warehouse_name}</TableCell>
                  <TableCell>{item.quantity_available}</TableCell>
                  <TableCell>{item.reorder_point}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[item.status] || "bg-gray-100 text-gray-800"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No low stock alerts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
