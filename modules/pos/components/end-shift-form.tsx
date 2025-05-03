"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const endShiftFormSchema = z.object({
  closingAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Closing amount must be a valid number.",
  }),
  notes: z.string().optional(),
})

export function EndShiftForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof endShiftFormSchema>>({
    resolver: zodResolver(endShiftFormSchema),
    defaultValues: {
      closingAmount: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof endShiftFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Shift ended successfully",
        description: "Shift has been closed and summary recorded.",
      })
      setIsSubmitting(false)
      router.push("/pos")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>End Shift</CardTitle>
        <CardDescription>Record the closing amount and end the current shift.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="closingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Cash Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Enter the total cash amount in the drawer at the end of the shift.</FormDescription>
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
                    <Textarea placeholder="Add any additional notes here..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ending Shift..." : "End Shift"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
