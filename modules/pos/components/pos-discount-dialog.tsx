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

interface POSDiscountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subtotal: number
  currentDiscount: number
  onApplyDiscount: (discount: number) => void
}

export function POSDiscountDialog({
  open,
  onOpenChange,
  subtotal,
  currentDiscount,
  onApplyDiscount,
}: POSDiscountDialogProps) {
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage")
  const [discountValue, setDiscountValue] = useState(
    discountType === "percentage" ? (currentDiscount / subtotal) * 100 : currentDiscount,
  )

  // Calcular el monto de descuento basado en el tipo y valor
  const calculateDiscount = () => {
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100
    } else {
      return discountValue
    }
  }

  // Manejar cambio de tipo de descuento
  const handleDiscountTypeChange = (value: "percentage" | "amount") => {
    if (value === "percentage") {
      // Convertir monto a porcentaje
      setDiscountValue(currentDiscount > 0 ? (currentDiscount / subtotal) * 100 : 0)
    } else {
      // Usar el monto actual
      setDiscountValue(currentDiscount)
    }
    setDiscountType(value)
  }

  // Manejar aplicación de descuento
  const handleApplyDiscount = () => {
    const calculatedDiscount = calculateDiscount()
    // Asegurar que el descuento no sea mayor que el subtotal
    const finalDiscount = Math.min(calculatedDiscount, subtotal)
    onApplyDiscount(finalDiscount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aplicar Descuento</DialogTitle>
          <DialogDescription>Seleccione el tipo de descuento y el valor a aplicar.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup
            value={discountType}
            onValueChange={(value) => handleDiscountTypeChange(value as "percentage" | "amount")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Porcentaje (%)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="amount" id="amount" />
              <Label htmlFor="amount">Monto fijo</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount-value" className="text-right col-span-1">
              {discountType === "percentage" ? "Porcentaje" : "Monto"}:
            </Label>
            <div className="col-span-3">
              <Input
                id="discount-value"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number.parseFloat(e.target.value) || 0)}
                min={0}
                max={discountType === "percentage" ? 100 : subtotal}
                step={discountType === "percentage" ? 1 : 0.01}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Subtotal:</Label>
            <div className="col-span-3">{formatCurrency(subtotal)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Descuento:</Label>
            <div className="col-span-3">{formatCurrency(calculateDiscount())}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1 font-medium">Total:</Label>
            <div className="col-span-3 font-medium">{formatCurrency(subtotal - calculateDiscount())}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleApplyDiscount}>Aplicar Descuento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
