/**
 * Componente de detalle de producto para MVP
 */
"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ProductService, MovementService } from "@/lib/services/inventory-service"
import type { Product, InventoryMovement } from "@/lib/models/inventory"

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Cargar datos del producto
        const productData = await ProductService.getProductById(productId)
        setProduct(productData)

        if (productData) {
          // Cargar movimientos del producto
          const movementsData = await MovementService.getProductMovements(productId)
          setMovements(movementsData)
        }
      } catch (error) {
        console.error("Error al cargar detalles del producto:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [productId])

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Cargando detalles del producto...</div>
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold mb-2">Producto no encontrado</h2>
        <p className="text-muted-foreground mb-4">El producto que estás buscando no existe o ha sido eliminado.</p>
        <Link href="/inventory">
          <Button>Volver al Inventario</Button>
        </Link>
      </div>
    )
  }

  // Verificar si hay stock bajo
  const hasLowStock = product.stock <= product.minStock

  // Verificar si hay fecha de caducidad próxima
  const hasNearExpiry =
    product.expiryDate && new Date(product.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/inventory">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{product.name}</h1>
        </div>
        <Link href={`/inventory/products/${productId}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Alertas */}
      {(hasLowStock || hasNearExpiry) && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Alertas</h3>
              <div className="mt-1">
                {hasLowStock && (
                  <p className="text-sm text-amber-700">
                    Stock bajo: {product.stock} unidades (mínimo: {product.minStock})
                  </p>
                )}
                {hasNearExpiry && (
                  <p className="text-sm text-amber-700">
                    Producto próximo a caducar: {new Date(product.expiryDate!).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SKU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.sku}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.stock}</div>
            <p className="text-xs text-muted-foreground">Mínimo: {product.minStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Precio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${product.sellingPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Costo: ${product.costPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas de información */}
      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Descripción</h4>
                <p className="text-sm">{product.description || "Sin descripción"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Categoría</h4>
                <p className="text-sm">{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Requiere Receta</h4>
                <p className="text-sm">{product.requiresPrescription ? "Sí" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Estado</h4>
                <Badge
                  variant="outline"
                  className={product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {product.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              {product.expiryDate && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Fecha de Caducidad</h4>
                  <p className="text-sm">{new Date(product.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              {movements.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay movimientos registrados para este producto.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead>Usuario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                movement.type === "purchase"
                                  ? "bg-green-100 text-green-800"
                                  : movement.type === "sale"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {movement.type === "purchase" ? "Compra" : movement.type === "sale" ? "Venta" : "Ajuste"}
                            </Badge>
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.notes || "-"}</TableCell>
                          <TableCell>{movement.createdBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
