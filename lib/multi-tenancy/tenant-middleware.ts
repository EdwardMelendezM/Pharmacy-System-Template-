import { type NextRequest, NextResponse } from "next/server"

// This would be replaced with actual database queries in a real implementation
async function getTenantBySlug(slug: string) {
  // Mock implementation
  const tenants = {
    tenant1: { id: "1", name: "Tenant 1", slug: "tenant1" },
    tenant2: { id: "2", name: "Tenant 2", slug: "tenant2" },
  }

  return tenants[slug as keyof typeof tenants] || null
}

export async function tenantMiddleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Skip for static assets and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/static")) {
    return NextResponse.next()
  }

  // Extract tenant slug from subdomain
  const hostname = request.headers.get("host") || ""
  const subdomain = hostname.split(".")[0]

  if (subdomain !== "app" && subdomain !== "www" && subdomain !== "localhost:3000") {
    // Check if tenant exists
    const tenant = await getTenantBySlug(subdomain)

    if (!tenant) {
      // Redirect to tenant not found page
      url.pathname = "/tenant-not-found"
      return NextResponse.redirect(url)
    }

    // Continue with the tenant context
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-tenant-id", tenant.id)
    requestHeaders.set("x-tenant-slug", tenant.slug)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}
