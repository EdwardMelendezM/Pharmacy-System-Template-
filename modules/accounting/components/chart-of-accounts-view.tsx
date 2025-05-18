"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for chart of accounts
const chartOfAccounts = [
  {
    account_id: 1,
    code: "10",
    name: "EFECTIVO Y EQUIVALENTES DE EFECTIVO",
    type: "Asset",
    parent_code: null,
    level: 1,
  },
  {
    account_id: 2,
    code: "101",
    name: "Caja",
    type: "Asset",
    parent_code: "10",
    level: 2,
  },
  {
    account_id: 3,
    code: "104",
    name: "Cuentas corrientes en instituciones financieras",
    type: "Asset",
    parent_code: "10",
    level: 2,
  },
  {
    account_id: 4,
    code: "12",
    name: "CUENTAS POR COBRAR COMERCIALES – TERCEROS",
    type: "Asset",
    parent_code: null,
    level: 1,
  },
  {
    account_id: 5,
    code: "121",
    name: "Facturas, boletas y otros comprobantes por cobrar",
    type: "Asset",
    parent_code: "12",
    level: 2,
  },
  {
    account_id: 6,
    code: "40",
    name: "TRIBUTOS, CONTRAPRESTACIONES Y APORTES AL SISTEMA DE PENSIONES",
    type: "Liability",
    parent_code: null,
    level: 1,
  },
  {
    account_id: 7,
    code: "401",
    name: "Gobierno central",
    type: "Liability",
    parent_code: "40",
    level: 2,
  },
  {
    account_id: 8,
    code: "42",
    name: "PROVEEDORES",
    type: "Liability",
    parent_code: null,
    level: 1,
  },
  {
    account_id: 9,
    code: "421",
    name: "Facturas, boletas y otros comprobantes por pagar",
    type: "Liability",
    parent_code: "42",
    level: 2,
  },
  {
    account_id: 10,
    code: "70",
    name: "VENTAS",
    type: "Income",
    parent_code: null,
    level: 1,
  },
  {
    account_id: 11,
    code: "701",
    name: "Mercaderías",
    type: "Income",
    parent_code: "70",
    level: 2,
  },
  {
    account_id: 12,
    code: "60",
    name: "COMPRAS",
    type: "Expense",
    parent_code: null,
    level: 1,
  },
  {
    account_id: 13,
    code: "601",
    name: "Mercaderías",
    type: "Expense",
    parent_code: "60",
    level: 2,
  },
]

// Type colors for badges
const typeColors: Record<string, string> = {
  Asset: "bg-blue-100 text-blue-800",
  Liability: "bg-red-100 text-red-800",
  Income: "bg-green-100 text-green-800",
  Expense: "bg-yellow-100 text-yellow-800",
}

export function ChartOfAccountsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter accounts based on search term and type
  const filteredAccounts = chartOfAccounts.filter((account) => {
    const matchesSearch =
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || account.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por código o nombre..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Asset">Activo</SelectItem>
              <SelectItem value="Liability">Pasivo</SelectItem>
              <SelectItem value="Income">Ingreso</SelectItem>
              <SelectItem value="Expense">Gasto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <DownloadIcon className="h-4 w-4" />
          <span className="sr-only">Descargar datos</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cuenta padre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <TableRow key={account.account_id}>
                  <TableCell className="font-medium">{account.code}</TableCell>
                  <TableCell>
                    <div className="pl-[{account.level - 1}rem]">{account.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColors[account.type] || "bg-gray-100 text-gray-800"}>
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.parent_code || "—"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No se encontraron cuentas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
