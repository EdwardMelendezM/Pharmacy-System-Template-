/**
 * Permission Gate Component
 *
 * This component conditionally renders its children based on user permissions.
 * It can be used to protect UI elements or entire pages.
 */

"use client"

import type { ReactNode } from "react"
import type { SystemModule, PermissionLevel } from "@/lib/models/user"
import { usePermissions } from "@/hooks/use-permissions"

interface PermissionGateProps {
  module: SystemModule
  level: PermissionLevel
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ module, level, children, fallback = null }: PermissionGateProps) {
  const { hasPermission } = usePermissions()

  if (hasPermission(module, level)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
