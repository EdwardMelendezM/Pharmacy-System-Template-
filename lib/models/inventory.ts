/**
 * Modelos de datos para el sistema de inventario
 *
 * Este archivo define la estructura de datos para el sistema de inventario,
 * incluyendo productos, categorías, ubicaciones, lotes, movimientos y más.
 */

// Tipos básicos para el inventario
export type ProductStatus = "active" | "inactive"
export type MovementType = "purchase" | "sale" | "adjustment"

// Modelo de producto simplificado
export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  category: string
  costPrice: number
  sellingPrice: number
  stock: number
  minStock: number
  requiresPrescription: boolean
  expiryDate?: Date
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}

// Modelo de movimiento de inventario
export interface InventoryMovement {
  id: string
  productId: string
  type: MovementType
  quantity: number
  date: Date
  notes?: string
  createdBy: string
}

// Modelo para categorías
export interface Category {
  id: string
  name: string
  description?: string
}

// Enumeraciones para tipos estándar
export enum InventoryTransactionType {
  PURCHASE = "purchase",
  SALE = "sale",
  ADJUSTMENT = "adjustment",
  TRANSFER = "transfer",
  RETURN_FROM_CUSTOMER = "return_from_customer",
  RETURN_TO_SUPPLIER = "return_to_supplier",
  INITIAL_COUNT = "initial_count",
  PHYSICAL_COUNT = "physical_count",
  PRODUCTION = "production",
  CONSUMPTION = "consumption",
  EXPIRY = "expiry",
  DAMAGE = "damage",
}

export enum UnitOfMeasureType {
  WEIGHT = "weight",
  VOLUME = "volume",
  QUANTITY = "quantity",
  LENGTH = "length",
  AREA = "area",
}

// Interfaces principales

export interface ProductAttribute {
  id: string
  name: string
  type: "text" | "number" | "boolean" | "date" | "select"
  required: boolean
  options?: string[] // Para tipo "select"
  defaultValue?: string | number | boolean | Date
}

export interface UnitOfMeasure {
  id: string
  code: string // Código único (ej: "KG", "L", "BOX")
  name: string
  type: UnitOfMeasureType
  baseUnit: boolean // Si es la unidad base para su tipo
  conversionFactor?: number // Factor de conversión a la unidad base
  baseUnitId?: string // ID de la unidad base a la que se convierte
}

export interface Supplier {
  id: string
  code: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  taxId?: string
  paymentTerms?: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface Warehouse {
  id: string
  code: string
  name: string
  address?: string
  isDefault: boolean
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface WarehouseLocation {
  id: string
  warehouseId: string
  code: string // Ej: "A-01-01" (Pasillo-Estante-Nivel)
  name?: string
  type?: "receiving" | "shipping" | "storage" | "quarantine" | "returns"
  status: "active" | "inactive"
}

export interface ProductStock {
  id: string
  productId: string
  warehouseId: string
  locationId?: string
  quantity: number
  reservedQuantity: number // Cantidad reservada para pedidos
  availableQuantity: number // quantity - reservedQuantity
  updatedAt: Date
}

export interface ProductLot {
  id: string
  productId: string
  lotNumber: string
  expiryDate?: Date
  manufacturingDate?: Date
  supplierLotNumber?: string
  supplierId?: string
  purchaseOrderId?: string
  receivedDate: Date
  cost: number
  quantity: number // Cantidad inicial recibida
  remainingQuantity: number // Cantidad actual disponible
  status: "active" | "quarantine" | "expired" | "depleted"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryTransaction {
  id: string
  transactionType: InventoryTransactionType
  referenceNumber?: string // Número de documento relacionado (factura, orden, etc.)
  referenceId?: string // ID del documento relacionado
  date: Date
  notes?: string
  createdBy: string
  createdAt: Date
  status: "draft" | "pending" | "approved" | "rejected" | "completed"
  items: InventoryTransactionItem[]
  supplier?: {
    email?: string
    name: string
    contactPerson?: string
    phone?: string
  }
}

export interface InventoryTransactionItem {
  id: string
  transactionId: string
  productId: string
  lotId?: string
  warehouseId: string
  locationId?: string
  fromWarehouseId?: string // Para transferencias
  fromLocationId?: string // Para transferencias
  quantity: number
  unitCost?: number
  totalCost?: number
  expiryDate?: Date
  notes?: string
  productName?: string
  lotNumber?: string
  locationName?: string
}

export interface InventoryCount {
  id: string
  warehouseId: string
  countNumber: string
  startDate: Date
  endDate?: Date
  status: "draft" | "in_progress" | "completed" | "cancelled"
  notes?: string
  createdBy: string
  createdAt: Date
  completedBy?: string
  completedAt?: Date
  items: InventoryCountItem[]
}

export interface InventoryCountItem {
  id: string
  countId: string
  productId: string
  locationId?: string
  lotId?: string
  expectedQuantity: number
  countedQuantity?: number
  variance?: number
  notes?: string
  status: "pending" | "counted" | "adjusted"
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName?: string
  orderDate: Date
  expectedDeliveryDate?: Date
  status: "draft" | "sent" | "partially_received" | "fully_received" | "cancelled"
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  items: PurchaseOrderItem[]

  // Totales
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
}

export interface PurchaseOrderItem {
  id: string
  orderId: string
  productId: string
  productName?: string
  sku?: string
  quantity: number
  receivedQuantity: number
  unitPrice: number
  unitOfMeasureId: string
  unitOfMeasureCode?: string
  taxRate: number
  discountPercent?: number
  discountAmount?: number
  lineTotal: number
  notes?: string
}

export interface GoodsReceipt {
  id: string
  receiptNumber: string
  purchaseOrderId?: string
  supplierId: string
  supplierName?: string
  receiptDate: Date
  warehouseId: string
  status: "draft" | "pending" | "approved" | "rejected"
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  items: GoodsReceiptItem[]
}

export interface GoodsReceiptItem {
  id: string
  receiptId: string
  purchaseOrderItemId?: string
  productId: string
  productName?: string
  lotNumber?: string
  expiryDate?: Date
  quantity: number
  unitOfMeasureId: string
  unitOfMeasureCode?: string
  unitCost: number
  totalCost: number
  locationId?: string
  notes?: string
}
