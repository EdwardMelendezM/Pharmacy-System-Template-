"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos simulados de sesiones POS
const posSessions = [
  {
    session_id: 1001,
    user_name: "John Doe",
    start_time: "2023-05-01T08:00:00Z",
    end_time: "2023-05-01T16:30:00Z",
    opening_amount: 500.0,
    closing_amount: 2350.75,
    variance: 0.0,
    status: "Closed",
  },
  {
    session_id: 1002,
    user_name: "Jane Smith",
    start_time: "2023-05-01T08:15:00Z",
    end_time: "2023-05-01T16:45:00Z",
    opening_amount: 500.0,
    closing_amount: 1875.5,
    variance: -25.0,
    status: "Closed",
  },
  {
    session_id: 1003,
    user_name: "Robert Johnson",
    start_time: "2023-05-02T08:00:00Z",
    end_time: "2023-05-02T16:30:00Z",
    opening_amount: 500.0,
    closing_amount: 3120.25,
    variance: 15.5,
    status: "Closed",
  },
  {
    session_id: 1004,
    user_name: "Emily Davis",
    start_time: "2023-05-02T08:30:00Z",
    end_time: "2023-05-02T17:00:00Z",
    opening_amount: 500.0,
    closing_amount: 2780.0,
    variance: 0.0,
    status: "Closed",
  },
  {
    session_id: 1005,
    user_name: "John Doe",
    start_time: "2023-05-03T08:00:00Z",
    end_time: null,
    opening_amount: 500.0,
    closing_amount: null,
    variance: null,
    status: "Open",
  },
]

// Colores de estado para los badges
const statusColors: Record<string, string> = {
  Open: "bg-green-100 text-green-800",
  Closed: "bg-blue-100 text-blue-800",
}

export function SessionSummaryView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filtrar sesiones según término de búsqueda y estado
  const filteredSessions = posSessions.filter((session) => {
    const matchesSearch =
      session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.session_id.toString().includes(searchTerm)

    const matchesStatus = statusFilter === "all" || session.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por usuario o ID de sesión..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Open">Abierta</SelectItem>
              <SelectItem value="Closed">Cerrada</SelectItem>
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
              <TableHead>ID de sesión</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Hora de inicio</TableHead>
              <TableHead>Hora de cierre</TableHead>
              <TableHead>Apertura</TableHead>
              <TableHead>Cierre</TableHead>
              <TableHead>Variación</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <TableRow key={session.session_id}>
                  <TableCell className="font-medium">{session.session_id}</TableCell>
                  <TableCell>{session.user_name}</TableCell>
                  <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                  <TableCell>{session.end_time ? new Date(session.end_time).toLocaleString() : "-"}</TableCell>
                  <TableCell>S/ {session.opening_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {session.closing_amount !== null ? `S/ ${session.closing_amount.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell
                    className={
                      session.variance === null
                        ? ""
                        : session.variance < 0
                          ? "text-red-600"
                          : session.variance > 0
                            ? "text-amber-600"
                            : ""
                    }
                  >
                    {session.variance !== null ? `S/ ${session.variance.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[session.status] || "bg-gray-100 text-gray-800"}>
                      {session.status === "Open" ? "Abierta" : "Cerrada"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No se encontraron sesiones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
