export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  border: string
  input: string
  ring: string
  muted: string
  mutedForeground: string
}

export interface Theme {
  id: string
  name: string
  isDark: boolean
  isDefault?: boolean
  colors: ThemeColors
  createdAt: Date
  updatedAt: Date
}

export interface ThemeContextType {
  currentTheme: Theme
  themes: Theme[]
  setTheme: (themeId: string) => void
  isLoading: boolean
}
