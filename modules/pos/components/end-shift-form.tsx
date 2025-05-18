"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { closeCashDrawer, getOrdersByCashDrawer } from "@/lib/actions/pos-actions"
import { Loader2 } from "lucide-react"
import { useCashDrawer } from "@/lib/context/cash-drawer-context"

export function EndShiftForm() {
  const router = useRouter()
  const { cashDrawer, refreshCashDrawer } = useCashDrawer()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    cashSales: 0,
    cardSales: 0,
    otherSales: 0,
    expectedCash: 0,
  })

  const [formData, setFormData] = useState({
    closingAmount: 0,
    notes: "",
  })

  useEffect(() => {
    async function fetchOrderSummary() {
      if (!cashDrawer) {
        router.push("/pos")
        return
      }

      try {
        setIsLoadingOrders(true)
        const result = await getOrdersByCashDrawer(cashDrawer.id)

        if (result.success) {
          const orders = result.data
          const totalOrders = orders.length
          const totalSales = orders.reduce((sum, order) => sum + order.total, 0)

          const cashSales = orders
            .filter((order) => order.paymentMethod === "cash")
            .reduce((sum, order) => sum + order.total, 0)

          const cardSales = orders
            .filter((order) => order.paymentMethod === "card")
            .reduce((sum, order) => sum + order.total, 0)

          const otherSales = orders
            .filter((order) => !["cash", "card"].includes(order.paymentMethod))
            .reduce((sum, order) => sum + order.total, 0)

          const expectedCash = cashDrawer.openingAmount + cashSales

          setSummary({
            totalOrders,
            totalSales,
            cashSales,
            cardSales,
            otherSales,
            expectedCash,
          })

          setFormData((prev) => ({
            ...prev,
            closingAmount: expectedCash,
          }))
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Hubo un error al cargar el resumen de ventas.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOrders(false)
      }
    }

    fetchOrderSummary()
  }, [cashDrawer, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "closingAmount" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cashDrawer) {
      toast({
        title: "Error",
        description: "No hay una caja abierta para cerrar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await closeCashDrawer({
        cashDrawerId: cashDrawer.id,
        closingAmount: formData.closingAmount,
        notes: formData.notes,
      })

      if (result.success) {
        toast({
          title: "Caja cerrada",
          description: "La caja ha sido cerrada exitosamente.",
        })

        // Actualizar el contexto de la caja
        await refreshCashDrawer()

        // Redirigir al POS
        router.push("/pos")
      } else {
        toast({
          title: "Error",
          description: result.message || "Hubo un error al cerrar la caja.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error closing cash drawer:", error)
      toast({
        title: "Error",
        description: "Hubo un error al cerrar la caja.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cashDrawer) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <p>No hay una caja abierta para cerrar.</p>
            <Button className="mt-4" onClick={() => router.push("/pos")}>
              Volver al POS
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cerrar Caja</CardTitle>
        <CardDescription>Completa la información para cerrar la caja actual.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isLoadingOrders ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="bg-muted/50 p-4 rounded-md space-y-2">
                <h3 className="font-medium">Resumen de Ventas</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Total de órdenes:</div>
                  <div className="text-right font-medium">{summary.totalOrders}</div>

                  <div className="text-muted-foreground">Ventas totales:</div>
                  <div className="text-right font-medium">${summary.totalSales.toFixed(2)}</div>

                  <div className="text-muted-foreground">Ventas en efectivo:</div>
                  <div className="text-right font-medium">${summary.cashSales.toFixed(2)}</div>

                  <div className="text-muted-foreground">Ventas con tarjeta:</div>
                  <div className="text-right font-medium">${summary.cardSales.toFixed(2)}</div>

                  <div className="text-muted-foreground">Otras ventas:</div>
                  <div className="text-right font-medium">${summary.otherSales.toFixed(2)}</div>

                  <div className="text-muted-foreground">Monto inicial:</div>
                  <div className="text-right font-medium">${cashDrawer.openingAmount.toFixed(2)}</div>

                  <div className="text-muted-foreground font-medium">Efectivo esperado:</div>
                  <div className="text-right font-medium">${summary.expectedCash.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingAmount">Monto Final ($)</Label>
                <Input
                  id="closingAmount"
                  name="closingAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.closingAmount}
                  onChange={handleChange}
                  required
                />
                {formData.closingAmount !== summary.expectedCash && (
                  <p
                    className={`text-sm ${formData.closingAmount > summary.expectedCash ? "text-green-600" : "text-red-600"}`}
                  >
                    {formData.closingAmount > summary.expectedCash
                      ? `Sobrante: $${(formData.closingAmount - summary.expectedCash).toFixed(2)}`
                      : `Faltante: $${(summary.expectedCash - formData.closingAmount).toFixed(2)}`}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Agregar notas adicionales..."
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoadingOrders}>
            {isSubmitting ? "Cerrando..." : "Cerrar Caja"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
