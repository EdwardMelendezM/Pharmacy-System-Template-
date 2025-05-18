export interface Tenant {
  id: string
  name: string
  slug: string
  plan: SubscriptionPlan
  createdAt: Date
  updatedAt: Date
  settings: TenantSettings
}

export interface TenantSettings {
  locale: string
  timezone: string
  currency: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
}

export type SubscriptionPlan = "free" | "basic" | "professional" | "enterprise"

export interface TenantUser {
  userId: string
  tenantId: string
  role: TenantRole
  status: "active" | "invited" | "suspended"
}

export type TenantRole = "owner" | "admin" | "member" | "guest"

export interface TenantFeature {
  plan: SubscriptionPlan
  maxUsers: number
  maxCompanies: number
  maxProducts: number
  advancedReporting: boolean
  apiAccess: boolean
  customBranding: boolean
  multipleLocations: boolean
  support: "email" | "priority" | "24/7"
}
