"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingCart, RotateCcw } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { POSCheckoutDialog } from "./pos-checkout-dialog"
import type { POSOrderItem, PaymentMethod } from "@/lib/models/pos"
import { POSReturnDialog } from "./pos-return-dialog"
import { POSDiscountDialog } from "./pos-discount-dialog"

interface POSCartProps {
  items: POSOrderItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: (paymentMethod: PaymentMethod, customerInfo: { name?: string; phone?: string }, discount: number) => void
  onProcessReturn?: (orderNumber: string, reason: string) => void
  isProcessing?: boolean
  cashDrawerId: string | null
}

export function POSCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onProcessReturn,
  isProcessing = false,
  cashDrawerId,
}: POSCartProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isReturnOpen, setIsReturnOpen] = useState(false)
  const [isDiscountOpen, setIsDiscountOpen] = useState(false)
  const [discount, setDiscount] = useState(0)

  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)

  // Calcular total con descuento
  const total = subtotal - discount

  // Calcular impuesto (18% del total después del descuento)
  const tax = total * 0.18

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Carrito de Compra</span>
          <span className="text-sm font-normal text-muted-foreground">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </span>
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
            <p>El carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.unitPrice)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Disminuir</span>
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Aumentar</span>
                      </Button>
                    </div>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CardFooter className="flex-col px-0 pt-6">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              Descuento
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={() => setIsDiscountOpen(true)}
                disabled={items.length === 0}
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Agregar descuento</span>
              </Button>
            </span>
            <span>{formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>IGV (18%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(total + tax)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsReturnOpen(true)}
            disabled={!cashDrawerId || isProcessing}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Devolución
          </Button>
          <Button
            className="w-full"
            onClick={() => setIsCheckoutOpen(true)}
            disabled={items.length === 0 || !cashDrawerId || isProcessing}
          >
            {isProcessing ? (
              <>Procesando...</>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Checkout
              </>
            )}
          </Button>
        </div>
      </CardFooter>

      <POSCheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        total={total + tax}
        onCheckout={(paymentMethod, customerInfo) => {
          onCheckout(paymentMethod, customerInfo, discount)
          setIsCheckoutOpen(false)
        }}
        isProcessing={isProcessing}
      />

      <POSReturnDialog
        open={isReturnOpen}
        onOpenChange={setIsReturnOpen}
        onProcessReturn={(orderNumber, reason) => {
          if (onProcessReturn) {
            onProcessReturn(orderNumber, reason)
          }
          setIsReturnOpen(false)
        }}
        isProcessing={isProcessing}
      />

      <POSDiscountDialog
        open={isDiscountOpen}
        onOpenChange={setIsDiscountOpen}
        subtotal={subtotal}
        currentDiscount={discount}
        onApplyDiscount={(newDiscount) => {
          setDiscount(newDiscount)
          setIsDiscountOpen(false)
        }}
      />
    </div>
  )
}
