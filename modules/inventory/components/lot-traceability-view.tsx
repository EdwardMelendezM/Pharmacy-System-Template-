"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for lot traceability
const lotTraceability = [
  {
    id: 1,
    lot_id: "LOT001",
    product_id: 101,
    product_name: "Paracetamol 500mg",
    lot_number: "L2023-001",
    move_type: "Receipt",
    date: "2023-01-15T10:30:00Z",
    quantity: 1000,
    location_from: "Supplier",
    location_to: "Main Warehouse",
  },
  {
    id: 2,
    lot_id: "LOT001",
    product_id: 101,
    product_name: "Paracetamol 500mg",
    lot_number: "L2023-001",
    move_type: "Transfer",
    date: "2023-02-05T14:15:00Z",
    quantity: 200,
    location_from: "Main Warehouse",
    location_to: "Secondary Warehouse",
  },
  {
    id: 3,
    lot_id: "LOT001",
    product_id: 101,
    product_name: "Paracetamol 500mg",
    lot_number: "L2023-001",
    move_type: "Sale",
    date: "2023-02-10T09:45:00Z",
    quantity: 50,
    location_from: "Main Warehouse",
    location_to: "Customer",
  },
  {
    id: 4,
    lot_id: "LOT002",
    product_id: 102,
    product_name: "Ibuprofeno 400mg",
    lot_number: "L2023-002",
    move_type: "Receipt",
    date: "2023-01-20T11:00:00Z",
    quantity: 800,
    location_from: "Supplier",
    location_to: "Main Warehouse",
  },
  {
    id: 5,
    lot_id: "LOT002",
    product_id: 102,
    product_name: "Ibuprofeno 400mg",
    lot_number: "L2023-002",
    move_type: "Sale",
    date: "2023-02-15T10:30:00Z",
    quantity: 100,
    location_from: "Main Warehouse",
    location_to: "Customer",
  },
  {
    id: 6,
    lot_id: "LOT003",
    product_id: 103,
    product_name: "Amoxicilina 500mg",
    lot_number: "L2023-003",
    move_type: "Receipt",
    date: "2023-01-25T09:15:00Z",
    quantity: 500,
    location_from: "Supplier",
    location_to: "Main Warehouse",
  },
  {
    id: 7,
    lot_id: "LOT003",
    product_id: 103,
    product_name: "Amoxicilina 500mg",
    lot_number: "L2023-003",
    move_type: "Adjustment",
    date: "2023-02-20T15:45:00Z",
    quantity: -50,
    location_from: "Main Warehouse",
    location_to: "Main Warehouse",
  },
]

// Get unique lot numbers for the filter
const uniqueLots = [...new Set(lotTraceability.map((item) => item.lot_number))]

// Move type colors for badges
const moveTypeColors: Record<string, string> = {
  Receipt: "bg-green-100 text-green-800",
  Transfer: "bg-blue-100 text-blue-800",
  Sale: "bg-purple-100 text-purple-800",
  Adjustment: "bg-yellow-100 text-yellow-800",
}

export function LotTraceabilityView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [lotFilter, setLotFilter] = useState("all")
  const [moveTypeFilter, setMoveTypeFilter] = useState("all")

  // Filter lot movements based on search term, lot number, and move type
  const filteredMovements = lotTraceability.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lot_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLot = lotFilter === "all" || item.lot_number === lotFilter
    const matchesMoveType = moveTypeFilter === "all" || item.move_type === moveTypeFilter

    return matchesSearch && matchesLot && matchesMoveType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by product name or lot number..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={lotFilter} onValueChange={setLotFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by lot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lots</SelectItem>
              {uniqueLots.map((lot) => (
                <SelectItem key={lot} value={lot}>
                  {lot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={moveTypeFilter} onValueChange={setMoveTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by move type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Receipt">Receipt</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
              <SelectItem value="Sale">Sale</SelectItem>
              <SelectItem value="Adjustment">Adjustment</SelectItem>
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
              <TableHead>Product</TableHead>
              <TableHead>Lot Number</TableHead>
              <TableHead>Move Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length > 0 ? (
              filteredMovements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.lot_number}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={moveTypeColors[item.move_type] || "bg-gray-100 text-gray-800"}>
                      {item.move_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                  <TableCell className={item.quantity < 0 ? "text-red-600" : ""}>{item.quantity}</TableCell>
                  <TableCell>{item.location_from}</TableCell>
                  <TableCell>{item.location_to}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No lot movements found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
