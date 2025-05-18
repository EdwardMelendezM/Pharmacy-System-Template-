"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Loader2, ArrowLeft, ShoppingCart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionSummaryView } from "@/modules/pos/components/session-summary-view"
import { OrdersSummaryView } from "@/modules/pos/components/orders-summary-view"
import { DailyClosureView } from "@/modules/pos/components/daily-closure-view"
import Link from "next/link"
import { POSProductCard } from "@/modules/pos/components/pos-product-card"
import { POSCart } from "@/modules/pos/components/pos-cart"
import { POSReceipt } from "@/modules/pos/components/pos-receipt"
import type { POSOrderItem, PaymentMethod, Product, POSOrder } from "@/lib/models/pos"
import { createOrder, getAllProducts, searchProducts } from "@/lib/actions/pos-actions"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCashDrawer } from "@/lib/context/cash-drawer-context"

export default function POSPage() {
  const { cashDrawer, isLoading: isLoadingCashDrawer, refreshCashDrawer } = useCashDrawer()

  const [activeTab, setActiveTab] = useState("pos")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<POSOrderItem[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [lastCompletedOrder, setLastCompletedOrder] = useState<POSOrder | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [isFullScreenPOS, setIsFullScreenPOS] = useState(false)

  // Obtener productos
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoadingProducts(true)
        // Obtener todos los productos
        const productsResult = await getAllProducts()
        if (productsResult.success) {
          setProducts(productsResult.data)
          setFilteredProducts(productsResult.data)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Hubo un error al cargar los productos.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // Activar modo pantalla completa cuando hay una caja abierta
  useEffect(() => {
    if (cashDrawer) {
      setIsFullScreenPOS(true)
    }
  }, [cashDrawer])

  // Manejar búsqueda
  useEffect(() => {
    async function handleSearch() {
      if (searchTerm.length < 2) {
        setFilteredProducts(products)
        return
      }

      try {
        const result = await searchProducts(searchTerm)
        if (result.success) {
          setFilteredProducts(result.data)
        }
      } catch (error) {
        console.error("Error searching products:", error)
      }
    }

    handleSearch()
  }, [searchTerm, products])

  // Manejar agregar producto al carrito
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex((item) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // Actualizar cantidad del elemento existente
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          total: (existingItem.quantity + 1) * existingItem.unitPrice,
        }

        return updatedItems
      } else {
        // Agregar nuevo elemento al carrito
        return [
          ...prevItems,
          {
            id: `${product.id}-${Date.now()}`, // Generar un ID único para el elemento
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.price,
            discount: 0,
            total: product.price,
          },
        ]
      }
    })
  }

  // Manejar actualización de cantidad
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice } : item,
      ),
    )
  }

  // Manejar eliminar elemento del carrito
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  // Manejar checkout
  const handleCheckout = async (
    paymentMethod: PaymentMethod,
    customerInfo: { name?: string; phone?: string },
    discount = 0,
  ) => {
    if (!cashDrawer) {
      toast({
        title: "Error",
        description: "No hay una caja abierta. Por favor, abre una caja primero.",
        variant: "destructive",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "No hay productos en el carrito.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingOrder(true)

    try {
      const result = await createOrder({
        cashDrawerId: cashDrawer.id,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        discount,
      })

      if (result.success) {
        toast({
          title: "Venta completada",
          description: `Orden #${result?.data?.orderNumber} procesada exitosamente.`,
        })

        // Guardar la orden completada para el recibo
        setLastCompletedOrder(result.data)

        // Mostrar el recibo
        setIsReceiptOpen(true)

        // Limpiar carrito
        setCartItems([])

        // Actualizar productos para actualizar stock
        const productsResult = await getAllProducts()
        if (productsResult.success) {
          setProducts(productsResult.data)
          setFilteredProducts(productsResult.data)
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Hubo un error al procesar la venta.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Error",
        description: "Hubo un error al procesar la venta.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  // Manejar procesamiento de devoluciones
  const handleProcessReturn = async (orderNumber: string, reason: string) => {
    setIsProcessingOrder(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Devolución procesada",
        description: `La devolución para la orden ${orderNumber} ha sido procesada exitosamente.`,
      })
    } catch (error) {
      console.error("Error processing return:", error)
      toast({
        title: "Error",
        description: "Hubo un error al procesar la devolución.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  // Renderizar pantalla de carga
  if (isLoadingCashDrawer || isLoadingProducts) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Renderizar pantalla de apertura de caja si no hay caja abierta
  if (!cashDrawer) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Punto de Venta</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <Alert>
                <AlertTitle>No hay caja abierta</AlertTitle>
                <AlertDescription>Debes abrir una caja antes de poder realizar ventas.</AlertDescription>
              </Alert>
              <div className="mt-4 flex justify-center">
                <Link href="/pos/open-drawer">
                  <Button>Abrir Caja</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Renderizar interfaz de POS en pantalla completa
  if (isFullScreenPOS) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsFullScreenPOS(false)} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Punto de Venta</h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
              Caja Abierta
            </Badge>
          </div>
          <div className="flex gap-2">
            <Link href="/pos/end-shift">
              <Button variant="outline">Cerrar Caja</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 gap-6">
          <div className="w-2/3 flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-auto flex-1 pb-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <POSProductCard key={product.id} product={product} onSelect={handleAddToCart} />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                  No se encontraron productos
                </div>
              )}
            </div>
          </div>

          <div className="w-1/3">
            <Card className="h-full flex flex-col">
              <CardContent className="flex-1 flex flex-col p-4">
                <POSCart
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                  onProcessReturn={handleProcessReturn}
                  isProcessing={isProcessingOrder}
                  cashDrawerId={cashDrawer?.id || null}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Componente de recibo */}
        <POSReceipt order={lastCompletedOrder} open={isReceiptOpen} onOpenChange={setIsReceiptOpen} />
      </div>
    )
  }

  // Renderizar interfaz normal con pestañas
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Punto de Venta</h1>
        <div className="flex gap-2">
          <Button variant="default" className="flex items-center gap-2" onClick={() => setIsFullScreenPOS(true)}>
            <ShoppingCart className="h-4 w-4" />
            Modo Venta
          </Button>
          <Link href="/pos/end-shift">
            <Button variant="outline">Cerrar Caja</Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="pos">Resumen</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="daily-closure">Cierre Diario</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="flex-1 flex flex-col mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Información de la Caja</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cajero:</span>
                      <span className="font-medium">{cashDrawer.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Caja:</span>
                      <span className="font-medium">{cashDrawer.registerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto inicial:</span>
                      <span className="font-medium">${cashDrawer.openingAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Abierta desde:</span>
                      <span className="font-medium">{new Date(cashDrawer.openedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 justify-center items-center">
                  <Button size="lg" className="w-full flex items-center gap-2" onClick={() => setIsFullScreenPOS(true)}>
                    <ShoppingCart className="h-5 w-5" />
                    Iniciar Venta
                  </Button>
                  <Link href="/pos/end-shift" className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      Cerrar Caja
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Ventas Recientes</h3>
            <OrdersSummaryView />
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <SessionSummaryView />
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <OrdersSummaryView />
        </TabsContent>

        <TabsContent value="daily-closure" className="mt-4">
          <DailyClosureView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
