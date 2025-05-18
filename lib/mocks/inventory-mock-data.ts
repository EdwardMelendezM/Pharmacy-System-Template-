/**
 * Datos de ejemplo para el sistema de inventario
 *
 * Este archivo contiene datos de ejemplo para demostrar
 * la funcionalidad del sistema de inventario.
 */

import {
  type Product,
  type Category,
  type Warehouse,
  type WarehouseLocation,
  type Supplier,
  type UnitOfMeasure,
  type ProductStock,
  type ProductLot,
  type InventoryTransaction,
  InventoryTransactionType,
  ProductStatus,
  UnitOfMeasureType,
} from "../models/inventory"

// Categorías de productos
export const mockCategories: Category[] = [
  {
    id: "cat_1",
    name: "Analgésicos",
    description: "Medicamentos para aliviar el dolor",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "cat_2",
    name: "Antibióticos",
    description: "Medicamentos para tratar infecciones bacterianas",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "cat_3",
    name: "Antiinflamatorios",
    description: "Medicamentos para reducir la inflamación",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "cat_4",
    name: "Antihistamínicos",
    description: "Medicamentos para tratar alergias",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "cat_5",
    name: "Vitaminas y Suplementos",
    description: "Suplementos nutricionales",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "cat_6",
    name: "Higiene y Cuidado Personal",
    description: "Productos para higiene personal",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
]

// Almacenes
export const mockWarehouses: Warehouse[] = [
  {
    id: "wh_1",
    code: "MAIN",
    name: "Almacén Principal",
    address: "Calle Principal 123, Ciudad",
    isDefault: true,
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "wh_2",
    code: "SEC",
    name: "Almacén Secundario",
    address: "Avenida Secundaria 456, Ciudad",
    isDefault: false,
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
]

// Ubicaciones dentro de almacenes
export const mockLocations: WarehouseLocation[] = [
  // Almacén Principal
  {
    id: "loc_1",
    warehouseId: "wh_1",
    code: "A-01-01",
    name: "Estantería A, Pasillo 1, Nivel 1",
    type: "storage",
    status: "active",
  },
  {
    id: "loc_2",
    warehouseId: "wh_1",
    code: "A-01-02",
    name: "Estantería A, Pasillo 1, Nivel 2",
    type: "storage",
    status: "active",
  },
  {
    id: "loc_3",
    warehouseId: "wh_1",
    code: "A-02-01",
    name: "Estantería A, Pasillo 2, Nivel 1",
    type: "storage",
    status: "active",
  },
  {
    id: "loc_4",
    warehouseId: "wh_1",
    code: "REC-01",
    name: "Área de Recepción 1",
    type: "receiving",
    status: "active",
  },
  {
    id: "loc_5",
    warehouseId: "wh_1",
    code: "QUA-01",
    name: "Área de Cuarentena",
    type: "quarantine",
    status: "active",
  },

  // Almacén Secundario
  {
    id: "loc_6",
    warehouseId: "wh_2",
    code: "B-01-01",
    name: "Estantería B, Pasillo 1, Nivel 1",
    type: "storage",
    status: "active",
  },
  {
    id: "loc_7",
    warehouseId: "wh_2",
    code: "B-01-02",
    name: "Estantería B, Pasillo 1, Nivel 2",
    type: "storage",
    status: "active",
  },
]

// Proveedores
export const mockSuppliers: Supplier[] = [
  {
    id: "sup_1",
    code: "PHARM001",
    name: "PharmaCorp Inc.",
    contactPerson: "John Smith",
    email: "contact@pharmacorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Pharma St, Medical District, NY 10001",
    taxId: "123456789",
    paymentTerms: "Net 30",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "sup_2",
    code: "MEDI002",
    name: "MediSupply Co.",
    contactPerson: "Jane Doe",
    email: "info@medisupply.com",
    phone: "+1 (555) 987-6543",
    address: "456 Health Ave, Care City, CA 90210",
    taxId: "987654321",
    paymentTerms: "Net 45",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "sup_3",
    code: "GLOB003",
    name: "Global Pharmaceuticals",
    contactPerson: "Robert Johnson",
    email: "sales@globalpharm.com",
    phone: "+1 (555) 456-7890",
    address: "789 Medicine Blvd, Wellness Town, TX 75001",
    taxId: "456789123",
    paymentTerms: "Net 15",
    status: "active",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
]

// Unidades de medida
export const mockUnitsOfMeasure: UnitOfMeasure[] = [
  // Unidades de cantidad
  {
    id: "uom_1",
    code: "UNIT",
    name: "Unidad",
    type: UnitOfMeasureType.QUANTITY,
    baseUnit: true,
  },
  {
    id: "uom_2",
    code: "BOX",
    name: "Caja",
    type: UnitOfMeasureType.QUANTITY,
    baseUnit: false,
    conversionFactor: 100,
    baseUnitId: "uom_1",
  },
  {
    id: "uom_3",
    code: "CASE",
    name: "Estuche",
    type: UnitOfMeasureType.QUANTITY,
    baseUnit: false,
    conversionFactor: 10,
    baseUnitId: "uom_1",
  },

  // Unidades de peso
  {
    id: "uom_4",
    code: "G",
    name: "Gramo",
    type: UnitOfMeasureType.WEIGHT,
    baseUnit: true,
  },
  {
    id: "uom_5",
    code: "KG",
    name: "Kilogramo",
    type: UnitOfMeasureType.WEIGHT,
    baseUnit: false,
    conversionFactor: 1000,
    baseUnitId: "uom_4",
  },

  // Unidades de volumen
  {
    id: "uom_6",
    code: "ML",
    name: "Mililitro",
    type: UnitOfMeasureType.VOLUME,
    baseUnit: true,
  },
  {
    id: "uom_7",
    code: "L",
    name: "Litro",
    type: UnitOfMeasureType.VOLUME,
    baseUnit: false,
    conversionFactor: 1000,
    baseUnitId: "uom_6",
  },
]

// Productos
export const mockProducts: Product[] = [
  {
    id: "prod_1",
    tenantId: "tenant_1",
    sku: "MED001",
    barcode: "7501234567890",
    name: "Paracetamol 500mg",
    description: "Analgésico y antipirético. Caja con 20 tabletas.",
    categoryId: "cat_1",
    categoryName: "Analgésicos",
    brandId: "brand_1",
    brandName: "PharmaBrand",

    purchaseUnitId: "uom_2", // Caja
    purchaseUnitCode: "BOX",
    salesUnitId: "uom_1", // Unidad
    salesUnitCode: "UNIT",
    inventoryUnitId: "uom_1", // Unidad
    inventoryUnitCode: "UNIT",

    costPrice: 2.5,
    salesPrice: 5.99,
    taxRate: 0.16,
    taxIncluded: true,

    trackInventory: true,
    minStockLevel: 100,
    maxStockLevel: 1000,
    reorderPoint: 200,
    reorderQuantity: 500,
    leadTime: 5,

    lotTracking: true,
    expiryTracking: true,
    shelfLife: 730, // 2 años en días

    weight: 0.05,
    weightUnitId: "uom_4", // Gramo

    status: ProductStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),

    requiresPrescription: false,
    activeIngredient: "Paracetamol",
    dosage: "500mg",
    contraindications: "Hipersensibilidad al paracetamol, insuficiencia hepatocelular grave.",
    storageConditions: "Almacenar a temperatura ambiente, proteger de la luz y humedad.",
  },
  {
    id: "prod_2",
    tenantId: "tenant_1",
    sku: "MED002",
    barcode: "7509876543210",
    name: "Ibuprofeno 400mg",
    description: "Antiinflamatorio no esteroideo. Caja con 30 tabletas.",
    categoryId: "cat_3",
    categoryName: "Antiinflamatorios",
    brandId: "brand_2",
    brandName: "MediPharm",

    purchaseUnitId: "uom_2", // Caja
    purchaseUnitCode: "BOX",
    salesUnitId: "uom_1", // Unidad
    salesUnitCode: "UNIT",
    inventoryUnitId: "uom_1", // Unidad
    inventoryUnitCode: "UNIT",

    costPrice: 3.25,
    salesPrice: 7.5,
    taxRate: 0.16,
    taxIncluded: true,

    trackInventory: true,
    minStockLevel: 80,
    maxStockLevel: 800,
    reorderPoint: 150,
    reorderQuantity: 400,
    leadTime: 4,

    lotTracking: true,
    expiryTracking: true,
    shelfLife: 1095, // 3 años en días

    weight: 0.06,
    weightUnitId: "uom_4", // Gramo

    status: ProductStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),

    requiresPrescription: false,
    activeIngredient: "Ibuprofeno",
    dosage: "400mg",
    contraindications: "Hipersensibilidad al ibuprofeno, úlcera péptica activa, insuficiencia renal grave.",
    storageConditions: "Almacenar a temperatura ambiente, proteger de la luz y humedad.",
  },
  {
    id: "prod_3",
    tenantId: "tenant_1",
    sku: "MED003",
    barcode: "7501122334455",
    name: "Omeprazol 20mg",
    description: "Inhibidor de la bomba de protones. Caja con 14 cápsulas.",
    categoryId: "cat_2",
    categoryName: "Gastrointestinales",
    brandId: "brand_3",
    brandName: "GastroHealth",

    purchaseUnitId: "uom_2", // Caja
    purchaseUnitCode: "BOX",
    salesUnitId: "uom_1", // Unidad
    salesUnitCode: "UNIT",
    inventoryUnitId: "uom_1", // Unidad
    inventoryUnitCode: "UNIT",

    costPrice: 5.5,
    salesPrice: 12.75,
    taxRate: 0.16,
    taxIncluded: true,

    trackInventory: true,
    minStockLevel: 50,
    maxStockLevel: 500,
    reorderPoint: 100,
    reorderQuantity: 250,
    leadTime: 6,

    lotTracking: true,
    expiryTracking: true,
    shelfLife: 730, // 2 años en días

    weight: 0.04,
    weightUnitId: "uom_4", // Gramo

    status: ProductStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),

    requiresPrescription: false,
    activeIngredient: "Omeprazol",
    dosage: "20mg",
    contraindications: "Hipersensibilidad al omeprazol o a cualquiera de los excipientes.",
    storageConditions: "Almacenar a temperatura ambiente, proteger de la luz y humedad.",
  },
  {
    id: "prod_4",
    tenantId: "tenant_1",
    sku: "MED004",
    barcode: "7506677889900",
    name: "Loratadina 10mg",
    description: "Antihistamínico. Caja con 10 tabletas.",
    categoryId: "cat_4",
    categoryName: "Antihistamínicos",
    brandId: "brand_1",
    brandName: "PharmaBrand",

    purchaseUnitId: "uom_2", // Caja
    purchaseUnitCode: "BOX",
    salesUnitId: "uom_1", // Unidad
    salesUnitCode: "UNIT",
    inventoryUnitId: "uom_1", // Unidad
    inventoryUnitCode: "UNIT",

    costPrice: 3.75,
    salesPrice: 8.25,
    taxRate: 0.16,
    taxIncluded: true,

    trackInventory: true,
    minStockLevel: 60,
    maxStockLevel: 600,
    reorderPoint: 120,
    reorderQuantity: 300,
    leadTime: 5,

    lotTracking: true,
    expiryTracking: true,
    shelfLife: 1095, // 3 años en días

    weight: 0.03,
    weightUnitId: "uom_4", // Gramo

    status: ProductStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),

    requiresPrescription: false,
    activeIngredient: "Loratadina",
    dosage: "10mg",
    contraindications: "Hipersensibilidad a la loratadina o a cualquiera de los excipientes.",
    storageConditions: "Almacenar a temperatura ambiente, proteger de la luz y humedad.",
  },
  {
    id: "prod_5",
    tenantId: "tenant_1",
    sku: "VIT001",
    barcode: "7503344556677",
    name: "Vitamina C 1000mg",
    description: "Suplemento vitamínico. Frasco con 30 tabletas efervescentes.",
    categoryId: "cat_5",
    categoryName: "Vitaminas y Suplementos",
    brandId: "brand_4",
    brandName: "VitaPlus",

    purchaseUnitId: "uom_3", // Estuche
    purchaseUnitCode: "CASE",
    salesUnitId: "uom_1", // Unidad
    salesUnitCode: "UNIT",
    inventoryUnitId: "uom_1", // Unidad
    inventoryUnitCode: "UNIT",

    costPrice: 7.25,
    salesPrice: 15.5,
    taxRate: 0.16,
    taxIncluded: true,

    trackInventory: true,
    minStockLevel: 40,
    maxStockLevel: 400,
    reorderPoint: 80,
    reorderQuantity: 200,
    leadTime: 7,

    lotTracking: true,
    expiryTracking: true,
    shelfLife: 730, // 2 años en días

    weight: 0.1,
    weightUnitId: "uom_4", // Gramo

    status: ProductStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),

    requiresPrescription: false,
    activeIngredient: "Ácido ascórbico",
    dosage: "1000mg",
    contraindications: "Hipersensibilidad al ácido ascórbico o a cualquiera de los excipientes.",
    storageConditions: "Almacenar en lugar fresco y seco.",
  },
  {
    id: "prod_6",
    tenantId: "tenant_1",
    sku: "HIG001",
    barcode: "7508899001122",
    name: "Alcohol 70% 500ml",
    description: "Antiséptico. Botella con 500ml.",
    categoryId: "cat_6",
    categoryName: "Higiene y Cuidado Personal",
    brandId: "brand_5",
    brandName: "CleanCare",

    purchaseUnitId: "uom_3", // Estuche
    purchaseUnitCode: "CASE",
    salesUnitId: "uom_1", // Unidad
    salesUnitCode: "UNIT",
    inventoryUnitId: "uom_1", // Unidad
    inventoryUnitCode: "UNIT",

    costPrice: 1.75,
    salesPrice: 4.5,
    taxRate: 0.16,
    taxIncluded: true,

    trackInventory: true,
    minStockLevel: 30,
    maxStockLevel: 300,
    reorderPoint: 60,
    reorderQuantity: 150,
    leadTime: 4,

    lotTracking: true,
    expiryTracking: true,
    shelfLife: 1095, // 3 años en días

    weight: 0.5,
    weightUnitId: "uom_5", // Kilogramo

    status: ProductStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),

    requiresPrescription: false,
    activeIngredient: "Alcohol etílico",
    dosage: "70%",
    contraindications: "Uso externo únicamente. No ingerir.",
    storageConditions: "Almacenar en lugar fresco y seco, lejos de fuentes de calor o llamas.",
  },
]

// Stock de productos
export const mockProductStock: ProductStock[] = [
  // Paracetamol en Almacén Principal
  {
    id: "stock_1",
    productId: "prod_1",
    warehouseId: "wh_1",
    locationId: "loc_1",
    quantity: 500,
    reservedQuantity: 0,
    availableQuantity: 500,
    updatedAt: new Date("2023-01-15"),
  },
  // Paracetamol en Almacén Secundario
  {
    id: "stock_2",
    productId: "prod_1",
    warehouseId: "wh_2",
    locationId: "loc_6",
    quantity: 200,
    reservedQuantity: 0,
    availableQuantity: 200,
    updatedAt: new Date("2023-01-15"),
  },
  // Ibuprofeno en Almacén Principal
  {
    id: "stock_3",
    productId: "prod_2",
    warehouseId: "wh_1",
    locationId: "loc_2",
    quantity: 350,
    reservedQuantity: 0,
    availableQuantity: 350,
    updatedAt: new Date("2023-01-15"),
  },
  // Omeprazol en Almacén Principal
  {
    id: "stock_4",
    productId: "prod_3",
    warehouseId: "wh_1",
    locationId: "loc_3",
    quantity: 80,
    reservedQuantity: 0,
    availableQuantity: 80,
    updatedAt: new Date("2023-01-15"),
  },
  // Loratadina en Almacén Secundario
  {
    id: "stock_5",
    productId: "prod_4",
    warehouseId: "wh_2",
    locationId: "loc_7",
    quantity: 150,
    reservedQuantity: 0,
    availableQuantity: 150,
    updatedAt: new Date("2023-01-15"),
  },
  // Vitamina C en Almacén Principal
  {
    id: "stock_6",
    productId: "prod_5",
    warehouseId: "wh_1",
    locationId: "loc_1",
    quantity: 100,
    reservedQuantity: 0,
    availableQuantity: 100,
    updatedAt: new Date("2023-01-15"),
  },
  // Alcohol en Almacén Principal
  {
    id: "stock_7",
    productId: "prod_6",
    warehouseId: "wh_1",
    locationId: "loc_2",
    quantity: 75,
    reservedQuantity: 0,
    availableQuantity: 75,
    updatedAt: new Date("2023-01-15"),
  },
]

// Lotes de productos
export const mockProductLots: ProductLot[] = [
  // Lotes de Paracetamol
  {
    id: "lot_1",
    productId: "prod_1",
    lotNumber: "LOT-P-001",
    expiryDate: new Date("2025-01-15"),
    manufacturingDate: new Date("2023-01-15"),
    supplierLotNumber: "SUP-123456",
    supplierId: "sup_1",
    purchaseOrderId: "po_1",
    receivedDate: new Date("2023-01-20"),
    cost: 2.5,
    quantity: 300,
    remainingQuantity: 250,
    status: "active",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "lot_2",
    productId: "prod_1",
    lotNumber: "LOT-P-002",
    expiryDate: new Date("2025-03-10"),
    manufacturingDate: new Date("2023-03-10"),
    supplierLotNumber: "SUP-234567",
    supplierId: "sup_1",
    purchaseOrderId: "po_2",
    receivedDate: new Date("2023-03-15"),
    cost: 2.5,
    quantity: 400,
    remainingQuantity: 400,
    status: "active",
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },

  // Lotes de Ibuprofeno
  {
    id: "lot_3",
    productId: "prod_2",
    lotNumber: "LOT-I-001",
    expiryDate: new Date("2025-02-20"),
    manufacturingDate: new Date("2023-02-20"),
    supplierLotNumber: "SUP-345678",
    supplierId: "sup_2",
    purchaseOrderId: "po_3",
    receivedDate: new Date("2023-02-25"),
    cost: 3.25,
    quantity: 350,
    remainingQuantity: 350,
    status: "active",
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-02-25"),
  },

  // Lotes de Omeprazol
  {
    id: "lot_4",
    productId: "prod_3",
    lotNumber: "LOT-O-001",
    expiryDate: new Date("2024-12-05"),
    manufacturingDate: new Date("2022-12-05"),
    supplierLotNumber: "SUP-456789",
    supplierId: "sup_3",
    purchaseOrderId: "po_4",
    receivedDate: new Date("2022-12-10"),
    cost: 5.5,
    quantity: 100,
    remainingQuantity: 80,
    status: "active",
    createdAt: new Date("2022-12-10"),
    updatedAt: new Date("2022-12-10"),
  },
]

// Transacciones de inventario
export const mockInventoryTransactions: InventoryTransaction[] = [
  // Recepción de Paracetamol
  {
    id: "trans_1",
    transactionType: InventoryTransactionType.PURCHASE,
    referenceNumber: "PO-001",
    referenceId: "po_1",
    date: new Date("2023-01-20"),
    notes: "Recepción de compra de Paracetamol",
    createdBy: "user_1",
    createdAt: new Date("2023-01-20"),
    status: "completed",
    items: [
      {
        id: "item_1",
        transactionId: "trans_1",
        productId: "prod_1",
        lotId: "lot_1",
        warehouseId: "wh_1",
        locationId: "loc_1",
        quantity: 300,
        unitCost: 2.5,
        totalCost: 750,
        expiryDate: new Date("2025-01-15"),
        notes: "Recepción inicial",
      },
    ],
  },

  // Venta de Paracetamol
  {
    id: "trans_2",
    transactionType: InventoryTransactionType.SALE,
    referenceNumber: "INV-001",
    referenceId: "inv_1",
    date: new Date("2023-01-25"),
    notes: "Venta de Paracetamol",
    createdBy: "user_1",
    createdAt: new Date("2023-01-25"),
    status: "completed",
    items: [
      {
        id: "item_2",
        transactionId: "trans_2",
        productId: "prod_1",
        lotId: "lot_1",
        warehouseId: "wh_1",
        locationId: "loc_1",
        quantity: 50,
        unitCost: 2.5,
        totalCost: 125,
        notes: "Venta a cliente",
      },
    ],
  },

  // Recepción de Ibuprofeno
  {
    id: "trans_3",
    transactionType: InventoryTransactionType.PURCHASE,
    referenceNumber: "PO-003",
    referenceId: "po_3",
    date: new Date("2023-02-25"),
    notes: "Recepción de compra de Ibuprofeno",
    createdBy: "user_1",
    createdAt: new Date("2023-02-25"),
    status: "completed",
    items: [
      {
        id: "item_3",
        transactionId: "trans_3",
        productId: "prod_2",
        lotId: "lot_3",
        warehouseId: "wh_1",
        locationId: "loc_2",
        quantity: 350,
        unitCost: 3.25,
        totalCost: 1137.5,
        expiryDate: new Date("2025-02-20"),
        notes: "Recepción inicial",
      },
    ],
  },

  // Transferencia de Paracetamol entre almacenes
  {
    id: "trans_4",
    transactionType: InventoryTransactionType.TRANSFER,
    date: new Date("2023-02-10"),
    notes: "Transferencia de Paracetamol al almacén secundario",
    createdBy: "user_1",
    createdAt: new Date("2023-02-10"),
    status: "completed",
    items: [
      {
        id: "item_4",
        transactionId: "trans_4",
        productId: "prod_1",
        lotId: "lot_1",
        warehouseId: "wh_2",
        locationId: "loc_6",
        fromWarehouseId: "wh_1",
        fromLocationId: "loc_1",
        quantity: 200,
        notes: "Transferencia entre almacenes",
      },
    ],
  },
]
