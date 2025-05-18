/**
 * Protected Route Component
 *
 * This component protects routes by checking if the user is authenticated
 * and has the required permissions.
 */

"use client"

import { useContext, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type SystemModule, PermissionLevel } from "@/lib/models/user"
import { Loader2 } from "lucide-react"
import { AuthContext } from "@/lib/context/auth-context"
import { usePermissions } from "@/hooks/use-permissions"

interface ProtectedRouteProps {
  children: ReactNode
  module?: SystemModule
  requiredPermission?: PermissionLevel
}

export function ProtectedRoute({ children, module, requiredPermission = PermissionLevel.STAFF }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useContext(AuthContext)
  const { hasPermission } = usePermissions()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log("ProtectedRoute useEffect triggered")
    // Skip checks while loading
    if (isLoading) return
    console.log("ProtectedRoute isLoading:", isLoading)
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Store the current path to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname)
      router.push("/es/auth/login")
      return
    }

    // If module is specified, check permissions
    if (module && !hasPermission(module, requiredPermission)) {
      router.push("/access-denied")
    }
  }, [isAuthenticated, isLoading, module, requiredPermission, router, pathname, hasPermission])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not authenticated or doesn't have permission, don't render children
  // (useEffect will handle the redirect)
  if (!isAuthenticated || (module && !hasPermission(module, requiredPermission))) {
    return null
  }

  // Render children if authenticated and has permission
  return <>{children}</>
}
