// Tipos para el sistema de punto de venta (POS)

// Tipo para la caja registradora
export interface CashDrawer {
  id: string
  tenantId: string
  userId: string
  userName: string
  registerName: string
  openingAmount: number
  closingAmount: number | null
  openedAt: Date
  closedAt: Date | null
  notes: string | null
  status: "open" | "closed"
  variance: number | null
}

// Tipo para los productos
export interface Product {
  id: string
  tenantId: string
  name: string
  description: string
  sku: string
  barcode: string | null
  price: number
  cost: number
  taxRate: number
  categoryId: string
  categoryName: string
  stock: number
  imageUrl: string | null
}

// Tipo para los elementos de una orden
export interface POSOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

// Tipo para los métodos de pago
export type PaymentMethod = "cash" | "card" | "transfer" | "other"

// Tipo para las órdenes/ventas
export interface POSOrder {
  id: string
  tenantId: string
  cashDrawerId: string
  orderNumber: string
  customerName: string | null
  customerPhone: string | null
  items: POSOrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: "pending" | "completed" | "cancelled" | "refunded"
  createdAt: Date
  createdBy: string
}
