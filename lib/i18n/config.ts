export const locales = ["es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  es: "Español",
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
