"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { POSOrder } from "@/lib/models/pos"
import { formatCurrency } from "@/lib/utils"
import { Printer, Share2, Download } from "lucide-react"
import { useRef } from "react"
// import { useReactToPrint } from "react-to-print"

interface POSReceiptProps {
  order: POSOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function POSReceipt({ order, open, onOpenChange }: POSReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  // const handlePrint = useReactToPrint({
  //   content: () => receiptRef.current,
  //   documentTitle: `Recibo-${order?.orderNumber || ""}`,
  // })

  const handleDownload = () => {
    // En una implementación real, esto generaría un PDF
    const receiptContent = receiptRef.current?.innerText || ""
    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Recibo-${order?.orderNumber || ""}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!order) return null

  const date = new Date(order.createdAt)
  const formattedDate = date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recibo de Venta</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end space-x-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>

        <div
          ref={receiptRef}
          className="bg-white p-6 rounded-lg border border-border"
          style={{ minHeight: "300px", width: "100%" }}
        >
          <div className="text-center mb-6">
            <h2 className="font-bold text-xl">FARMACIA SISTEMA</h2>
            <p className="text-sm text-muted-foreground">Av. Principal 123, Lima</p>
            <p className="text-sm text-muted-foreground">RUC: 20123456789</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Recibo:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fecha:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Hora:</span>
              <span>{formattedTime}</span>
            </div>
            {order.customerName && (
              <div className="flex justify-between text-sm">
                <span>Cliente:</span>
                <span>{order.customerName}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Cajero:</span>
              <span>{order.cashDrawerId || "Administrador"}</span>
            </div>
          </div>

          <div className="border-t border-b py-2 mb-4">
            <div className="grid grid-cols-12 text-sm font-medium mb-2">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-right">Cant.</div>
              <div className="col-span-2 text-right">Precio</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {order.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 text-sm py-1">
                <div className="col-span-6 truncate">{item.productName}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">{formatCurrency(item.unitPrice)}</div>
                <div className="col-span-2 text-right">{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Descuento:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>IGV (18%):</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="mb-4 text-sm">
            <div className="flex justify-between">
              <span>Método de pago:</span>
              <span>
                {order.paymentMethod === "cash" ? "Efectivo" : order.paymentMethod === "card" ? "Tarjeta" : "Otro"}
              </span>
            </div>
          </div>

          <div className="text-center text-sm mt-6">
            <p>¡Gracias por su compra!</p>
            <p className="text-xs text-muted-foreground mt-1">www.farmaciasistema.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
