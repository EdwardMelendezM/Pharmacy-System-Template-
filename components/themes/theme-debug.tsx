"use client"

import { useTheme } from "@/lib/themes/theme-context"

export function ThemeDebug() {
  const { currentTheme } = useTheme()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs p-4 bg-card border rounded-lg shadow-lg text-xs overflow-auto max-h-64">
      <h4 className="font-bold mb-2">Current Theme: {currentTheme.name}</h4>
      <div>
        {Object.entries(currentTheme.colors).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: value }} />
            <span>{key}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
