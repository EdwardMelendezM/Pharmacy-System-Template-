/**
 * Página de detalle de producto para MVP
 */
"use client"

import { ProductDetail } from "@/modules/inventory/components/product-detail"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  return <ProductDetail productId={productId} />
}
