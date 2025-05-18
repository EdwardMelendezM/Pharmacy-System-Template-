"use server"

import { revalidatePath } from "next/cache"
import type { CashDrawer, POSOrder, POSOrderItem, PaymentMethod, Product } from "../models/pos"

// Generate uuid function
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Mock database para propósitos de demostración
const cashDrawers: CashDrawer[] = [
  {
    id: generateUUID(),
    tenantId: "1",
    userId: "john.doe",
    userName: "John Doe",
    registerName: "Main Register",
    openingAmount: 100.0,
    closingAmount: null,
    openedAt: new Date(),
    closedAt: null,
    notes: null,
    status: "open",
    variance: null,
  },
  {
    id: generateUUID(),
    tenantId: "1",
    userId: "jane.smith",
    userName: "Jane Smith",
    registerName: "Secondary Register",
    openingAmount: 50.0,
    closingAmount: null,
    openedAt: new Date(),
    closedAt: null,
    notes: null,
    status: "open",
    variance: null,
  },
]
const orders: POSOrder[] = []

// Datos de productos de ejemplo
const products: Product[] = [
  {
    id: "1",
    tenantId: "1",
    name: "Paracetamol 500mg",
    description: "Analgésico y antipirético",
    sku: "MED001",
    barcode: "7501234567890",
    price: 5.99,
    cost: 2.5,
    taxRate: 0.16,
    categoryId: "1",
    categoryName: "Analgésicos",
    stock: 100,
    imageUrl: null,
  },
  {
    id: "2",
    tenantId: "1",
    name: "Ibuprofeno 400mg",
    description: "Antiinflamatorio no esteroideo",
    sku: "MED002",
    barcode: "7509876543210",
    price: 7.5,
    cost: 3.25,
    taxRate: 0.16,
    categoryId: "1",
    categoryName: "Analgésicos",
    stock: 85,
    imageUrl: null,
  },
  {
    id: "3",
    tenantId: "1",
    name: "Omeprazol 20mg",
    description: "Inhibidor de la bomba de protones",
    sku: "MED003",
    barcode: "7501122334455",
    price: 12.75,
    cost: 5.5,
    taxRate: 0.16,
    categoryId: "2",
    categoryName: "Gastrointestinales",
    stock: 50,
    imageUrl: null,
  },
  {
    id: "4",
    tenantId: "1",
    name: "Loratadina 10mg",
    description: "Antihistamínico",
    sku: "MED004",
    barcode: "7506677889900",
    price: 8.25,
    cost: 3.75,
    taxRate: 0.16,
    categoryId: "3",
    categoryName: "Alergias",
    stock: 75,
    imageUrl: null,
  },
  {
    id: "5",
    tenantId: "1",
    name: "Vitamina C 1000mg",
    description: "Suplemento vitamínico",
    sku: "VIT001",
    barcode: "7503344556677",
    price: 15.5,
    cost: 7.25,
    taxRate: 0.16,
    categoryId: "4",
    categoryName: "Vitaminas",
    stock: 120,
    imageUrl: null,
  },
  {
    id: "6",
    tenantId: "1",
    name: "Alcohol 70% 500ml",
    description: "Antiséptico",
    sku: "HIG001",
    barcode: "7508899001122",
    price: 4.5,
    cost: 1.75,
    taxRate: 0.16,
    categoryId: "5",
    categoryName: "Higiene",
    stock: 60,
    imageUrl: null,
  },
]

// 1. Abrir Caja
export async function openCashDrawer(data: {
  userId: string
  userName: string
  registerName: string
  openingAmount: number
  notes?: string
}) {
  try {
    // Verificar si ya existe una caja abierta para este usuario/registro
    const existingOpenDrawer = cashDrawers.find(
      (drawer) =>
        drawer.userId === data.userId && drawer.registerName === data.registerName && drawer.status === "open",
    )

    if (existingOpenDrawer) {
      return {
        success: false,
        message: "Ya existe una caja abierta para este usuario y registro",
        data: null,
      }
    }

    const newCashDrawer: CashDrawer = {
      id: "c1bdd438-d6b7-41b9-913b-7d0bc7bcf0f0",
      tenantId: "1", // En una app real, obtener esto de la sesión
      userId: data.userId,
      userName: data.userName,
      registerName: data.registerName,
      openingAmount: data.openingAmount,
      closingAmount: null,
      openedAt: new Date(),
      closedAt: null,
      notes: data.notes || null,
      status: "open",
      variance: null,
    }

    // En una app real, guardar en la base de datos
    cashDrawers.push(newCashDrawer)

    revalidatePath("/pos")

    return {
      success: true,
      message: "Caja abierta exitosamente",
      data: newCashDrawer,
    }
  } catch (error) {
    console.error("Error opening cash drawer:", error)
    return {
      success: false,
      message: "Error al abrir la caja",
      data: null,
    }
  }
}

// 2. Crear Orden/Venta
export async function createOrder(data: {
  cashDrawerId: string
  customerName?: string
  customerPhone?: string
  items: {
    productId: string
    quantity: number
  }[]
  paymentMethod: PaymentMethod
  discount?: number
}) {
  try {
    // Verificar si la caja existe y está abierta
    const cashDrawer = cashDrawers.find((drawer) => drawer.id === data.cashDrawerId && drawer.status === "open")

    if (!cashDrawer) {
      return {
        success: false,
        message: "No se encontró una caja abierta",
        data: null,
      }
    }

    // Procesar los elementos de la orden
    const orderItems: POSOrderItem[] = []
    let subtotal = 0

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)

      if (!product) {
        return {
          success: false,
          message: `Producto con ID ${item.productId} no encontrado`,
          data: null,
        }
      }

      // Verificar stock
      if (product.stock < item.quantity) {
        return {
          success: false,
          message: `Stock insuficiente para ${product.name}`,
          data: null,
        }
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        id: "c1bdd438-d6b7-41b9-913b-7d0bc7bcf0f1",
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        discount: 0, // Sin descuento a nivel de elemento por ahora
        total: itemTotal,
      })

      // Actualizar stock (en una app real, esto sería una transacción)
      product.stock -= item.quantity
    }

    // Aplicar descuento
    const discount = data.discount || 0

    // Asegurar que el descuento no exceda el subtotal
    const finalDiscount = Math.min(discount, subtotal)

    // Calcular impuesto y total
    const taxRate = 0.16 // 16% de impuesto
    const taxableAmount = subtotal - finalDiscount
    const tax = taxableAmount > 0 ? taxableAmount * taxRate : 0
    const total = taxableAmount + tax

    // Crear orden
    const newOrder: POSOrder = {
      id: "c1bdd438-d6b7-41b9-913b-7d0bc7bcf0f2",
      tenantId: "1", // En una app real, obtener esto de la sesión
      cashDrawerId: data.cashDrawerId,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      customerName: data.customerName || null,
      customerPhone: data.customerPhone || null,
      items: orderItems,
      subtotal,
      tax,
      discount: finalDiscount,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: "completed", // Asumir que el pago está completado
      createdAt: new Date(),
      createdBy: cashDrawer.userId,
    }

    // En una app real, guardar en la base de datos
    orders.push(newOrder)

    revalidatePath("/pos")

    return {
      success: true,
      message: "Orden creada exitosamente",
      data: newOrder,
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return {
      success: false,
      message: "Error al crear la orden",
      data: null,
    }
  }
}

// 3. Cerrar Caja
export async function closeCashDrawer(data: {
  cashDrawerId: string
  closingAmount: number
  notes?: string
}) {
  try {
    // Encontrar la caja
    const cashDrawerIndex = cashDrawers.findIndex(
      (drawer) => drawer.id === data.cashDrawerId && drawer.status === "open",
    )

    if (cashDrawerIndex === -1) {
      return {
        success: false,
        message: "No se encontró una caja abierta con ese ID",
        data: null,
      }
    }

    // Calcular monto esperado
    const drawerOrders = orders.filter(
      (order) =>
        order.cashDrawerId === data.cashDrawerId &&
        order.paymentStatus === "completed" &&
        order.paymentMethod === "cash", // Solo contar pagos en efectivo
    )

    const totalCashSales = drawerOrders.reduce((sum, order) => sum + order.total, 0)
    const expectedAmount = cashDrawers[cashDrawerIndex].openingAmount + totalCashSales
    const variance = data.closingAmount - expectedAmount

    // Actualizar caja
    const updatedCashDrawer: CashDrawer = {
      ...cashDrawers[cashDrawerIndex],
      closingAmount: data.closingAmount,
      closedAt: new Date(),
      notes: data.notes || cashDrawers[cashDrawerIndex].notes,
      status: "closed",
      variance,
    }

    // En una app real, actualizar en la base de datos
    cashDrawers[cashDrawerIndex] = updatedCashDrawer

    revalidatePath("/pos")

    return {
      success: true,
      message: "Caja cerrada exitosamente",
      data: {
        cashDrawer: updatedCashDrawer,
        summary: {
          openingAmount: updatedCashDrawer.openingAmount,
          totalCashSales,
          expectedAmount,
          actualAmount: data.closingAmount,
          variance,
        },
      },
    }
  } catch (error) {
    console.error("Error closing cash drawer:", error)
    return {
      success: false,
      message: "Error al cerrar la caja",
      data: null,
    }
  }
}

// 4. Obtener Caja Actual
export async function getCurrentCashDrawer(userId: string) {
  try {
    const currentDrawer = cashDrawers.find((drawer) => drawer.userId === userId && drawer.status === "open")

    return {
      success: true,
      data: currentDrawer || null,
    }
  } catch (error) {
    console.error("Error getting current cash drawer:", error)
    return {
      success: false,
      message: "Error al obtener la caja actual",
      data: null,
    }
  }
}

// 5. Buscar Productos
export async function searchProducts(query: string) {
  try {
    if (!query || query.length < 2) {
      return {
        success: true,
        data: products, // Devolver todos los productos si la consulta es muy corta
      }
    }

    const searchResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase()) ||
        (product.barcode && product.barcode.includes(query)),
    )

    return {
      success: true,
      data: searchResults,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return {
      success: false,
      message: "Error al buscar productos",
      data: [],
    }
  }
}

// 6. Obtener Órdenes por Caja
export async function getOrdersByCashDrawer(cashDrawerId: string) {
  try {
    const drawerOrders = orders.filter((order) => order.cashDrawerId === cashDrawerId)

    return {
      success: true,
      data: drawerOrders,
    }
  } catch (error) {
    console.error("Error getting orders by cash drawer:", error)
    return {
      success: false,
      message: "Error al obtener órdenes",
      data: [],
    }
  }
}

// 7. Obtener Todos los Productos
export async function getAllProducts() {
  try {
    return {
      success: true,
      data: products,
    }
  } catch (error) {
    console.error("Error getting all products:", error)
    return {
      success: false,
      message: "Error al obtener productos",
      data: [],
    }
  }
}
