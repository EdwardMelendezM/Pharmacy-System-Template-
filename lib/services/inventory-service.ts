/**
 * Servicio básico de inventario para MVP
 */
import type { Product, InventoryMovement, Category, ProductStatus } from "../models/inventory"

// Datos de ejemplo para el MVP
const products: Product[] = [
  {
    id: "prod_1",
    sku: "MED001",
    name: "Paracetamol 500mg",
    description: "Analgésico y antipirético",
    category: "Analgésicos",
    costPrice: 5.5,
    sellingPrice: 10.99,
    stock: 150,
    minStock: 30,
    requiresPrescription: false,
    status: "active",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "prod_2",
    sku: "MED002",
    name: "Ibuprofeno 400mg",
    description: "Antiinflamatorio no esteroideo",
    category: "Antiinflamatorios",
    costPrice: 6.25,
    sellingPrice: 12.5,
    stock: 85,
    minStock: 25,
    requiresPrescription: false,
    status: "active",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "prod_3",
    sku: "MED003",
    name: "Amoxicilina 500mg",
    description: "Antibiótico de amplio espectro",
    category: "Antibióticos",
    costPrice: 15.75,
    sellingPrice: 28.99,
    stock: 42,
    minStock: 20,
    requiresPrescription: true,
    expiryDate: new Date("2024-06-30"),
    status: "active",
    createdAt: new Date("2023-02-05"),
    updatedAt: new Date("2023-02-05"),
  },
  {
    id: "prod_4",
    sku: "MED004",
    name: "Loratadina 10mg",
    description: "Antihistamínico",
    category: "Alergias",
    costPrice: 8.3,
    sellingPrice: 15.99,
    stock: 65,
    minStock: 15,
    requiresPrescription: false,
    status: "active",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "prod_5",
    sku: "MED005",
    name: "Omeprazol 20mg",
    description: "Inhibidor de la bomba de protones",
    category: "Gastrointestinal",
    costPrice: 9.15,
    sellingPrice: 18.5,
    stock: 10,
    minStock: 20,
    requiresPrescription: false,
    status: "active",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-01"),
  },
]

const movements: InventoryMovement[] = [
  {
    id: "mov_1",
    productId: "prod_1",
    type: "purchase",
    quantity: 50,
    date: new Date("2023-04-10"),
    notes: "Compra inicial",
    createdBy: "admin",
  },
  {
    id: "mov_2",
    productId: "prod_1",
    type: "sale",
    quantity: -5,
    date: new Date("2023-04-12"),
    createdBy: "cashier1",
  },
  {
    id: "mov_3",
    productId: "prod_2",
    type: "purchase",
    quantity: 30,
    date: new Date("2023-04-15"),
    createdBy: "admin",
  },
]

const categories: Category[] = [
  { id: "cat_1", name: "Analgésicos", description: "Medicamentos para el dolor" },
  { id: "cat_2", name: "Antibióticos", description: "Medicamentos para infecciones" },
  { id: "cat_3", name: "Antiinflamatorios", description: "Medicamentos para inflamación" },
  { id: "cat_4", name: "Gastrointestinal", description: "Medicamentos para problemas digestivos" },
  { id: "cat_5", name: "Alergias", description: "Medicamentos para alergias" },
]

// Servicio de productos
export const ProductService = {
  // Obtener todos los productos
  getProducts: async (filters?: {
    search?: string
    category?: string
    lowStock?: boolean
    status?: ProductStatus
  }): Promise<Product[]> => {
    let result = [...products]

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(
          (p) => p.name.toLowerCase().includes(searchLower) || p.sku.toLowerCase().includes(searchLower),
        )
      }

      if (filters.category) {
        result = result.filter((p) => p.category === filters.category)
      }

      if (filters.lowStock) {
        result = result.filter((p) => p.stock <= p.minStock)
      }

      if (filters.status) {
        result = result.filter((p) => p.status === filters.status)
      }
    }

    return result
  },

  // Obtener un producto por ID
  getProductById: async (id: string): Promise<Product | null> => {
    return products.find((p) => p.id === id) || null
  },

  // Crear un nuevo producto
  createProduct: async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    products.push(newProduct)
    return newProduct
  },

  // Actualizar un producto
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null

    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date(),
    }

    return products[index]
  },

  // Eliminar un producto (cambiar estado a inactivo)
  deleteProduct: async (id: string): Promise<boolean> => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false

    products[index].status = "inactive"
    products[index].updatedAt = new Date()
    return true
  },
}

// Servicio de movimientos
export const MovementService = {
  // Obtener movimientos de un producto
  getProductMovements: async (productId: string): Promise<InventoryMovement[]> => {
    return movements.filter((m) => m.productId === productId)
  },

  // Crear un nuevo movimiento
  createMovement: async (movementData: Omit<InventoryMovement, "id">): Promise<InventoryMovement> => {
    const newMovement: InventoryMovement = {
      ...movementData,
      id: `mov_${Date.now()}`,
    }

    movements.push(newMovement)

    // Actualizar el stock del producto
    const productIndex = products.findIndex((p) => p.id === movementData.productId)
    if (productIndex !== -1) {
      products[productIndex].stock += movementData.quantity
      products[productIndex].updatedAt = new Date()
    }

    return newMovement
  },
}

// Servicio de categorías
export const CategoryService = {
  // Obtener todas las categorías
  getCategories: async (): Promise<Category[]> => {
    return categories
  },
}
