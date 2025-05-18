/**
 * Dashboard de Inventario
 *
 * Este componente muestra un resumen del estado del inventario,
 * incluyendo KPIs, alertas y gráficos.
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, BarChart3, Calendar, Clock, DollarSign, Download, Package, Truck } from "lucide-react"
import { ProductService } from "@/lib/services/inventory-service"
import type { Product } from "@/lib/models/inventory"

// Componente para mostrar un KPI
interface KPICardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

const KPICard = ({ title, value, description, icon, trend }: KPICardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {trend && (
        <div className={`flex items-center text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </CardContent>
  </Card>
)

// Componente para mostrar alertas de inventario
interface InventoryAlertProps {
  title: string
  description: string
  type: "warning" | "error" | "info"
  action?: {
    label: string
    onClick: () => void
  }
}

const InventoryAlert = ({ title, description, type, action }: InventoryAlertProps) => (
  <Alert variant={type === "error" ? "destructive" : "default"} className="mb-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription className="flex items-center justify-between">
      <span>{description}</span>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="ml-2">
          {action.label}
        </Button>
      )}
    </AlertDescription>
  </Alert>
)

export function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los productos
        const productsResponse = await ProductService.getProducts()
        setProducts(productsResponse.data)

        // Obtener productos con stock bajo
        const lowStockResponse = await ProductService.getProducts({ minStock: true })
        setLowStockProducts(lowStockResponse.data)
      } catch (error) {
        console.error("Error fetching inventory data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcular KPIs
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "active").length
  const lowStockCount = lowStockProducts.length
  const outOfStockCount = lowStockProducts.filter((p) => {
    // Simulación: un producto está agotado si su stock disponible es 0
    return p.minStockLevel === 0
  }).length

  // Calcular valor de inventario (simulado)
  const inventoryValue = products.reduce((sum, product) => {
    return sum + product.costPrice * (product.minStockLevel || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end w-full">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Filtrar por fecha</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only">Descargar reporte</span>
          </Button>
        </div>
      </div>

      {/* Alertas de inventario */}
      {lowStockCount > 0 && (
        <InventoryAlert
          title="Productos con stock bajo"
          description={`Hay ${lowStockCount} productos por debajo del punto de reorden.`}
          type="warning"
          action={{
            label: "Ver detalles",
            onClick: () => {
              /* Navegar a la vista de productos con stock bajo */
            },
          }}
        />
      )}

      {outOfStockCount > 0 && (
        <InventoryAlert
          title="Productos agotados"
          description={`Hay ${outOfStockCount} productos sin stock disponible.`}
          type="error"
          action={{
            label: "Generar orden",
            onClick: () => {
              /* Navegar a la creación de órdenes de compra */
            },
          }}
        />
      )}

      {/* KPIs de inventario */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Productos"
          value={totalProducts}
          description={`${activeProducts} productos activos`}
          icon={<Package />}
        />
        <KPICard
          title="Productos con Stock Bajo"
          value={lowStockCount}
          description="Requieren reabastecimiento"
          icon={<AlertTriangle />}
        />
        <KPICard
          title="Valor de Inventario"
          value={`$${inventoryValue.toFixed(2)}`}
          description="Basado en costo promedio"
          icon={<DollarSign />}
          trend={{ value: 3.2, isPositive: true }}
        />
        <KPICard title="Órdenes Pendientes" value="5" description="2 con retraso" icon={<Truck />} />
      </div>

      {/* Pestañas de información */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="movements">Movimientos Recientes</TabsTrigger>
          <TabsTrigger value="expiry">Próximos a Vencer</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
                <CardDescription>Cantidad de productos por categoría</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Basado en los últimos 30 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="w-[30px] text-center text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 100)}
                      </div>
                      <div className="ml-2 flex-1 truncate">{product.name}</div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 1000)} unidades
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Recepciones</CardTitle>
                <CardDescription>Órdenes de compra pendientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">PO-2023-056</div>
                      <div className="text-xs text-muted-foreground">PharmaCorp Inc.</div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Mañana</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">PO-2023-057</div>
                      <div className="text-xs text-muted-foreground">MediSupply Co.</div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>3 días</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">PO-2023-058</div>
                      <div className="text-xs text-muted-foreground">Global Pharmaceuticals</div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>1 semana</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes de Inventario</CardTitle>
              <CardDescription>Últimas transacciones registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Entrada
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Recepción de Paracetamol 500mg</div>
                    <div className="text-xs text-muted-foreground">
                      300 unidades • Almacén Principal • Hoy, 10:30 AM
                    </div>
                  </div>
                  <div className="text-sm font-medium">PO-2023-056</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Salida
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Venta de Ibuprofeno 400mg</div>
                    <div className="text-xs text-muted-foreground">50 unidades • Almacén Principal • Ayer, 3:45 PM</div>
                  </div>
                  <div className="text-sm font-medium">INV-2023-123</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Transferencia
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Transferencia de Vitamina C 1000mg</div>
                    <div className="text-xs text-muted-foreground">
                      100 unidades • Principal → Secundario • Ayer, 11:20 AM
                    </div>
                  </div>
                  <div className="text-sm font-medium">TRF-2023-015</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Ajuste
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Ajuste de inventario de Omeprazol 20mg</div>
                    <div className="text-xs text-muted-foreground">
                      -5 unidades • Almacén Principal • 2 días atrás, 9:15 AM
                    </div>
                  </div>
                  <div className="text-sm font-medium">ADJ-2023-008</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos Próximos a Vencer</CardTitle>
              <CardDescription>Lotes que vencerán en los próximos 90 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      15 días
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Omeprazol 20mg</div>
                    <div className="text-xs text-muted-foreground">
                      Lote: LOT-O-001 • 80 unidades • Almacén Principal
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      30 días
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Loratadina 10mg</div>
                    <div className="text-xs text-muted-foreground">
                      Lote: LOT-L-002 • 45 unidades • Almacén Secundario
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      45 días
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Vitamina C 1000mg</div>
                    <div className="text-xs text-muted-foreground">
                      Lote: LOT-V-003 • 60 unidades • Almacén Principal
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Inventario</CardTitle>
              <CardDescription>Métricas y tendencias clave</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-16 w-16" />
                  <p className="mt-2">Gráficos de análisis de inventario</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
