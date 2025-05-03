"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for trial balance
const trialBalance = [
  {
    account_code: "10",
    account_name: "EFECTIVO Y EQUIVALENTES DE EFECTIVO",
    sum_debit: 15000.0,
    sum_credit: 8000.0,
    balance: 7000.0,
    type: "Asset",
  },
  {
    account_code: "12",
    account_name: "CUENTAS POR COBRAR COMERCIALES – TERCEROS",
    sum_debit: 25000.0,
    sum_credit: 15000.0,
    balance: 10000.0,
    type: "Asset",
  },
  {
    account_code: "20",
    account_name: "MERCADERÍAS",
    sum_debit: 35000.0,
    sum_credit: 20000.0,
    balance: 15000.0,
    type: "Asset",
  },
  {
    account_code: "33",
    account_name: "INMUEBLES, MAQUINARIA Y EQUIPO",
    sum_debit: 50000.0,
    sum_credit: 0.0,
    balance: 50000.0,
    type: "Asset",
  },
  {
    account_code: "40",
    account_name: "TRIBUTOS, CONTRAPRESTACIONES Y APORTES AL SISTEMA DE PENSIONES",
    sum_debit: 5000.0,
    sum_credit: 8000.0,
    balance: -3000.0,
    type: "Liability",
  },
  {
    account_code: "42",
    account_name: "PROVEEDORES",
    sum_debit: 18000.0,
    sum_credit: 25000.0,
    balance: -7000.0,
    type: "Liability",
  },
  {
    account_code: "50",
    account_name: "CAPITAL",
    sum_debit: 0.0,
    sum_credit: 60000.0,
    balance: -60000.0,
    type: "Equity",
  },
  {
    account_code: "59",
    account_name: "RESULTADOS ACUMULADOS",
    sum_debit: 0.0,
    sum_credit: 12000.0,
    balance: -12000.0,
    type: "Equity",
  },
  {
    account_code: "70",
    account_name: "VENTAS",
    sum_debit: 0.0,
    sum_credit: 45000.0,
    balance: -45000.0,
    type: "Income",
  },
  {
    account_code: "60",
    account_name: "COMPRAS",
    sum_debit: 30000.0,
    sum_credit: 0.0,
    balance: 30000.0,
    type: "Expense",
  },
  {
    account_code: "62",
    account_name: "GASTOS DE PERSONAL, DIRECTORES Y GERENTES",
    sum_debit: 15000.0,
    sum_credit: 0.0,
    balance: 15000.0,
    type: "Expense",
  },
]

// Type colors for badges
const typeColors: Record<string, string> = {
  Asset: "bg-blue-100 text-blue-800",
  Liability: "bg-red-100 text-red-800",
  Equity: "bg-purple-100 text-purple-800",
  Income: "bg-green-100 text-green-800",
  Expense: "bg-yellow-100 text-yellow-800",
}

export function TrialBalanceView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter accounts based on search term and type
  const filteredAccounts = trialBalance.filter((account) => {
    const matchesSearch =
      account.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || account.type === typeFilter

    return matchesSearch && matchesType
  })

  // Calculate totals
  const totalDebit = filteredAccounts.reduce((sum, account) => sum + account.sum_debit, 0)
  const totalCredit = filteredAccounts.reduce((sum, account) => sum + account.sum_credit, 0)
  const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Debits</p>
              <h3 className="text-2xl font-bold">S/ {totalDebit.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
              <h3 className="text-2xl font-bold">S/ {totalCredit.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
              <h3 className="text-2xl font-bold">S/ {totalBalance.toFixed(2)}</h3>
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
              placeholder="Search by account code or name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Asset">Asset</SelectItem>
              <SelectItem value="Liability">Liability</SelectItem>
              <SelectItem value="Equity">Equity</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
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
              <TableHead>Account Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Balance</TableHead>
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
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell>S/ {account.sum_debit.toFixed(2)}</TableCell>
                  <TableCell>S/ {account.sum_credit.toFixed(2)}</TableCell>
                  <TableCell
                    className={
                      account.balance > 0
                        ? "text-blue-600 font-medium"
                        : account.balance < 0
                          ? "text-red-600 font-medium"
                          : ""
                    }
                  >
                    S/ {Math.abs(account.balance).toFixed(2)} {account.balance < 0 ? "(Cr)" : "(Dr)"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
