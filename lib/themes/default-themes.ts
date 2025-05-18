import type { Theme } from "./themes-types"

export const defaultThemes: Theme[] = [
  {
    id: "light",
    name: "Claro",
    isDark: false,
    isDefault: true,
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "dark",
    name: "Oscuro",
    isDark: true,
    isDefault: true,
    colors: {
      primary: "#0ea5e9",
      secondary: "#6366f1",
      accent: "#22d3ee",
      background: "#0f172a",
      foreground: "#f8fafc",
      card: "#1e293b",
      cardForeground: "#f8fafc",
      border: "#334155",
      input: "#334155",
      ring: "#0ea5e9",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "purple",
    name: "Morado",
    isDark: false,
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#d946ef",
      background: "#f5f3ff", // Fondo morado claro
      foreground: "#0f172a",
      card: "#faf5ff", // Tarjeta morada muy clara
      cardForeground: "#0f172a",
      border: "#e9d5ff", // Borde morado claro
      input: "#e9d5ff", // Entrada morada clara
      ring: "#8b5cf6",
      muted: "#f3e8ff", // Morado claro apagado
      mutedForeground: "#64748b",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "green",
    name: "Verde",
    isDark: false,
    colors: {
      primary: "#10b981",
      secondary: "#0ea5e9",
      accent: "#14b8a6",
      background: "#f0fdf4", // Fondo verde claro
      foreground: "#0f172a",
      card: "#f8fdf9", // Tarjeta verde muy clara
      cardForeground: "#0f172a",
      border: "#d1fae5", // Borde verde claro
      input: "#d1fae5", // Entrada verde clara
      ring: "#10b981",
      muted: "#ecfdf5", // Verde claro apagado
      mutedForeground: "#64748b",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sunset",
    name: "Atardecer",
    isDark: false,
    colors: {
      primary: "#ff6e6e", // Rojo suave
      secondary: "#fbbf24", // Amarillo cálido
      accent: "#fb7185", // Rosa anaranjado
      background: "#fff7ed", // Crema tenue
      foreground: "#1e293b", // Gris oscuro
      card: "#ffedd5", // Melocotón claro
      cardForeground: "#1e293b",
      border: "#ffdcba", // Borde salmón claro
      input: "#ffdcba",
      ring: "#fbbf24",
      muted: "#fff1e6", // Muy suave
      mutedForeground: "#475569",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "neon-pop",
    name: "Neón Pop",
    isDark: true,
    colors: {
      primary: "#05f5fc", // Cian eléctrico
      secondary: "#f705cc", // Magenta neón
      accent: "#f7f705", // Amarillo neón
      background: "#0f0f1a", // Casi negro con matiz azul
      foreground: "#e0e0e0", // Gris claro
      card: "#1a1a2e", // Azul oscuro profundo
      cardForeground: "#e0e0e0",
      border: "#33334d", // Azul grisáceo
      input: "#33334d",
      ring: "#05f5fc",
      muted: "#1a1a2e",
      mutedForeground: "#8b8bb0",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
