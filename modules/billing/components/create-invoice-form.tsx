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

const invoiceFormSchema = z
  .object({
    invoiceNumber: z.string().min(1, {
      message: "Invoice number is required.",
    }),
    date: z.date({
      required_error: "Date is required.",
    }),
    dueDate: z.date({
      required_error: "Due date is required.",
    }),
    customer: z.string({
      required_error: "Customer is required.",
    }),
    currency: z.string({
      required_error: "Currency is required.",
    }),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          product: z.string({
            required_error: "Product is required.",
          }),
          description: z.string().optional(),
          quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Quantity must be a positive number.",
          }),
          unitPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Unit price must be a valid number.",
          }),
          tax: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Tax must be a valid number.",
          }),
        }),
      )
      .min(1, {
        message: "At least one item is required.",
      }),
  })
  .refine((data) => data.dueDate >= data.date, {
    message: "Due date must be after invoice date",
    path: ["dueDate"],
  })

// Mock data for customers and products
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
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
      currency: "PEN",
      notes: "",
      items: [{ product: "", description: "", quantity: "1", unitPrice: "0", tax: "18" }],
    },
  })

  const { fields, append, remove } = form.control._formValues.items

  function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Invoice created successfully",
        description: `Invoice ${values.invoiceNumber} has been created.`,
      })
      setIsSubmitting(false)
      router.push("/billing?tab=invoices")
    }, 1000)
  }

  // Calculate totals
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
        <CardTitle>Create New Invoice</CardTitle>
        <CardDescription>Create a new invoice for a customer.</CardDescription>
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
                    <FormLabel>Invoice Number</FormLabel>
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
                    <FormLabel>Invoice Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
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
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PEN">PEN - Peruvian Sol</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
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
                <h3 className="text-lg font-medium">Invoice Items</h3>
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
                  Add Item
                </Button>
              </div>

              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Product</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Description</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Quantity</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Unit Price</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Tax %</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Total</th>
                      <th className="py-3 px-4 text-center text-sm font-medium w-[80px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
                      const itemTax = (itemTotal * (Number(item.tax) || 0)) / 100
                      const itemTotalWithTax = itemTotal + itemTax

                      return (
                        <tr key={index} className="border-b">
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
                                        // Auto-fill unit price based on selected product
                                        const product = products.find((p) => p.id === value)
                                        if (product) {
                                          form.setValue(`items.${index}.unitPrice`, product.price.toString())
                                          form.setValue(`items.${index}.description`, product.name)
                                        }
                                      }}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="w-full border-none shadow-none h-8 p-0 focus:ring-0">
                                        <SelectValue placeholder="Select product" />
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
                          <td className="py-3 px-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      placeholder="Description"
                                      className="border-none shadow-none h-8 p-0 focus:ring-0"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
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
                          <td className="py-3 px-4 text-right">
                            {form.watch(`items.${index}.currency`) || "S/"} {itemTotalWithTax.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newItems = [...items]
                                  newItems.splice(index, 1)
                                  form.setValue("items", newItems)
                                }}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium" colSpan={5}>
                        Subtotal
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {form.watch("currency") || "S/"} {subtotal.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium" colSpan={5}>
                        Tax
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {form.watch("currency") || "S/"} {taxTotal.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes for the invoice" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>These notes will appear on the invoice.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
