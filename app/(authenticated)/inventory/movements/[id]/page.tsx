/**
 * Página de Detalle de Movimiento de Inventario
 *
 * Esta página muestra el detalle completo de un movimiento específico
 * de inventario identificado por su ID.
 */
"use client"

import { MovementDetail } from "@/modules/inventory/components/movement-detail"

interface MovementDetailPageProps {
  params: {
    id: string
  }
}

export default function MovementDetailPage({ params }: MovementDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <MovementDetail transactionId={params.id} />
    </div>
  )
}
