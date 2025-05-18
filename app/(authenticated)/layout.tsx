import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"
import { TenantProvider } from "@/lib/multi-tenancy/tenant-context"
import { ThemeProvider } from "@/lib/themes/theme-context"
import { CashDrawerProvider } from "@/lib/context/cash-drawer-context"
import { AuthProvider } from "@/lib/context/auth-context"
import { SidebarMobile } from "@/components/layout/sidebar-mobile"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pharmacy Management System",
  description: "A comprehensive solution for pharmacy management",
  generator: "v0.dev",
}

// This would be fetched from the database in a real application
const mockTenant = {
  id: "1",
  name: "Demo Pharmacy",
  slug: "demo",
  plan: "professional" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    locale: "en",
    timezone: "UTC",
    currency: "USD",
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string } | Promise<{ locale: string }>
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <TenantProvider tenant={mockTenant} userRole="admin">
              <CashDrawerProvider>
                <div className="flex h-screen">
                  {/* 4) Pasamos las props traducidas al Sidebar */}
                  <Sidebar />
                  <SidebarMobile />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                  </div>
                </div>
              </CashDrawerProvider>
            </TenantProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
