"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const tenantFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(3, {
      message: "Slug must be at least 3 characters.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  size: z.string({
    required_error: "Please select a company size.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<"organization" | "account" | "plan">("organization")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof tenantFormSchema>>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      organizationName: "",
      slug: "",
      industry: "",
      size: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  })

  function onSubmit(values: z.infer<typeof tenantFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Pharmacy Management System</CardTitle>
          <CardDescription>Set up your organization to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="organization" onClick={() => setStep("organization")}>
                Organization
              </TabsTrigger>
              <TabsTrigger value="account" onClick={() => setStep("account")}>
                Account
              </TabsTrigger>
              <TabsTrigger value="plan" onClick={() => setStep("plan")}>
                Plan
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                <TabsContent value="organization" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Pharmacy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="acme" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used for your subdomain: {field.value || "your-org"}.pharmacysystem.com
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="retail">Retail Pharmacy</SelectItem>
                              <SelectItem value="hospital">Hospital Pharmacy</SelectItem>
                              <SelectItem value="clinic">Clinic Pharmacy</SelectItem>
                              <SelectItem value="wholesale">Pharmaceutical Wholesale</SelectItem>
                              <SelectItem value="manufacturing">Pharmaceutical Manufacturing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501+">501+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setStep("account")}>
                      Next
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="account" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="********" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep("organization")}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep("plan")}>
                      Next
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="plan" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4 cursor-pointer hover:border-primary">
                      <div className="font-semibold">Free Plan</div>
                      <div className="text-sm text-muted-foreground">For small pharmacies just getting started</div>
                      <div className="mt-2 text-2xl font-bold">$0</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                    <div className="rounded-lg border p-4 cursor-pointer hover:border-primary">
                      <div className="font-semibold">Basic Plan</div>
                      <div className="text-sm text-muted-foreground">For growing pharmacies</div>
                      <div className="mt-2 text-2xl font-bold">$29</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4 cursor-pointer hover:border-primary">
                      <div className="font-semibold">Professional Plan</div>
                      <div className="text-sm text-muted-foreground">For established pharmacies</div>
                      <div className="mt-2 text-2xl font-bold">$79</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                    <div className="rounded-lg border p-4 cursor-pointer hover:border-primary">
                      <div className="font-semibold">Enterprise Plan</div>
                      <div className="text-sm text-muted-foreground">For large pharmacy chains</div>
                      <div className="mt-2 text-2xl font-bold">$199</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Accept Terms and Conditions</FormLabel>
                          <FormDescription>
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep("account")}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Organization"}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
