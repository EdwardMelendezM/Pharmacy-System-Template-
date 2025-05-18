"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for P&L by account
const plByAccount = [
  {
    account_code: "70",
    account_name: "VENTAS",
    type: "Income",
    total_debit: 0.0,
    total_credit: 45000.0,
    net_amount: 45000.0,
  },
  {
    account_code: "701",
    account_name: "Mercaderías",
    type: "Income",
    total_debit: 0.0,
    total_credit: 40000.0,
    net_amount: 40000.0,
  },
  {
    account_code: "704",
    account_name: "Servicios",
    type: "Income",
    total_debit: 0.0,
    total_credit: 5000.0,
    net_amount: 5000.0,
  },
  {
    account_code: "60",
    account_name: "COMPRAS",
    type: "Expense",
    total_debit: 30000.0,
    total_credit: 0.0,
    net_amount: -30000.0,
  },
  {
    account_code: "601",
    account_name: "Mercaderías",
    type: "Expense",
    total_debit: 30000.0,
    total_credit: 0.0,
    net_amount: -30000.0,
  },
  {
    account_code: "62",
    account_name: "GASTOS DE PERSONAL, DIRECTORES Y GERENTES",
    type: "Expense",
    total_debit: 15000.0,
    total_credit: 0.0,
    net_amount: -15000.0,
  },
  {
    account_code: "621",
    account_name: "Remuneraciones",
    type: "Expense",
    total_debit: 12000.0,
    total_credit: 0.0,
    net_amount: -12000.0,
  },
  {
    account_code: "627",
    account_name: "Seguridad y previsión social",
    type: "Expense",
    total_debit: 3000.0,
    total_credit: 0.0,
    net_amount: -3000.0,
  },
  {
    account_code: "63",
    account_name: "GASTOS DE SERVICIOS PRESTADOS POR TERCEROS",
    type: "Expense",
    total_debit: 8000.0,
    total_credit: 0.0,
    net_amount: -8000.0,
  },
  {
    account_code: "636",
    account_name: "Servicios básicos",
    type: "Expense",
    total_debit: 3000.0,
    total_credit: 0.0,
    net_amount: -3000.0,
  },
  {
    account_code: "639",
    account_name: "Otros servicios prestados por terceros",
    type: "Expense",
    total_debit: 5000.0,
    total_credit: 0.0,
    net_amount: -5000.0,
  },
]

// Type colors for badges
const typeColors: Record<string, string> = {
  Income: "bg-green-100 text-green-800",
  Expense: "bg-yellow-100 text-yellow-800",
}

export function PLByAccountView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter accounts based on search term and type
  const filteredAccounts = plByAccount.filter((account) => {
    const matchesSearch =
      account.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || account.type === typeFilter

    return matchesSearch && matchesType
  })

  // Calculate totals
  const totalIncome = plByAccount
    .filter((account) => account.type === "Income")
    .reduce((sum, account) => sum + account.net_amount, 0)

  const totalExpense = plByAccount
    .filter((account) => account.type === "Expense")
    .reduce((sum, account) => sum + account.net_amount, 0)

  const netProfit = totalIncome + totalExpense // Expense net_amount is already negative

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-green-600">S/ {totalIncome.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
              <h3 className="text-2xl font-bold text-red-600">S/ {Math.abs(totalExpense).toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Utilidad Neta</p>
              <h3 className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                S/ {Math.abs(netProfit).toFixed(2)} {netProfit < 0 ? "(Pérdida)" : ""}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por código o nombre de cuenta..."
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
              <SelectItem value="all">Todos los Tipos</SelectItem>
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
              <TableHead>Nombre de Cuenta</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Débito</TableHead>
              <TableHead>Crédito</TableHead>
              <TableHead>Importe Neto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <TableRow key={account.account_code}>
                  <TableCell className="font-medium">{account.account_code}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColors[account.type] || "bg-gray-100 text-gray-800"}>
                      {account.type === "Income" ? "Ingreso" : "Gasto"}
                    </Badge>
                  </TableCell>
                  <TableCell>S/ {account.total_debit.toFixed(2)}</TableCell>
                  <TableCell>S/ {account.total_credit.toFixed(2)}</TableCell>
                  <TableCell
                    className={
                      account.net_amount > 0
                        ? "text-green-600 font-medium"
                        : account.net_amount < 0
                          ? "text-red-600 font-medium"
                          : ""
                    }
                  >
                    S/ {Math.abs(account.net_amount).toFixed(2)} {account.net_amount < 0 ? "(Gasto)" : "(Ingreso)"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
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
