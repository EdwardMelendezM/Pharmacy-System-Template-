"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Theme, ThemeContextType } from "./themes-types"
import { defaultThemes } from "./default-themes"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes)
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load themes from API
    const loadThemes = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/themes');
        // const data = await response.json();
        // setThemes(data);

        // For now, we'll use the default themes
        setThemes(defaultThemes)

        // Get saved theme from localStorage
        const savedThemeId = localStorage.getItem("themeId")
        if (savedThemeId) {
          const theme = defaultThemes.find((t) => t.id === savedThemeId)
          if (theme) {
            setCurrentTheme(theme)
            applyTheme(theme)
          }
        } else {
          // Use system preference for dark/light if no saved theme
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          const defaultTheme = defaultThemes.find((t) => t.isDark === prefersDark && t.isDefault) || defaultThemes[0]
          setCurrentTheme(defaultTheme)
          applyTheme(defaultTheme)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load themes:", error)
        setIsLoading(false)
      }
    }

    loadThemes()
  }, [])

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement

    // Convert hex colors to hsl for CSS variables
    const hexToHSL = (hex: string) => {
      // Remove the # if present
      hex = hex.replace(/^#/, "")

      // Parse the hex values
      const r = Number.parseInt(hex.substring(0, 2), 16) / 255
      const g = Number.parseInt(hex.substring(2, 4), 16) / 255
      const b = Number.parseInt(hex.substring(4, 6), 16) / 255

      // Find the min and max values to calculate the lightness
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }

        h = h * 60
      }

      // Return the HSL values as a string
      return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`
    }

    // Apply theme colors to CSS variables
    if (theme.isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Apply custom colors if they exist
    if (theme.colors) {
      // Primary color
      if (theme.colors.primary) {
        root.style.setProperty("--primary", hexToHSL(theme.colors.primary))
      }

      // Secondary color
      if (theme.colors.secondary) {
        root.style.setProperty("--secondary", hexToHSL(theme.colors.secondary))
      }

      // Accent color
      if (theme.colors.accent) {
        root.style.setProperty("--accent", hexToHSL(theme.colors.accent))
      }

      // Background color
      if (theme.colors.background) {
        root.style.setProperty("--background", hexToHSL(theme.colors.background))
      }

      // Foreground color
      if (theme.colors.foreground) {
        root.style.setProperty("--foreground", hexToHSL(theme.colors.foreground))
      }

      // Card colors
      if (theme.colors.card) {
        root.style.setProperty("--card", hexToHSL(theme.colors.card))
      }

      if (theme.colors.cardForeground) {
        root.style.setProperty("--card-foreground", hexToHSL(theme.colors.cardForeground))
      }

      // Border color
      if (theme.colors.border) {
        root.style.setProperty("--border", hexToHSL(theme.colors.border))
      }

      // Input color
      if (theme.colors.input) {
        root.style.setProperty("--input", hexToHSL(theme.colors.input))
      }

      // Ring color
      if (theme.colors.ring) {
        root.style.setProperty("--ring", hexToHSL(theme.colors.ring))
      }

      // Muted colors
      if (theme.colors.muted) {
        root.style.setProperty("--muted", hexToHSL(theme.colors.muted))
      }

      if (theme.colors.mutedForeground) {
        root.style.setProperty("--muted-foreground", hexToHSL(theme.colors.mutedForeground))
      }
    }

    // Log the applied theme for debugging
    console.log("Applied theme:", theme.name, theme.colors)
  }

  const setTheme = (themeId: string) => {
    console.log("Setting theme:", themeId)
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      applyTheme(theme)
      localStorage.setItem("themeId", themeId)
    } else {
      console.error("Theme not found:", themeId)
    }
  }

  return <ThemeContext.Provider value={{ currentTheme, themes, setTheme, isLoading }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
