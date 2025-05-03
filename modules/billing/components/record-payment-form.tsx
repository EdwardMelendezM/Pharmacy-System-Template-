"use client"

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
    required_error: "Date is required.",
  }),
  customer: z.string({
    required_error: "Customer is required.",
  }),
  invoice: z.string({
    required_error: "Invoice is required.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  paymentMethod: z.enum(["cash", "bank_transfer", "credit_card", "check"], {
    required_error: "Payment method is required.",
  }),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

// Mock data for customers and invoices
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

  // Filter invoices based on selected customer
  const filteredInvoices = selectedCustomer
    ? invoices.filter((invoice) => invoice.customer === Number(selectedCustomer) && invoice.balance > 0)
    : []

  function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Payment recorded successfully",
        description: `Payment of ${values.amount} has been recorded for invoice ${values.invoice}.`,
      })
      setIsSubmitting(false)
      router.push("/billing?tab=customer-ledger")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
        <CardDescription>Record a payment from a customer against an invoice.</CardDescription>
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
                    <FormLabel>Payment Date</FormLabel>
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
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedCustomer(value)
                        // Reset invoice when customer changes
                        form.setValue("invoice", "")
                        form.setValue("amount", "")
                        setSelectedInvoice(null)
                      }}
                      defaultValue={field.value}
                    >
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
            </div>

            <FormField
              control={form.control}
              name="invoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice</FormLabel>
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
                              ? "Select a customer first"
                              : filteredInvoices.length === 0
                                ? "No outstanding invoices"
                                : "Select an invoice"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredInvoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id.toString()}>
                          {invoice.code} - Balance: S/ {invoice.balance.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Only invoices with outstanding balances are shown.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedInvoice && (
              <div className="rounded-md border p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.code}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="ml-2 font-medium">S/ {selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Outstanding Balance:</span>
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
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">S/</span>
                        <Input placeholder="0.00" className="pl-8" {...field} disabled={!selectedInvoice} />
                      </div>
                    </FormControl>
                    <FormDescription>Amount to be applied to the invoice.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
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
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Check number, transaction ID" {...field} />
                  </FormControl>
                  <FormDescription>Optional reference number for the payment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about this payment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/billing")} disabled={isSubmitting}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedInvoice}>
                {isSubmitting ? "Recording..." : "Record Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
