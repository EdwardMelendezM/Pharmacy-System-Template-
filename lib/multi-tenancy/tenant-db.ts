// This is a simplified mock implementation
// In a real application, you would use a proper database with tenant isolation

import type { Tenant, SubscriptionPlan, TenantFeature } from "./types"

// Feature definitions by plan
export const planFeatures: Record<SubscriptionPlan, TenantFeature> = {
  free: {
    plan: "free",
    maxUsers: 2,
    maxCompanies: 1,
    maxProducts: 100,
    advancedReporting: false,
    apiAccess: false,
    customBranding: false,
    multipleLocations: false,
    support: "email",
  },
  basic: {
    plan: "basic",
    maxUsers: 5,
    maxCompanies: 3,
    maxProducts: 500,
    advancedReporting: false,
    apiAccess: false,
    customBranding: false,
    multipleLocations: false,
    support: "email",
  },
  professional: {
    plan: "professional",
    maxUsers: 20,
    maxCompanies: 10,
    maxProducts: 2000,
    advancedReporting: true,
    apiAccess: true,
    customBranding: true,
    multipleLocations: true,
    support: "priority",
  },
  enterprise: {
    plan: "enterprise",
    maxUsers: 100,
    maxCompanies: 50,
    maxProducts: 10000,
    advancedReporting: true,
    apiAccess: true,
    customBranding: true,
    multipleLocations: true,
    support: "24/7",
  },
}

// Check if a feature is available for a given tenant
export function hasFeature(tenant: Tenant, feature: keyof TenantFeature): boolean {
  const planFeature = planFeatures[tenant.plan]
  return !!planFeature[feature]
}

// Check if a tenant has reached a numeric limit
export function hasReachedLimit(
  tenant: Tenant,
  limitName: "maxUsers" | "maxCompanies" | "maxProducts",
  currentCount: number,
): boolean {
  const limit = planFeatures[tenant.plan][limitName]
  return currentCount >= limit
}
