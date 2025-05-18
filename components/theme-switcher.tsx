"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/lib/themes/theme-context"
import { Separator } from "./ui/separator"

export function ThemeSwitcher() {
  const { currentTheme, themes, setTheme } = useTheme()

  // Separar los temas en dos categorías
  const lightThemes = themes.filter((theme) => !theme.isDark)
  const darkThemes = themes.filter((theme) => theme.isDark)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: currentTheme.colors.primary }} />
          {currentTheme.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2">
        {/* Sección de Fondos Claros */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1 pt-1">Fondo Claro</h3>
          {lightThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.background }} />
              </div>
              <span>{theme.name}</span>
              {currentTheme.id === theme.id && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </div>
        <Separator className="my-2" />

        {/* Sección de Fondos Oscuros */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Fondo Oscuro</h3>
          {darkThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.background }} />
              </div>
              <span>{theme.name}</span>
              {currentTheme.id === theme.id && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
