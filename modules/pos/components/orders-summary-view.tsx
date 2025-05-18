"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos simulados de órdenes POS
const posOrders = [
  {
    order_id: 5001,
    session_id: 1001,
    order_date: "2023-05-01T09:15:00Z",
    payment_method: "Cash",
    amount: 125.5,
  },
  {
    order_id: 5002,
    session_id: 1001,
    order_date: "2023-05-01T10:30:00Z",
    payment_method: "Card",
    amount: 350.75,
  },
  {
    order_id: 5003,
    session_id: 1001,
    order_date: "2023-05-01T11:45:00Z",
    payment_method: "Cash",
    amount: 75.25,
  },
  {
    order_id: 5004,
    session_id: 1002,
    order_date: "2023-05-01T09:30:00Z",
    payment_method: "Card",
    amount: 420.0,
  },
  {
    order_id: 5005,
    session_id: 1002,
    order_date: "2023-05-01T12:15:00Z",
    payment_method: "Cash",
    amount: 95.5,
  },
  {
    order_id: 5006,
    session_id: 1003,
    order_date: "2023-05-02T10:00:00Z",
    payment_method: "Card",
    amount: 275.25,
  },
  {
    order_id: 5007,
    session_id: 1003,
    order_date: "2023-05-02T14:30:00Z",
    payment_method: "Voucher",
    amount: 150.0,
  },
  {
    order_id: 5008,
    session_id: 1004,
    order_date: "2023-05-02T11:15:00Z",
    payment_method: "Cash",
    amount: 85.75,
  },
  {
    order_id: 5009,
    session_id: 1004,
    order_date: "2023-05-02T15:45:00Z",
    payment_method: "Card",
    amount: 320.5,
  },
]

// IDs de sesión únicos para el filtro
const uniqueSessionIds = [...new Set(posOrders.map((order) => order.session_id))]

// Colores de métodos de pago para badges
const paymentMethodColors: Record<string, string> = {
  Cash: "bg-green-100 text-green-800",
  Card: "bg-blue-100 text-blue-800",
  Voucher: "bg-purple-100 text-purple-800",
}

export function OrdersSummaryView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sessionFilter, setSessionFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")

  // Filtrar órdenes según búsqueda, sesión y método de pago
  const filteredOrders = posOrders.filter((order) => {
    const matchesSearch = order.order_id.toString().includes(searchTerm)

    const matchesSession = sessionFilter === "all" || order.session_id.toString() === sessionFilter
    const matchesPaymentMethod = paymentMethodFilter === "all" || order.payment_method === paymentMethodFilter

    return matchesSearch && matchesSession && matchesPaymentMethod
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por ID de orden..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sessionFilter} onValueChange={setSessionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por sesión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sesiones</SelectItem>
              {uniqueSessionIds.map((id) => (
                <SelectItem key={id} value={id.toString()}>
                  Sesión {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los métodos</SelectItem>
              <SelectItem value="Cash">Efectivo</SelectItem>
              <SelectItem value="Card">Tarjeta</SelectItem>
              <SelectItem value="Voucher">Vale</SelectItem>
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
              <TableHead>ID de orden</TableHead>
              <TableHead>ID de sesión</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Método de pago</TableHead>
              <TableHead>Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{order.session_id}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={paymentMethodColors[order.payment_method] || "bg-gray-100 text-gray-800"}
                    >
                      {order.payment_method === "Cash"
                        ? "Efectivo"
                        : order.payment_method === "Card"
                          ? "Tarjeta"
                          : "Vale"}
                    </Badge>
                  </TableCell>
                  <TableCell>S/ {order.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No se encontraron órdenes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
