"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Tenant, TenantRole } from "./types"

interface TenantContextType {
  tenant: Tenant | null
  userRole: TenantRole | null
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  userRole: null,
  isLoading: true,
})

export function TenantProvider({
  children,
  tenant,
  userRole,
  isLoading = false,
}: {
  children: ReactNode
  tenant: Tenant | null
  userRole: TenantRole | null
  isLoading?: boolean
}) {
  return <TenantContext.Provider value={{ tenant, userRole, isLoading }}>{children}</TenantContext.Provider>
}

export const useTenant = () => useContext(TenantContext)
