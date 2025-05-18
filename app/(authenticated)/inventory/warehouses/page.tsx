/**
 * Warehouse Management Page
 *
 * This page provides a comprehensive interface for managing warehouses
 * and their locations in the inventory system.
 */

import { WarehouseManagement } from "@/modules/inventory/components/warehouse-management"

export default function WarehousesPage() {
  return (
    <div className="container mx-auto py-6">
      <WarehouseManagement />
    </div>
  )
}
