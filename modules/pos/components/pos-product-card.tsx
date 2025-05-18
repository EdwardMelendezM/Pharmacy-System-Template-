"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/models/pos"
import { formatCurrency } from "@/lib/utils"

interface POSProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function POSProductCard({ product, onSelect }: POSProductCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(product)}>
      <CardContent className="p-3">
        <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center text-muted-foreground text-xs">
          {product.imageUrl ? (
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            product.categoryName
          )}
        </div>
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground">{product.sku}</p>
          <p className="text-sm font-medium">{formatCurrency(product.price)}</p>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Stock: {product.stock}</div>
      </CardContent>
    </Card>
  )
}
