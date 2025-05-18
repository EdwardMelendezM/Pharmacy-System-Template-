"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/themes/theme-context"
import { Paintbrush, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function ThemesList() {
  const { themes, setTheme, currentTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleApplyTheme = (themeId: string) => {
    setTheme(themeId)
  }

  const handleEditTheme = (themeId: string) => {
    router.push(`/settings/themes/edit/${themeId}`)
  }

  const handleDeleteTheme = async (themeId: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/themes/${themeId}`, {
      //   method: "DELETE",
      // });

      // For now, we'll just show a success message
      console.log(`Theme ${themeId} deleted`)

      // Refresh the page to show updated themes
      router.refresh()
    } catch (error) {
      console.error("Failed to delete theme:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {themes.map((theme) => (
            <TableRow key={theme.id}>
              <TableCell>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                </div>
              </TableCell>
              <TableCell>{theme.name}</TableCell>
              <TableCell>{theme.isDark ? "Dark" : "Light"}</TableCell>
              <TableCell>{theme.isDefault ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyTheme(theme.id)}
                    disabled={currentTheme.id === theme.id}
                  >
                    <Paintbrush className="mr-2 h-4 w-4" />
                    Apply
                  </Button>

                  {!theme.isDefault && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleEditTheme(theme.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this theme?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the theme from your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTheme(theme.id)} disabled={isLoading}>
                              {isLoading ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
