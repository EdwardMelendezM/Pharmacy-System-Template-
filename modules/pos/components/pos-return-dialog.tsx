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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface POSReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProcessReturn: (orderNumber: string, reason: string) => void
  isProcessing?: boolean
}

export function POSReturnDialog({ open, onOpenChange, onProcessReturn, isProcessing = false }: POSReturnDialogProps) {
  const [orderNumber, setOrderNumber] = useState("")
  const [reason, setReason] = useState("")

  // Manejar procesamiento de devolución
  const handleProcessReturn = () => {
    if (!orderNumber.trim()) return
    onProcessReturn(orderNumber.trim(), reason.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !isProcessing && onOpenChange(value)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Procesar Devolución</DialogTitle>
          <DialogDescription>Ingrese el número de orden y el motivo de la devolución.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order-number" className="text-right">
              Orden #:
            </Label>
            <Input
              id="order-number"
              placeholder="Número de orden"
              className="col-span-3"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="return-reason" className="text-right">
              Motivo:
            </Label>
            <Textarea
              id="return-reason"
              placeholder="Motivo de la devolución"
              className="col-span-3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleProcessReturn} disabled={isProcessing || !orderNumber.trim()}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>Procesar Devolución</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
