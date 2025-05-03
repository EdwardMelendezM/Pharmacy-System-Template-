"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const transactionFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  reference: z.string().min(1, {
    message: "Reference is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  entries: z
    .array(
      z.object({
        account: z.string({
          required_error: "Account is required.",
        }),
        description: z.string().optional(),
        debit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: "Debit must be a valid number.",
        }),
        credit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: "Credit must be a valid number.",
        }),
      }),
    )
    .min(2, {
      message: "At least two entries are required.",
    })
    .refine(
      (entries) => {
        const totalDebit = entries.reduce((sum, entry) => sum + Number(entry.debit), 0)
        const totalCredit = entries.reduce((sum, entry) => sum + Number(entry.credit), 0)
        return Math.abs(totalDebit - totalCredit) < 0.01 // Allow for small floating point differences
      },
      {
        message: "Total debits must equal total credits.",
      },
    ),
})

// Mock data for accounts
const accounts = [
  { code: "10", name: "EFECTIVO Y EQUIVALENTES DE EFECTIVO" },
  { code: "101", name: "Caja" },
  { code: "104", name: "Cuentas corrientes en instituciones financieras" },
  { code: "12", name: "CUENTAS POR COBRAR COMERCIALES – TERCEROS" },
  { code: "121", name: "Facturas, boletas y otros comprobantes por cobrar" },
  { code: "40", name: "TRIBUTOS, CONTRAPRESTACIONES Y APORTES AL SISTEMA DE PENSIONES" },
  { code: "401", name: "Gobierno central" },
  { code: "42", name: "PROVEEDORES" },
  { code: "421", name: "Facturas, boletas y otros comprobantes por pagar" },
  { code: "70", name: "VENTAS" },
  { code: "701", name: "Mercaderías" },
  { code: "60", name: "COMPRAS" },
  { code: "601", name: "Mercaderías" },
]

export function NewTransactionForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: new Date(),
      reference: "",
      description: "",
      entries: [
        { account: "", description: "", debit: "0", credit: "0" },
        { account: "", description: "", debit: "0", credit: "0" },
      ],
    },
  })

  const { fields, append, remove } = form.control._formValues.entries

  function onSubmit(values: z.infer<typeof transactionFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Transaction created successfully",
        description: `Transaction reference: ${values.reference} has been recorded.`,
      })
      setIsSubmitting(false)
      router.push("/accounting?tab=journal")
    }, 1000)
  }

  // Calculate totals
  const entries = form.watch("entries")
  const totalDebit = entries.reduce((sum, entry) => sum + (Number(entry.debit) || 0), 0)
  const totalCredit = entries.reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
        <CardDescription>Create a new accounting transaction with balanced debits and credits.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input placeholder="JE-2023-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Transaction description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Journal Entries</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("entries", [...entries, { account: "", description: "", debit: "0", credit: "0" }])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>

              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Account</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Description</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Debit</th>
                      <th className="py-3 px-4 text-right text-sm font-medium">Credit</th>
                      <th className="py-3 px-4 text-center text-sm font-medium w-[80px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`entries.${index}.account`}
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full border-none shadow-none h-8 p-0 focus:ring-0">
                                      <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {accounts.map((account) => (
                                        <SelectItem key={account.code} value={account.code}>
                                          {account.code} - {account.name}
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
                            name={`entries.${index}.description`}
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
                            name={`entries.${index}.debit`}
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
                            name={`entries.${index}.credit`}
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
                        <td className="py-3 px-4 text-center">
                          {entries.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newEntries = [...entries]
                                newEntries.splice(index, 1)
                                form.setValue("entries", newEntries)
                              }}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-medium" colSpan={2}>
                        Totals
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{totalDebit.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-medium">{totalCredit.toFixed(2)}</td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!isBalanced && (
                <p className="text-sm text-red-500">
                  Debits and credits must be equal. Current difference: {Math.abs(totalDebit - totalCredit).toFixed(2)}
                </p>
              )}
            </div>

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isBalanced}>
                {isSubmitting ? "Creating..." : "Create Transaction"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
