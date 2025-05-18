"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"

// Esquema de validación para el formulario de factura
const invoiceFormSchema = z
  .object({
    invoiceNumber: z.string().min(1, {
      message: "El número de factura es obligatorio.",
    }),
    date: z.date({
      required_error: "La fecha de la factura es obligatoria.",
    }),
    dueDate: z.date({
      required_error: "La fecha de vencimiento es obligatoria.",
    }),
    customer: z.string({
      required_error: "El cliente es obligatorio.",
    }),
    currency: z.string({
      required_error: "La moneda es obligatoria.",
    }),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          product: z.string({
            required_error: "El producto es obligatorio.",
          }),
          description: z.string().optional(),
          quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "La cantidad debe ser un número positivo.",
          }),
          unitPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "El precio unitario debe ser un número válido.",
          }),
          tax: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "El impuesto debe ser un número válido.",
          }),
        }),
      )
      .min(1, {
        message: "Se requiere al menos un producto.",
      }),
  })
  .refine((data) => data.dueDate >= data.date, {
    message: "La fecha de vencimiento debe ser posterior a la fecha de la factura",
    path: ["dueDate"],
  })

// Datos simulados para clientes y productos
const customers = [
  { id: 1, name: "Hospital San Juan" },
  { id: 2, name: "Clínica Santa María" },
  { id: 3, name: "Farmacia Universal" },
  { id: 4, name: "Hospital Nacional" },
  { id: 5, name: "Clínica Internacional" },
]

const products = [
  { id: "MED001", name: "Paracetamol 500mg", price: 5.0 },
  { id: "MED002", name: "Ibuprofeno 400mg", price: 8.0 },
  { id: "MED003", name: "Amoxicilina 500mg", price: 12.0 },
  { id: "MED004", name: "Loratadina 10mg", price: 6.5 },
  { id: "MED005", name: "Omeprazol 20mg", price: 9.75 },
]

export function CreateInvoiceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `F001-${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`,
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 días desde hoy
      currency: "PEN",
      notes: "",
      items: [{ product: "", description: "", quantity: "1", unitPrice: "0", tax: "18" }],
    },
  })

  const { fields, append, remove } = form.control._formValues.items

  function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    setIsSubmitting(true)

    // Simulación de llamada a API
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Factura creada exitosamente",
        description: `La factura ${values.invoiceNumber} ha sido creada.`,
      })
      setIsSubmitting(false)
      router.push("/billing?tab=invoices")
    }, 1000)
  }

  // Cálculo de totales
  const items = form.watch("items")
  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0)

  const taxTotal = items.reduce((sum, item) => {
    const itemSubtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
    return sum + (itemSubtotal * (Number(item.tax) || 0)) / 100
  }, 0)

  const total = subtotal + taxTotal

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear nueva factura</CardTitle>
        <CardDescription>Crea una nueva factura para un cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de factura</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Elige una fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de vencimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                        <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Ítems de factura</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("items", [
                      ...items,
                      { product: "", description: "", quantity: "1", unitPrice: "0", tax: "18" },
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar ítem
                </Button>
              </div>

              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Producto</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Descripción</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Cantidad</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Precio Unitario</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">% IGV</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Total</th>
                      <th className="py-3 px-4 text-center text-sm font-medium w-[80px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      // Cálculo del total del ítem: cantidad * precio unitario
                      const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
                      // Cálculo del impuesto del ítem en base a porcentaje
                      const itemTax = (itemTotal * (Number(item.tax) || 0)) / 100
                      // Total con impuesto incluido
                      const itemTotalWithTax = itemTotal + itemTax

                      return (
                        <tr key={index} className="border-b">
                          {/* Columna Producto */}
                          <td className="py-3 px-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.product`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value)
                                        // Auto-llenar el precio unitario basado en el producto seleccionado
                                        const product = products.find((p) => p.id === value)
                                        if (product) {
                                          form.setValue(`items.${index}.unitPrice`, product.price.toString())
                                          form.setValue(`items.${index}.description`, product.name)
                                        }
                                      }}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="w-full border-none shadow-none h-8 p-0 focus:ring-0">
                                        <SelectValue placeholder="Seleccionar producto" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {products.map((product) => (
                                          <SelectItem key={product.id} value={product.id}>
                                            {product.id} - {product.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>

                          {/* Columna Descripción */}
                          <td className="py-3 px-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      placeholder="Descripción"
                                      className="border-none shadow-none h-8 p-0 focus:ring-0"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>

                          {/* Columna Cantidad */}
                          <td className="py-3 px-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      step="1"
                                      placeholder="1"
                                      className="border-none shadow-none h-8 p-0 focus:ring-0 text-right"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>

                          {/* Columna Precio Unitario */}
                          <td className="py-3 px-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      className="border-none shadow-none h-8 p-0 focus:ring-0 text-right"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>

                          {/* Columna Impuesto */}
                          <td className="py-3 px-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.tax`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="18"
                                      className="border-none shadow-none h-8 p-0 focus:ring-0 text-right"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>

                          {/* Columna Total con impuesto, alineado a la derecha */}
                          <td className="py-3 px-4 text-right">
                            {form.getValues(`items.${index}.currency`) || "S/"} {itemTotalWithTax.toFixed(2)}
                          </td>

                          {/* Columna de botón para eliminar ítem, centrado */}
                          <td className="py-3 px-4 text-center">
                            {items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newItems = [...items]
                                  newItems.splice(index, 1) // Elimina el ítem actual
                                  form.setValue("items", newItems) // Actualiza el estado del formulario
                                }}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}

                    {/* Fila subtotal */}
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium" colSpan={5}>
                        Subtotal
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {form.watch("currency") || "S/"} {subtotal.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    {/* Fila impuestos */}
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium" colSpan={5}>
                        Impuesto
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {form.watch("currency") || "S/"} {taxTotal.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    {/* Fila total */}
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium" colSpan={5}>
                        Total
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {form.watch("currency") || "S/"} {total.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales para la factura" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Estas notas aparecerán en la factura.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear Factura"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
