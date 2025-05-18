import { createTranslator } from "next-intl"

export async function getTranslations(locale: string, namespace = "common") {
  try {
    return (await import(`../../messages/${locale}/${namespace}.json`)).default
  } catch (error) {
    console.error(`Could not load translations for locale ${locale} and namespace ${namespace}`, error)
    return {}
  }
}

export async function getTranslator(locale: string, namespace = "common") {
  const messages = await getTranslations(locale, namespace)
  return createTranslator({ locale, messages })
}
