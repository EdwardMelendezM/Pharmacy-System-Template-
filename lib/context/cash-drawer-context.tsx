"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentCashDrawer } from "@/lib/actions/pos-actions"
import type { CashDrawer } from "@/lib/models/pos"

interface CashDrawerContextType {
  cashDrawer: CashDrawer | null
  isLoading: boolean
  refreshCashDrawer: () => Promise<void>
}

const CashDrawerContext = createContext<CashDrawerContextType | undefined>(undefined)

export function CashDrawerProvider({ children }: { children: ReactNode }) {
  const [cashDrawer, setCashDrawer] = useState<CashDrawer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshCashDrawer = async () => {
    try {
      setIsLoading(true)
      // En una app real, obtener el ID de usuario de la sesión
      const userId = "john.doe" // ID de usuario de ejemplo
      const result = await getCurrentCashDrawer(userId)

      if (result.success) {
        setCashDrawer(result.data)
      } else {
        setCashDrawer(null)
      }
    } catch (error) {
      console.error("Error fetching cash drawer:", error)
      setCashDrawer(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar el estado de la caja al montar el componente
  useEffect(() => {
    refreshCashDrawer()
  }, [])

  return (
    <CashDrawerContext.Provider value={{ cashDrawer, isLoading, refreshCashDrawer }}>
      {children}
    </CashDrawerContext.Provider>
  )
}

export function useCashDrawer() {
  const context = useContext(CashDrawerContext)
  if (context === undefined) {
    throw new Error("useCashDrawer must be used within a CashDrawerProvider")
  }
  return context
}
