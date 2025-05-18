"use client"

/**
 * Permissions Hook
 *
 * This hook provides utility functions for checking user permissions
 * throughout the application.
 */

import { useContext } from "react"
import { type SystemModule, PermissionLevel } from "@/lib/models/user"
import { AuthContext } from "@/lib/context/auth-context"

export function usePermissions() {
  const { user, isAuthenticated } = useContext(AuthContext)

  /**
   * Check if the current user has at least the specified permission level for a module
   */
  const hasPermission = (module: SystemModule, requiredLevel: PermissionLevel): boolean => {
    if (!isAuthenticated || !user || !user.role) {
      return false
    }

    const permission = user.role.permissions.find((p) => p.module === module)

    if (!permission) {
      return false
    }

    // Admin level has access to everything
    if (permission.level === PermissionLevel.ADMIN) {
      return true
    }

    // Staff level has access to staff operations but not admin
    if (permission.level === PermissionLevel.STAFF && requiredLevel === PermissionLevel.STAFF) {
      return true
    }

    return false
  }

  /**
   * Check if the current user can view a module (has at least STAFF level access)
   */
  const canView = (module: SystemModule): boolean => {
    return hasPermission(module, PermissionLevel.STAFF)
  }

  /**
   * Check if the current user has admin access to a module
   */
  const isAdmin = (module: SystemModule): boolean => {
    return hasPermission(module, PermissionLevel.ADMIN)
  }

  return {
    hasPermission,
    canView,
    isAdmin,
  }
}
