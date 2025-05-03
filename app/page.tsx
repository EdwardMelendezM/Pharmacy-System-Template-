import { ModuleCard } from "@/components/dashboard/module-card"
import { Users, Calculator, Receipt, Package, ShoppingCart, Settings } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          title="Users & Companies"
          description="Manage users, roles, and company profiles"
          icon={<Users className="h-6 w-6" />}
          href="/users"
        />
        <ModuleCard
          title="Accounting"
          description="Financial reports, ledgers, and transactions"
          icon={<Calculator className="h-6 w-6" />}
          href="/accounting"
        />
        <ModuleCard
          title="Billing"
          description="Invoices, payments, and billing history"
          icon={<Receipt className="h-6 w-6" />}
          href="/billing"
        />
        <ModuleCard
          title="Inventory"
          description="Stock management, products, and suppliers"
          icon={<Package className="h-6 w-6" />}
          href="/inventory"
        />
        <ModuleCard
          title="Point of Sale"
          description="Sales, transactions, and customer checkout"
          icon={<ShoppingCart className="h-6 w-6" />}
          href="/pos"
        />
        <ModuleCard
          title="Settings"
          description="System configuration and preferences"
          icon={<Settings className="h-6 w-6" />}
          href="/settings"
        />
      </div>
    </div>
  )
}
