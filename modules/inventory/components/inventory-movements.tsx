/**
 * Movimientos de Inventario
 *
 * Este componente permite gestionar y visualizar los movimientos
 * de inventario, como entradas, salidas, transferencias y ajustes.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Settings,
} from "lucide-react"
import { WarehouseService } from "@/lib/services/warehouse-service"
import { type InventoryTransaction, InventoryTransactionType, type Warehouse } from "@/lib/models/inventory"

export function InventoryMovements({ initialFilter = "all" }: { initialFilter?: string }) {
  const router = useRouter()
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(initialFilter)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [dateRangeFilter, setDateRangeFilter] = useState("all")

  // Diálogos
  const [isNewMovementDialogOpen, setIsNewMovementDialogOpen] = useState(false)
  const [selectedMovementType, setSelectedMovementType] = useState<InventoryTransactionType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // En una implementación real, obtendríamos los datos del servidor
        // Aquí usamos datos de ejemplo
        const mockTransactions = [
          {
            id: "trans_1",
            transactionType: InventoryTransactionType.PURCHASE,
            referenceNumber: "PO-001",
            referenceId: "po_1",
            date: new Date("2023-01-20"),
            notes: "Recepción de compra de Paracetamol",
            createdBy: "user_1",
            createdAt: new Date("2023-01-20"),
            status: "completed",
            items: [],
          },
          {
            id: "trans_2",
            transactionType: InventoryTransactionType.SALE,
            referenceNumber: "INV-001",
            referenceId: "inv_1",
            date: new Date("2023-01-25"),
            notes: "Venta de Paracetamol",
            createdBy: "user_1",
            createdAt: new Date("2023-01-25"),
            status: "completed",
            items: [],
          },
          {
            id: "trans_3",
            transactionType: InventoryTransactionType.PURCHASE,
            referenceNumber: "PO-003",
            referenceId: "po_3",
            date: new Date("2023-02-25"),
            notes: "Recepción de compra de Ibuprofeno",
            createdBy: "user_1",
            createdAt: new Date("2023-02-25"),
            status: "completed",
            items: [],
          },
          {
            id: "trans_4",
            transactionType: InventoryTransactionType.TRANSFER,
            date: new Date("2023-02-10"),
            notes: "Transferencia de Paracetamol al almacén secundario",
            createdBy: "user_1",
            createdAt: new Date("2023-02-10"),
            status: "completed",
            items: [],
          },
          {
            id: "trans_5",
            transactionType: InventoryTransactionType.ADJUSTMENT,
            date: new Date("2023-03-05"),
            notes: "Ajuste de inventario por conteo físico",
            createdBy: "user_1",
            createdAt: new Date("2023-03-05"),
            status: "completed",
            items: [],
          },
        ] as InventoryTransaction[]

        setTransactions(mockTransactions)

        // Obtener almacenes
        const warehousesResponse = await WarehouseService.getWarehouses()
        setWarehouses(warehousesResponse)
      } catch (error) {
        console.error("Error fetching inventory movements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Actualizar la pestaña activa cuando cambia el filtro inicial
    if (initialFilter && initialFilter !== "all") {
      // Mapear los tipos de filtro de URL a los tipos de transacción
      const filterMap: Record<string, string> = {
        entry: InventoryTransactionType.PURCHASE,
        exit: InventoryTransactionType.SALE,
        adjustment: InventoryTransactionType.ADJUSTMENT,
        transfer: InventoryTransactionType.TRANSFER,
        return: InventoryTransactionType.RETURN_FROM_CUSTOMER,
      }

      const mappedFilter = filterMap[initialFilter] || "all"
      setActiveTab(mappedFilter)
    }
  }, [initialFilter])

  // Filtrar transacciones según los criterios seleccionados
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtrar por tipo de transacción (pestaña)
    if (activeTab !== "all" && transaction.transactionType !== activeTab) {
      return false
    }

    // Filtrar por término de búsqueda
    if (
      searchTerm &&
      !(
        transaction.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false
    }

    // Aquí se implementarían más filtros (almacén, fecha, etc.)

    return true
  })

  // Función para crear un nuevo movimiento
  const handleCreateMovement = (type: InventoryTransactionType) => {
    setSelectedMovementType(type)
    setIsNewMovementDialogOpen(true)
  }

  // Función para navegar a la página de detalle de movimiento
  const handleViewMovement = (transactionId: string) => {
    router.push(`/inventory/movements/${transactionId}`)
  }

  // Renderizar el tipo de movimiento
  const renderTransactionType = (type: InventoryTransactionType) => {
    switch (type) {
      case InventoryTransactionType.PURCHASE:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Entrada
          </Badge>
        )
      case InventoryTransactionType.SALE:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Salida
          </Badge>
        )
      case InventoryTransactionType.TRANSFER:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Transferencia
          </Badge>
        )
      case InventoryTransactionType.ADJUSTMENT:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Ajuste
          </Badge>
        )
      case InventoryTransactionType.RETURN_FROM_CUSTOMER:
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Devolución Cliente
          </Badge>
        )
      case InventoryTransactionType.RETURN_TO_SUPPLIER:
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Devolución Proveedor
          </Badge>
        )
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Movimientos de Inventario</h2>
        <div className="flex gap-2">
          <Dialog open={isNewMovementDialogOpen} onOpenChange={setIsNewMovementDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Movimiento</DialogTitle>
                <DialogDescription>Seleccione el tipo de movimiento que desea registrar.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => handleCreateMovement(InventoryTransactionType.PURCHASE)}
                >
                  <ArrowDownToLine className="h-8 w-8 mb-2" />
                  <span>Entrada</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => handleCreateMovement(InventoryTransactionType.SALE)}
                >
                  <ArrowUpFromLine className="h-8 w-8 mb-2" />
                  <span>Salida</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => handleCreateMovement(InventoryTransactionType.TRANSFER)}
                >
                  <ArrowLeftRight className="h-8 w-8 mb-2" />
                  <span>Transferencia</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => handleCreateMovement(InventoryTransactionType.ADJUSTMENT)}
                >
                  <Settings className="h-8 w-8 mb-2" />
                  <span>Ajuste</span>
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewMovementDialogOpen(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por referencia o descripción..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Almacén" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los almacenes</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el período</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="yesterday">Ayer</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Calendar className="h-4 w-4" />
                <span className="sr-only">Seleccionar fechas</span>
              </Button>

              <Button variant="outline" size="icon" className="h-9 w-9">
                <Download className="h-4 w-4" />
                <span className="sr-only">Exportar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas de tipos de movimientos */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 w-full h-full">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value={InventoryTransactionType.PURCHASE}>Entradas</TabsTrigger>
          <TabsTrigger value={InventoryTransactionType.SALE}>Salidas</TabsTrigger>
          <TabsTrigger value={InventoryTransactionType.TRANSFER}>Transferencias</TabsTrigger>
          <TabsTrigger value={InventoryTransactionType.ADJUSTMENT}>Ajustes</TabsTrigger>
          <TabsTrigger value={InventoryTransactionType.RETURN_FROM_CUSTOMER}>Devoluciones</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-10">
          {/* Tabla de movimientos */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Referencia</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="min-w-[300px]">Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Cargando movimientos...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron movimientos con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.referenceNumber || "-"}</TableCell>
                      <TableCell>{renderTransactionType(transaction.transactionType)}</TableCell>
                      <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                          {transaction.status === "completed" ? "Completado" : transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewMovement(transaction.id)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
