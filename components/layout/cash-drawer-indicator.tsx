"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, DollarSign } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useCashDrawer } from "@/lib/context/cash-drawer-context"

export function CashDrawerIndicator() {
  const { cashDrawer, isLoading } = useCashDrawer()

  if (isLoading || !cashDrawer) return null

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 py-1.5">
        <DollarSign className="h-3.5 w-3.5" />
        <span>Caja abierta desde {format(new Date(cashDrawer.openedAt), "HH:mm", { locale: es })}</span>
      </Badge>
      <Link href="/pos">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <ShoppingCart className="h-4 w-4" />
          <span>Ir a POS</span>
        </Button>
      </Link>
    </div>
  )
}
