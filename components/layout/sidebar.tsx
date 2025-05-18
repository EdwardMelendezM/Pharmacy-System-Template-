"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Calculator, Receipt, Package, ShoppingCart, Settings, Home, Shield, Building } from "lucide-react"
import { SystemModule } from "@/lib/models/user"
import { usePermissions } from "@/hooks/use-permissions"
import { useSidebarDesktop } from "@/hooks/use-sidebar-desktop"
import { Separator } from "../ui/separator"

// Navigation items with their associated modules for permission checking
const navigation = [
  { name: "Tablero", href: "/dashboard", icon: Home, module: SystemModule.DASHBOARD },
  { name: "Contabilidad", href: "/accounting", icon: Calculator, module: SystemModule.ACCOUNTING },
  { name: "Facturación", href: "/billing", icon: Receipt, module: SystemModule.BILLING },
  { name: "Inventario", href: "/inventory", icon: Package, module: SystemModule.INVENTORY },
  { name: "Punto de Venta", href: "/pos", icon: ShoppingCart, module: SystemModule.POS },
  { name: "Configuraciones", href: "/settings", icon: Settings, module: SystemModule.SETTINGS },
]

const adminNavigation = [{ name: "Tenants", href: "/admin/tenants", icon: Users, module: SystemModule.USERS }]

export default function Sidebar() {
  const pathname = usePathname()
  const { canView } = usePermissions()
  const { isOpen } = useSidebarDesktop()

  // Filter navigation items based on user permissions
  const filteredNavigation = navigation.filter((item) => canView(item.module))

  return (
    <div
      className={cn(
        "h-full flex-col border-r bg-muted/40 hidden sm:flex overflow-hidden",
        "transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-primary" />
          <span
            className={cn("truncate transition-opacity duration-300 ease-in-out", isOpen ? "opacity-100" : "opacity-0")}
          >
            <span className="hidden lg:inline">Sistema Farmacia</span>
            <span className="lg:hidden">App</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1 px-2">
          <h3
            className={cn(
              "mb-2 px-2 text-xs font-semibold text-primary transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0",
            )}
          >
            Módulos disponibles
          </h3>

          {filteredNavigation.map((item) => {
            const isActive = pathname === `/${item.href}` || pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    "transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "truncate transition-opacity duration-300 ease-in-out",
                      isOpen ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        {canView(SystemModule.USERS) && (
          <div className={cn(isOpen ? "mt-4" : "mt-0")}>
            {isOpen ? (
              <h3
                className={cn(
                  "mb-2 px-4 text-xs font-semibold text-primary transition-opacity duration-300",
                  isOpen ? "opacity-100" : "opacity-0",
                )}
              >
                Gestión con Privilegios
              </h3>
            ) : (
              <Separator className="my-2" />
            )}
            <ul className="space-y-1 px-2">
              {/** Usuarios, Roles, Empresas links **/}
              {[
                { name: "Usuarios", href: "/users", icon: Users },
                { name: "Roles y Permisos", href: "/roles", icon: Shield },
                { name: "Tiendas", href: "/stores", icon: Building },
              ].map((link) => {
                const isActive = pathname === `/${link.href}` || pathname.startsWith(link.href)
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                        "transition-colors duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span
                        className={cn(
                          "truncate transition-opacity duration-300 ease-in-out",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {link.name}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="mt-6">
          {isOpen ? (
            <h3
              className={cn(
                "mb-2 px-3 text-xs font-semibold text-primary transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0",
              )}
            >
              Gestión Administrativa
            </h3>
          ) : (
            <Separator className="my-2" />
          )}
          <ul className="space-y-1 px-2">
            {adminNavigation.map((item) => {
              const isActive = pathname === `/${item.href}` || pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      "transition-colors duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span
                      className={cn(
                        "truncate transition-opacity duration-300 ease-in-out",
                        isOpen ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}
