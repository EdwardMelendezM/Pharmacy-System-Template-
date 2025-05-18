/**
 * Componente de Detalle de Movimiento de Inventario
 *
 * Este componente muestra el detalle completo de un movimiento de inventario,
 * incluyendo información de cabecera, líneas de productos, y acciones relacionadas.
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Printer,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building,
  Package,
  AlertCircle,
} from "lucide-react"
import { type InventoryTransaction, InventoryTransactionType } from "@/lib/models/inventory"

interface MovementDetailProps {
  transactionId: string
}

export function MovementDetail({ transactionId }: MovementDetailProps) {
  const router = useRouter()
  const [transaction, setTransaction] = useState<InventoryTransaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!transactionId) {
        setError("ID de transacción no proporcionado")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // En una implementación real, obtendríamos los datos del servidor
        // Simulamos una llamada asíncrona
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Aquí usamos datos de ejemplo
        const mockTransaction: InventoryTransaction = {
          id: transactionId,
          transactionType: InventoryTransactionType.PURCHASE,
          referenceNumber: "PO-2023-056",
          referenceId: "po_1",
          date: new Date("2023-05-15"),
          notes: "Recepción de compra de medicamentos varios",
          createdBy: "Juan Pérez",
          createdAt: new Date("2023-05-15T10:30:00"),
          status: "completed",
          items: [
            {
              id: "item_1",
              productId: "prod_1",
              productName: "Paracetamol 500mg",
              quantity: 500,
              unitCost: 0.15,
              lotNumber: "LOT-2023-A001",
              expiryDate: new Date("2025-05-15"),
              locationId: "loc_1",
              locationName: "Almacén Principal",
              transactionId: transactionId,
              warehouseId: "wh_1",
            },
            {
              id: "item_2",
              productId: "prod_2",
              productName: "Ibuprofeno 400mg",
              quantity: 300,
              unitCost: 0.25,
              lotNumber: "LOT-2023-B002",
              expiryDate: new Date("2025-03-10"),
              locationId: "loc_1",
              locationName: "Almacén Principal",
              transactionId: transactionId,
              warehouseId: "wh_1",
            },
            {
              id: "item_3",
              productId: "prod_3",
              productName: "Amoxicilina 500mg",
              quantity: 200,
              unitCost: 0.35,
              lotNumber: "LOT-2023-C003",
              expiryDate: new Date("2024-12-20"),
              locationId: "loc_1",
              locationName: "Almacén Principal",
              transactionId: transactionId,
              warehouseId: "wh_1",
            },
          ],
          supplier: {
            name: "Farmacia Central",
            contactPerson: "Ana Gómez",
            phone: "555-1234",
          },
        }

        setTransaction(mockTransaction)
      } catch (error) {
        console.error("Error fetching transaction details:", error)
        setError("Error al cargar los detalles de la transacción")
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles del movimiento",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionDetail()
  }, [transactionId])

  // Función para renderizar el tipo de transacción
  const renderTransactionType = (type: InventoryTransactionType) => {
    const typeConfig = {
      [InventoryTransactionType.PURCHASE]: {
        label: "Entrada",
        className: "bg-green-100 text-green-800",
      },
      [InventoryTransactionType.SALE]: {
        label: "Salida",
        className: "bg-red-100 text-red-800",
      },
      [InventoryTransactionType.TRANSFER]: {
        label: "Transferencia",
        className: "bg-blue-100 text-blue-800",
      },
      [InventoryTransactionType.ADJUSTMENT]: {
        label: "Ajuste",
        className: "bg-yellow-100 text-yellow-800",
      },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || { label: "Otro", className: "" }

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  // Calcular el total del movimiento
  const calculateTotal = () => {
    if (!transaction?.items) return 0

    return transaction.items.reduce((sum, item) => {
      return sum + item.quantity * (item.unitCost || 0)
    }, 0)
  }

  // Renderizar el estado de la transacción
  const renderTransactionStatus = (status: string) => {
    const statusConfig = {
      completed: {
        label: "Completado",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      pending: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    } as const

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "",
      icon: AlertCircle,
    }

    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  // Renderizar skeleton durante la carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar mensaje de error
  if (error || !transaction) {
    return (
      <div className="text-center py-10">
        <XCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">{error || "Movimiento no encontrado"}</h3>
        <p className="text-muted-foreground mt-2">No se pudo encontrar el movimiento solicitado.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/inventory/movements")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/inventory/movements")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Detalle de Movimiento: {transaction.referenceNumber}</h2>
          {renderTransactionType(transaction.transactionType)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Imprimiendo",
                description: "Enviando documento a la impresora...",
              })
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Exportando",
                description: "Generando archivo de exportación...",
              })
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Información de cabecera */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Detalles del documento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Referencia
                </p>
                <p className="text-lg font-medium">{transaction.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Fecha
                </p>
                <p className="text-lg font-medium">{transaction.date.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Creado por
                </p>
                <p>{transaction.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Estado
                </p>
                {renderTransactionStatus(transaction.status)}
              </div>
            </div>
            {transaction.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notas</p>
                <p className="text-sm mt-1">{transaction.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {transaction.transactionType === InventoryTransactionType.PURCHASE && transaction.supplier && (
          <Card>
            <CardHeader>
              <CardTitle>Información del Proveedor</CardTitle>
              <CardDescription>Detalles del proveedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Proveedor
                </p>
                <p className="text-lg font-medium">{transaction.supplier.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contacto</p>
                  <p>{transaction.supplier.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p>{transaction.supplier.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{transaction.supplier.email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detalle de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Productos</CardTitle>
          <CardDescription>Productos incluidos en este movimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Costo Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                        {item.productName}
                      </div>
                    </TableCell>
                    <TableCell>{item.lotNumber || "-"}</TableCell>
                    <TableCell>{item.expiryDate ? item.expiryDate.toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.unitCost ? `$${item.unitCost.toFixed(2)}` : "-"}</TableCell>
                    <TableCell className="text-right">
                      {item.unitCost ? `$${(item.quantity * item.unitCost).toFixed(2)}` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div></div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Total Productos:</span>
                <span>{transaction.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Unidades:</span>
                <span>{transaction.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
