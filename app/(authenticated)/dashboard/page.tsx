import { ModuleCard } from "@/components/dashboard/module-card"
import { Users, Calculator, Receipt, Package, ShoppingCart, Settings } from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Dashboard({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de control</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          title="Usuarios"
          description="Gestión de usuarios del sistema"
          icon={<Users className="h-6 w-6" />}
          href={`/${locale}/users`}
        />
        <ModuleCard
          title="Contabilidad"
          description="Resumen y control financiero"
          icon={<Calculator className="h-6 w-6" />}
          href={`/${locale}/accounting`}
        />
        <ModuleCard
          title="Facturación"
          description="Emite y revisa facturas"
          icon={<Receipt className="h-6 w-6" />}
          href={`/${locale}/billing`}
        />
        <ModuleCard
          title="Inventario"
          description="Controla tu stock y productos"
          icon={<Package className="h-6 w-6" />}
          href={`/${locale}/inventory`}
        />
        <ModuleCard
          title="Punto de venta"
          description="Realiza ventas directamente"
          icon={<ShoppingCart className="h-6 w-6" />}
          href={`/${locale}/pos`}
        />
        <ModuleCard
          title="Configuraciones"
          description="Ajusta la configuración del sistema"
          icon={<Settings className="h-6 w-6" />}
          href={`/${locale}/settings`}
        />
      </div>
    </div>
  )
}
