"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import type { PaymentMethod } from "@/lib/models/pos"

interface POSCheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subtotal: number
  discount: number
  tax: number
  total: number
  onCheckout: (paymentMethod: PaymentMethod, customerInfo: { name?: string; phone?: string }) => void
  isProcessing?: boolean
}

export function POSCheckoutDialog({
  open,
  onOpenChange,
  subtotal,
  discount,
  tax,
  total,
  onCheckout,
  isProcessing = false,
}: POSCheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [cashAmount, setCashAmount] = useState(total.toFixed(2))

  // Calcular cambio
  const change = Math.max(Number.parseFloat(cashAmount) - total, 0)

  // Manejar checkout
  const handleCheckout = () => {
    onCheckout(paymentMethod, {
      name: customerName.trim() || undefined,
      phone: customerPhone.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !isProcessing && onOpenChange(value)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Venta</DialogTitle>
          <DialogDescription>Complete los detalles para finalizar la venta.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-name" className="text-right">
              Cliente:
            </Label>
            <Input
              id="customer-name"
              placeholder="Nombre del cliente (opcional)"
              className="col-span-3"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-phone" className="text-right">
              Teléfono:
            </Label>
            <Input
              id="customer-phone"
              placeholder="Teléfono (opcional)"
              className="col-span-3"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Método:</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Efectivo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Tarjeta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer">Transferencia</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "cash" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cash-amount" className="text-right">
                  Monto:
                </Label>
                <Input
                  id="cash-amount"
                  type="number"
                  min={total}
                  step="0.01"
                  className="col-span-3"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Cambio:</Label>
                <div className="col-span-3 font-medium">{formatCurrency(change)}</div>
              </div>
            </>
          )}

          <div className="my-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Descuento:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>IGV (18%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-medium mt-1">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>Completar Venta</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
