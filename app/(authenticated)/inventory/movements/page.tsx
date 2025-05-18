/**
 * Página de Movimientos de Inventario
 *
 * Esta página muestra un listado de todos los movimientos de inventario
 * con opciones de filtrado y visualización detallada.
 */
"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { InventoryMovements } from "@/modules/inventory/components/inventory-movements"

export default function InventoryMovementsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const typeParam = searchParams.get("type")

  // Efecto para manejar el parámetro de tipo de movimiento
  useEffect(() => {
    // Este efecto se puede usar para inicializar cualquier estado
    // basado en los parámetros de la URL
    console.log("Tipo de movimiento seleccionado:", typeParam)

    // Aquí podríamos realizar acciones adicionales basadas en el tipo
    // como precargar datos específicos o configurar filtros
  }, [typeParam])

  return (
    <div className="container mx-auto py-6">
      <InventoryMovements initialFilter={typeParam || ""} />
      {/* Aquí podrías agregar más componentes o lógica según sea necesario */}
    </div>
  )
}
