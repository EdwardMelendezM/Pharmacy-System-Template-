/**
 * Página principal de inventario para MVP
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/modules/inventory/components/product-list"
import { Plus, ArrowUpDown, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { History, ArrowDownToLine, ArrowUpFromLine, Settings, ListFilter } from "lucide-react"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" />
                Historial de Movimientos
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Movimientos de Inventario</h4>
                  <p className="text-sm text-muted-foreground">Consulta el historial de transacciones de inventario</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-1 items-center gap-4">
                    <Link href="/inventory/movements?type=entry" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <ArrowDownToLine className="mr-2 h-4 w-4 text-green-500" />
                        Notas de Entrada
                      </Button>
                    </Link>
                    <Link href="/inventory/movements?type=exit" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <ArrowUpFromLine className="mr-2 h-4 w-4 text-red-500" />
                        Notas de Salida
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4 mt-2">
                    <Link href="/inventory/movements?type=adjustment" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4 text-amber-500" />
                        Ajustes
                      </Button>
                    </Link>
                    <Link href="/inventory/movements" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <ListFilter className="mr-2 h-4 w-4 text-blue-500" />
                        Ver Todos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Link href="/inventory/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Link>
          <Link href="/inventory/adjustment">
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Ajustar Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">5 productos añadidos este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos con Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />8
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,580.00</div>
            <p className="text-xs text-muted-foreground">Basado en precio de costo</p>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-2 w-full">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="low-stock">Stock Bajo</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <ProductList />
        </TabsContent>
        <TabsContent value="low-stock" className="mt-4">
          <ProductList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
