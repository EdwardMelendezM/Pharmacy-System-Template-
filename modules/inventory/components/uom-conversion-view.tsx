"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for UOM conversions
const uomConversions = [
  {
    id: 1,
    from_uom: "BOX",
    to_uom: "UNIT",
    factor: 100,
    valid_from: "2023-01-01T00:00:00Z",
    valid_to: null,
    status: "Active",
  },
  {
    id: 2,
    from_uom: "CASE",
    to_uom: "BOX",
    factor: 10,
    valid_from: "2023-01-01T00:00:00Z",
    valid_to: null,
    status: "Active",
  },
  {
    id: 3,
    from_uom: "PALLET",
    to_uom: "CASE",
    factor: 50,
    valid_from: "2023-01-01T00:00:00Z",
    valid_to: null,
    status: "Active",
  },
  {
    id: 4,
    from_uom: "KG",
    to_uom: "G",
    factor: 1000,
    valid_from: "2023-01-01T00:00:00Z",
    valid_to: null,
    status: "Active",
  },
  {
    id: 5,
    from_uom: "L",
    to_uom: "ML",
    factor: 1000,
    valid_from: "2023-01-01T00:00:00Z",
    valid_to: null,
    status: "Active",
  },
  {
    id: 6,
    from_uom: "BOTTLE",
    to_uom: "UNIT",
    factor: 30,
    valid_from: "2023-01-01T00:00:00Z",
    valid_to: "2023-04-30T00:00:00Z",
    status: "Inactive",
  },
  {
    id: 7,
    from_uom: "BOTTLE",
    to_uom: "UNIT",
    factor: 40,
    valid_from: "2023-05-01T00:00:00Z",
    valid_to: null,
    status: "Active",
  },
]

// Status colors for badges
const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-800",
}

export function UomConversionView() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter UOM conversions based on search term
  const filteredConversions = uomConversions.filter(
    (item) =>
      item.from_uom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.to_uom.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by UOM..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button>Add Conversion</Button>
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
              <TableHead>From UOM</TableHead>
              <TableHead>To UOM</TableHead>
              <TableHead>Factor</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Valid To</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConversions.length > 0 ? (
              filteredConversions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.from_uom}</TableCell>
                  <TableCell>{item.to_uom}</TableCell>
                  <TableCell>{item.factor}</TableCell>
                  <TableCell>{new Date(item.valid_from).toLocaleDateString()}</TableCell>
                  <TableCell>{item.valid_to ? new Date(item.valid_to).toLocaleDateString() : "—"}</TableCell>
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
                  No UOM conversions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
