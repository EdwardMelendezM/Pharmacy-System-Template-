"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { openCashDrawer } from "@/lib/actions/pos-actions"
import { useCashDrawer } from "@/lib/context/cash-drawer-context"

export function OpenDrawerForm() {
  const router = useRouter()
  const { refreshCashDrawer } = useCashDrawer()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    userId: "john.doe",
    userName: "John Doe",
    registerName: "Caja Principal",
    openingAmount: 0,
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "openingAmount" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await openCashDrawer(formData)

      if (result.success) {
        toast({
          title: "Caja abierta",
          description: "La caja ha sido abierta exitosamente.",
        })

        // Actualizar el contexto de la caja
        await refreshCashDrawer()

        // Redirigir al POS
        router.push("/pos")
      } else {
        toast({
          title: "Error",
          description: result.message || "Hubo un error al abrir la caja.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error opening cash drawer:", error)
      toast({
        title: "Error",
        description: "Hubo un error al abrir la caja.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Abrir Caja</CardTitle>
        <CardDescription>Completa la información para abrir una nueva caja.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Cajero</Label>
            <Select value={formData.userName} onValueChange={(value) => handleSelectChange("userName", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cajero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                <SelectItem value="Robert Johnson">Robert Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registerName">Caja</Label>
            <Select value={formData.registerName} onValueChange={(value) => handleSelectChange("registerName", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar caja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Caja Principal">Caja Principal</SelectItem>
                <SelectItem value="Caja Secundaria">Caja Secundaria</SelectItem>
                <SelectItem value="Caja Rápida">Caja Rápida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingAmount">Monto Inicial ($)</Label>
            <Input
              id="openingAmount"
              name="openingAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.openingAmount}
              onChange={handleChange}
              required
            />
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Abriendo..." : "Abrir Caja"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
