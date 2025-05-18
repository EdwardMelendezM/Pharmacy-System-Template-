"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Users, Calculator, Receipt, Package, ShoppingCart, Settings, Home, Shield, Building } from "lucide-react"
import { SystemModule } from "@/lib/models/user"
import { usePermissions } from "@/hooks/use-permissions"
import { useSidebarMobile } from "@/hooks/use-sidebar-mobile"

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

export function SidebarMobile() {
  const pathname = usePathname()
  const { canView } = usePermissions()
  const { isOpen, close } = useSidebarMobile()

  const filteredNav = navigation.filter((item) => canView(item.module))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()} modal={true}>
      <DialogContent className="p-0 w-full max-w-xs">
        <nav className="p-4 mt-5">
          <h3 className="mb-2 px-2 text-xs font-semibold text-primary">Modulos disponibles</h3>
          <ul className="space-y-2">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={close}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
            {canView(SystemModule.USERS) && (
              <>
                <li className="mt-4 mb-2 px-3 text-xs font-semibold text-primary">Gestión con Privilegios</li>
                <li>
                  <Link
                    href="/users"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base",
                      pathname === "/users"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={close}
                  >
                    <Users className="h-5 w-5" /> Usuarios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/users/roles"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base",
                      pathname === "/users/roles"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={close}
                  >
                    <Shield className="h-5 w-5" /> Roles y Permisos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/users/companies"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base",
                      pathname === "/users/companies"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Building className="h-5 w-5" /> Empresas
                  </Link>
                </li>
              </>
            )}
            <li className="mt-4 mb-2 px-3 text-xs font-semibold text-primary">Gestión Administrativa</li>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={close}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </DialogContent>
    </Dialog>
  )
}
