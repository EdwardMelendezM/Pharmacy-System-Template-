"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for product inventory
const productInventory = [
  {
    id: 1,
    product_id: 101,
    product_code: "MED001",
    product_name: "Paracetamol 500mg",
    warehouse_id: 1,
    warehouse_name: "Main Warehouse",
    location_id: "A-01-01",
    quantity_available: 2500,
    reorder_point: 500,
    status: "In Stock",
  },
  {
    id: 2,
    product_id: 102,
    product_code: "MED002",
    product_name: "Ibuprofeno 400mg",
    warehouse_id: 1,
    warehouse_name: "Main Warehouse",
    location_id: "A-01-02",
    quantity_available: 1800,
    reorder_point: 400,
    status: "In Stock",
  },
  {
    id: 3,
    product_id: 103,
    product_code: "MED003",
    product_name: "Amoxicilina 500mg",
    warehouse_id: 1,
    warehouse_name: "Main Warehouse",
    location_id: "A-02-01",
    quantity_available: 350,
    reorder_point: 400,
    status: "Low Stock",
  },
  {
    id: 4,
    product_id: 104,
    product_code: "MED004",
    product_name: "Loratadina 10mg",
    warehouse_id: 2,
    warehouse_name: "Secondary Warehouse",
    location_id: "B-01-01",
    quantity_available: 1200,
    reorder_point: 300,
    status: "In Stock",
  },
  {
    id: 5,
    product_id: 105,
    product_code: "MED005",
    product_name: "Omeprazol 20mg",
    warehouse_id: 2,
    warehouse_name: "Secondary Warehouse",
    location_id: "B-01-02",
    quantity_available: 950,
    reorder_point: 250,
    status: "In Stock",
  },
  {
    id: 6,
    product_id: 106,
    product_code: "MED006",
    product_name: "Aspirina 100mg",
    warehouse_id: 1,
    warehouse_name: "Main Warehouse",
    location_id: "A-03-01",
    quantity_available: 0,
    reorder_point: 300,
    status: "Out of Stock",
  },
]

// Get unique warehouses for the filter
const uniqueWarehouses = [...new Set(productInventory.map((item) => item.warehouse_name))]

// Status colors for badges
const statusColors: Record<string, string> = {
  "In Stock": "bg-green-100 text-green-800",
  "Low Stock": "bg-yellow-100 text-yellow-800",
  "Out of Stock": "bg-red-100 text-red-800",
}

export function ProductInventoryView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter inventory based on search term, warehouse, and status
  const filteredInventory = productInventory.filter((item) => {
    const matchesSearch =
      item.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesWarehouse = warehouseFilter === "all" || item.warehouse_name === warehouseFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesWarehouse && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by product code, name or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {uniqueWarehouses.map((warehouse) => (
                <SelectItem key={warehouse} value={warehouse}>
                  {warehouse}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
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
              <TableHead>Product Code</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product_code}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.warehouse_name}</TableCell>
                  <TableCell>{item.location_id}</TableCell>
                  <TableCell>{item.quantity_available}</TableCell>
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
                  No inventory data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
