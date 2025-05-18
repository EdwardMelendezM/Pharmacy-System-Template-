"use client" // "usar cliente" (indicador de Next.js para que este componente se renderice en cliente)

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, ArrowLeftIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const paymentFormSchema = z.object({
  date: z.date({
    required_error: "La fecha es obligatoria.",
  }),
  customer: z.string({
    required_error: "El cliente es obligatorio.",
  }),
  invoice: z.string({
    required_error: "La factura es obligatoria.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El monto debe ser un número positivo.",
  }),
  paymentMethod: z.enum(["cash", "bank_transfer", "credit_card", "check"], {
    required_error: "El método de pago es obligatorio.",
  }),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

// Datos simulados para clientes y facturas
const customers = [
  { id: 1, name: "Hospital San Juan" },
  { id: 2, name: "Clínica Santa María" },
  { id: 3, name: "Farmacia Universal" },
  { id: 4, name: "Hospital Nacional" },
  { id: 5, name: "Clínica Internacional" },
]

const invoices = [
  { id: 1001, code: "F001-00001", customer: 1, amount: 1250.0, balance: 1250.0, date: "2023-04-15" },
  { id: 1002, code: "F001-00002", customer: 2, amount: 3450.75, balance: 3450.75, date: "2023-04-16" },
  { id: 1003, code: "F001-00003", customer: 3, amount: 875.5, balance: 500.0, date: "2023-04-18" },
  { id: 1004, code: "F001-00004", customer: 4, amount: 2100.0, balance: 2100.0, date: "2023-04-20" },
  { id: 1005, code: "F001-00005", customer: 5, amount: 1875.25, balance: 1000.0, date: "2023-04-22" },
]

export function RecordPaymentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      date: new Date(),
      paymentMethod: "cash",
      reference: "",
      notes: "",
    },
  })

  // Filtrar facturas según el cliente seleccionado
  const filteredInvoices = selectedCustomer
    ? invoices.filter((invoice) => invoice.customer === Number(selectedCustomer) && invoice.balance > 0)
    : []

  function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    setIsSubmitting(true)

    // Simular llamada a API
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Pago registrado exitosamente",
        description: `Se ha registrado un pago de ${values.amount} para la factura ${values.invoice}.`,
      })
      setIsSubmitting(false)
      router.push("/billing?tab=customer-ledger")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Pago</CardTitle>
        <CardDescription>Registrar un pago de un cliente contra una factura.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Pago</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Seleccione una fecha</span>}
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
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedCustomer(value)
                        // Resetear factura cuando cambia el cliente
                        form.setValue("invoice", "")
                        form.setValue("amount", "")
                        setSelectedInvoice(null)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cliente" />
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
            </div>

            <FormField
              control={form.control}
              name="invoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factura</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      const invoice = invoices.find((inv) => inv.id.toString() === value)
                      setSelectedInvoice(invoice)
                      if (invoice) {
                        form.setValue("amount", invoice.balance.toString())
                      }
                    }}
                    defaultValue={field.value}
                    disabled={!selectedCustomer || filteredInvoices.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedCustomer
                              ? "Primero seleccione un cliente"
                              : filteredInvoices.length === 0
                                ? "No hay facturas pendientes"
                                : "Seleccione una factura"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredInvoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id.toString()}>
                          {invoice.code} - Saldo: S/ {invoice.balance.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Sólo se muestran facturas con saldos pendientes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedInvoice && (
              <div className="rounded-md border p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Detalles de la Factura</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Número de Factura:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.code}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monto Total:</span>
                    <span className="ml-2 font-medium">S/ {selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Saldo Pendiente:</span>
                    <span className="ml-2 font-medium">S/ {selectedInvoice.balance.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pago</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                        <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="check">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Pago"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
