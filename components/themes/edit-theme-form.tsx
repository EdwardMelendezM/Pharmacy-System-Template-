"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { updateThemeSchema } from "@/lib/themes/theme.schema"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/lib/themes/theme-context"

type FormValues = z.infer<typeof updateThemeSchema>

export default function EditThemeForm({ themeId }: { themeId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTheme, setIsLoadingTheme] = useState(true)
  const router = useRouter()
  const { themes } = useTheme()

  const form = useForm<FormValues>({
    resolver: zodResolver(updateThemeSchema),
    defaultValues: {
      name: "",
      isDark: false,
      colors: {
        primary: "#0ea5e9",
        secondary: "#6366f1",
        accent: "#22d3ee",
        background: "#ffffff",
        foreground: "#0f172a",
        card: "#ffffff",
        cardForeground: "#0f172a",
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#0ea5e9",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
      },
    },
  })

  useEffect(() => {
    const loadTheme = async () => {
      setIsLoadingTheme(true)
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/themes/${themeId}`);
        // const data = await response.json();

        // For now, we'll use the themes from context
        const theme = themes.find((t) => t.id === themeId)

        if (theme) {
          form.reset({
            name: theme.name,
            isDark: theme.isDark,
            colors: theme.colors,
          })
        } else {
          // Theme not found, redirect to themes list
          router.push("/settings/themes")
        }
      } catch (error) {
        console.error("Failed to load theme:", error)
      } finally {
        setIsLoadingTheme(false)
      }
    }

    loadTheme()
  }, [themeId, form, router, themes])

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/themes/${themeId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      // For now, we'll just show a success message
      console.log("Theme updated:", data)

      // Redirect to themes list
      router.push("/settings/themes")
      router.refresh()
    } catch (error) {
      console.error("Failed to update theme:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update background and text colors when dark mode is toggled
  const watchIsDark = form.watch("isDark")

  // When dark mode is toggled, update the background and foreground colors
  const handleDarkModeToggle = (isDark: boolean) => {
    form.setValue("isDark", isDark)

    if (isDark) {
      form.setValue("colors.background", "#0f172a")
      form.setValue("colors.foreground", "#f8fafc")
      form.setValue("colors.card", "#1e293b")
      form.setValue("colors.cardForeground", "#f8fafc")
      form.setValue("colors.border", "#334155")
      form.setValue("colors.input", "#334155")
      form.setValue("colors.muted", "#1e293b")
      form.setValue("colors.mutedForeground", "#94a3b8")
    } else {
      form.setValue("colors.background", "#ffffff")
      form.setValue("colors.foreground", "#0f172a")
      form.setValue("colors.card", "#ffffff")
      form.setValue("colors.cardForeground", "#0f172a")
      form.setValue("colors.border", "#e2e8f0")
      form.setValue("colors.input", "#e2e8f0")
      form.setValue("colors.muted", "#f1f5f9")
      form.setValue("colors.mutedForeground", "#64748b")
    }
  }

  // Preview component to show how the theme will look
  const ThemePreview = () => {
    const colors = form.watch("colors")

    return (
      <div
        className="rounded-lg p-6 border"
        style={{
          backgroundColor: colors?.background,
          color: colors?.foreground,
          borderColor: colors?.border,
        }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: colors?.foreground }}>
          Theme Preview
        </h3>
        <div className="space-y-4">
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: colors?.card,
              color: colors?.cardForeground,
              borderColor: colors?.border,
            }}
          >
            <p style={{ color: colors?.cardForeground }}>Card Component</p>
          </div>

          <div className="flex space-x-2">
            <button
              className="px-4 py-2 rounded-md"
              style={{
                backgroundColor: colors?.primary,
                color: "#ffffff",
              }}
            >
              Primary Button
            </button>

            <button
              className="px-4 py-2 rounded-md"
              style={{
                backgroundColor: colors?.secondary,
                color: "#ffffff",
              }}
            >
              Secondary Button
            </button>

            <button
              className="px-4 py-2 rounded-md"
              style={{
                backgroundColor: colors?.accent,
                color: "#ffffff",
              }}
            >
              Accent Button
            </button>
          </div>

          <div
            className="p-3 rounded-md"
            style={{
              backgroundColor: colors?.muted,
              color: colors?.mutedForeground,
            }}
          >
            <p style={{ color: colors?.mutedForeground }}>Muted Text Area</p>
          </div>

          <input
            type="text"
            placeholder="Input field"
            className="w-full p-2 rounded-md"
            style={{
              backgroundColor: colors?.background,
              color: colors?.foreground,
              borderColor: colors?.input,
              outlineColor: colors?.ring,
            }}
          />
        </div>
      </div>
    )
  }

  if (isLoadingTheme) {
    return <div>Loading theme...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Custom Theme" {...field} />
                  </FormControl>
                  <FormDescription>Give your theme a descriptive name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDark"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dark Mode</FormLabel>
                    <FormDescription>Enable dark mode for this theme</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={(checked) => handleDarkModeToggle(checked)} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Tabs defaultValue="primary">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="secondary">Secondary</TabsTrigger>
                <TabsTrigger value="accent">Accent</TabsTrigger>
              </TabsList>

              <TabsContent value="primary">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="colors.primary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: field.value }} />
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="secondary">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="colors.secondary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: field.value }} />
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accent">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="colors.accent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accent Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: field.value }} />
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <ThemePreview />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/settings/themes")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
