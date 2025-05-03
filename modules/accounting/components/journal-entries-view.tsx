"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for journal entries
const journalEntries = [
  {
    id: 1,
    move_id: "JE-2023-001",
    date: "2023-05-01",
    account_code: "101",
    account_name: "Caja",
    description: "Venta al contado",
    debit: 1000.0,
    credit: 0.0,
  },
  {
    id: 2,
    move_id: "JE-2023-001",
    date: "2023-05-01",
    account_code: "701",
    account_name: "Mercaderías",
    description: "Venta al contado",
    debit: 0.0,
    credit: 847.46,
  },
  {
    id: 3,
    move_id: "JE-2023-001",
    date: "2023-05-01",
    account_code: "401",
    account_name: "Gobierno central",
    description: "IGV de la venta",
    debit: 0.0,
    credit: 152.54,
  },
  {
    id: 4,
    move_id: "JE-2023-002",
    date: "2023-05-02",
    account_code: "601",
    account_name: "Mercaderías",
    description: "Compra de mercadería",
    debit: 2500.0,
    credit: 0.0,
  },
  {
    id: 5,
    move_id: "JE-2023-002",
    date: "2023-05-02",
    account_code: "401",
    account_name: "Gobierno central",
    description: "IGV de la compra",
    debit: 450.0,
    credit: 0.0,
  },
  {
    id: 6,
    move_id: "JE-2023-002",
    date: "2023-05-02",
    account_code: "421",
    account_name: "Facturas, boletas y otros comprobantes por pagar",
    description: "Compra de mercadería",
    debit: 0.0,
    credit: 2950.0,
  },
  {
    id: 7,
    move_id: "JE-2023-003",
    date: "2023-05-03",
    account_code: "104",
    account_name: "Cuentas corrientes en instituciones financieras",
    description: "Depósito de efectivo",
    debit: 800.0,
    credit: 0.0,
  },
  {
    id: 8,
    move_id: "JE-2023-003",
    date: "2023-05-03",
    account_code: "101",
    account_name: "Caja",
    description: "Depósito de efectivo",
    debit: 0.0,
    credit: 800.0,
  },
]

// Get unique move IDs for the filter
const uniqueMoveIds = [...new Set(journalEntries.map((entry) => entry.move_id))]

export function JournalEntriesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [moveFilter, setMoveFilter] = useState("all")

  // Filter journal entries based on search term and move ID
  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMove = moveFilter === "all" || entry.move_id === moveFilter

    return matchesSearch && matchesMove
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by account or description..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={moveFilter} onValueChange={setMoveFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by entry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entries</SelectItem>
              {uniqueMoveIds.map((moveId) => (
                <SelectItem key={moveId} value={moveId}>
                  {moveId}
                </SelectItem>
              ))}
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
              <TableHead>Entry ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.move_id}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <div className="font-medium">{entry.account_code}</div>
                    <div className="text-sm text-muted-foreground">{entry.account_name}</div>
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className={entry.debit > 0 ? "font-medium" : "text-muted-foreground"}>
                    {entry.debit > 0 ? `S/ ${entry.debit.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className={entry.credit > 0 ? "font-medium" : "text-muted-foreground"}>
                    {entry.credit > 0 ? `S/ ${entry.credit.toFixed(2)}` : "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No journal entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
