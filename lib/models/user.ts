/**
 * User and Permission Models
 *
 * This file defines the core data structures for users, roles, and permissions
 * in the pharmacy management system.
 */

// User status options
export type UserStatus = "active" | "inactive" | "pending" | "locked"

// Permission levels for module access
export enum PermissionLevel {
  NONE = "none", // No access to the module
  STAFF = "staff", // Regular staff access (CRUD operations)
  ADMIN = "admin", // Administrative access to the module
}

// System modules that can have permissions assigned
export enum SystemModule {
  DASHBOARD = "dashboard",
  USERS = "users",
  INVENTORY = "inventory",
  BILLING = "billing",
  ACCOUNTING = "accounting",
  POS = "pos",
  REPORTS = "reports",
  SETTINGS = "settings",
}

// Permission structure for a specific module
export interface ModulePermission {
  module: SystemModule
  level: PermissionLevel
}

// Role definition with associated permissions
export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean // System roles cannot be modified/deleted
  permissions: ModulePermission[]
  createdAt: Date
  updatedAt: Date
}

// User model
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  passwordHash?: string
  status: UserStatus
  roleId: string
  role?: Role
  companyId: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

// User creation/update payload
export interface UserPayload {
  firstName: string
  lastName: string
  email: string
  username: string
  password?: string
  status: UserStatus
  roleId: string
  companyId: string
}

// Company model
export interface Company {
  id: string
  name: string
  ruc: string
  address?: string
  city?: string
  phone?: string
  email?: string
  contactPerson?: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

// Company creation/update payload
export interface CompanyPayload {
  name: string
  ruc: string
  address?: string
  city?: string
  phone?: string
  email?: string
  contactPerson?: string
  status: "active" | "inactive"
}
