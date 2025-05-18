/**
 * Warehouse Service
 *
 * This service handles all operations related to warehouses in the inventory system.
 * It provides CRUD operations and specialized functions for warehouse management.
 */

import type { Warehouse, WarehouseLocation } from "../models/inventory"

// Mock data for warehouses
const warehouses: Warehouse[] = [
  {
    id: "wh_1",
    code: "MAIN",
    name: "Almacén Principal",
    address: "Calle Principal 123, Ciudad",
    isDefault: true,
    status: "active",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "wh_2",
    code: "SEC",
    name: "Almacén Secundario",
    address: "Av. Secundaria 456, Ciudad",
    isDefault: false,
    status: "active",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    id: "wh_3",
    code: "DIST",
    name: "Centro de Distribución",
    address: "Zona Industrial, Lote 78, Ciudad",
    isDefault: false,
    status: "active",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-03-20"),
  },
]

// Mock data for warehouse locations
const warehouseLocations: WarehouseLocation[] = [
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
    code: "REC-01",
    name: "Área de Recepción 1",
    type: "receiving",
    status: "active",
  },
  {
    id: "loc_4",
    warehouseId: "wh_2",
    code: "B-01-01",
    name: "Estantería B, Pasillo 1, Nivel 1",
    type: "storage",
    status: "active",
  },
  {
    id: "loc_5",
    warehouseId: "wh_3",
    code: "QUA-01",
    name: "Área de Cuarentena",
    type: "quarantine",
    status: "active",
  },
]

/**
 * Service for warehouse management
 */
export const WarehouseService = {
  /**
   * Get all warehouses with optional filtering
   *
   * @param filters Optional filters for warehouses
   * @returns Promise resolving to filtered warehouses
   */
  getWarehouses: async (filters?: {
    search?: string
    status?: "active" | "inactive"
    includeLocations?: boolean
  }): Promise<Warehouse[]> => {
    let result = [...warehouses]

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(
          (w) => w.name.toLowerCase().includes(searchLower) || w.code.toLowerCase().includes(searchLower),
        )
      }

      if (filters.status) {
        result = result.filter((w) => w.status === filters.status)
      }
    }

    return result
  },

  /**
   * Get a warehouse by ID
   *
   * @param id Warehouse ID
   * @param includeLocations Whether to include locations
   * @returns Promise resolving to warehouse or null if not found
   */
  getWarehouseById: async (id: string, includeLocations = false): Promise<Warehouse | null> => {
    const warehouse = warehouses.find((w) => w.id === id)

    if (!warehouse) return null

    return warehouse
  },

  /**
   * Get locations for a specific warehouse
   *
   * @param warehouseId Warehouse ID
   * @param filters Optional filters for locations
   * @returns Promise resolving to filtered locations
   */
  getWarehouseLocations: async (
    warehouseId: string,
    filters?: {
      search?: string
      type?: "receiving" | "shipping" | "storage" | "quarantine" | "returns"
      status?: "active" | "inactive"
    },
  ): Promise<WarehouseLocation[]> => {
    let result = warehouseLocations.filter((loc) => loc.warehouseId === warehouseId)

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(
          (loc) =>
            loc.name?.toLowerCase().includes(searchLower) || false || loc.code.toLowerCase().includes(searchLower),
        )
      }

      if (filters.type) {
        result = result.filter((loc) => loc.type === filters.type)
      }

      if (filters.status) {
        result = result.filter((loc) => loc.status === filters.status)
      }
    }

    return result
  },

  /**
   * Create a new warehouse
   *
   * @param warehouseData Warehouse data without ID, createdAt, updatedAt
   * @returns Promise resolving to the created warehouse
   */
  createWarehouse: async (warehouseData: Omit<Warehouse, "id" | "createdAt" | "updatedAt">): Promise<Warehouse> => {
    // If this warehouse is set as default, update other warehouses
    if (warehouseData.isDefault) {
      warehouses.forEach((w) => {
        if (w.isDefault) {
          w.isDefault = false
          w.updatedAt = new Date()
        }
      })
    }

    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: `wh_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    warehouses.push(newWarehouse)
    return newWarehouse
  },

  /**
   * Update an existing warehouse
   *
   * @param id Warehouse ID
   * @param warehouseData Partial warehouse data to update
   * @returns Promise resolving to updated warehouse or null if not found
   */
  updateWarehouse: async (id: string, warehouseData: Partial<Warehouse>): Promise<Warehouse | null> => {
    const index = warehouses.findIndex((w) => w.id === id)
    if (index === -1) return null

    // If this warehouse is being set as default, update other warehouses
    if (warehouseData.isDefault) {
      warehouses.forEach((w, i) => {
        if (w.isDefault && i !== index) {
          w.isDefault = false
          w.updatedAt = new Date()
        }
      })
    }

    warehouses[index] = {
      ...warehouses[index],
      ...warehouseData,
      updatedAt: new Date(),
    }

    return warehouses[index]
  },

  /**
   * Delete a warehouse (set status to inactive)
   *
   * @param id Warehouse ID
   * @returns Promise resolving to success boolean
   */
  deleteWarehouse: async (id: string): Promise<boolean> => {
    const index = warehouses.findIndex((w) => w.id === id)
    if (index === -1) return false

    // Cannot delete the default warehouse
    if (warehouses[index].isDefault) {
      throw new Error("Cannot delete the default warehouse. Set another warehouse as default first.")
    }

    warehouses[index].status = "inactive"
    warehouses[index].updatedAt = new Date()
    return true
  },

  /**
   * Set a warehouse as the default
   *
   * @param id Warehouse ID to set as default
   * @returns Promise resolving to success boolean
   */
  setDefaultWarehouse: async (id: string): Promise<boolean> => {
    const index = warehouses.findIndex((w) => w.id === id)
    if (index === -1) return false

    // Update all warehouses
    warehouses.forEach((w, i) => {
      if (i === index) {
        w.isDefault = true
      } else if (w.isDefault) {
        w.isDefault = false
      }
      w.updatedAt = new Date()
    })

    return true
  },

  /**
   * Create a new warehouse location
   *
   * @param locationData Location data without ID
   * @returns Promise resolving to created location
   */
  createLocation: async (locationData: Omit<WarehouseLocation, "id">): Promise<WarehouseLocation> => {
    // Verify warehouse exists
    const warehouseExists = warehouses.some((w) => w.id === locationData.warehouseId && w.status === "active")

    if (!warehouseExists) {
      throw new Error("Warehouse not found or inactive")
    }

    const newLocation: WarehouseLocation = {
      ...locationData,
      id: `loc_${Date.now()}`,
    }

    warehouseLocations.push(newLocation)
    return newLocation
  },

  /**
   * Update a warehouse location
   *
   * @param id Location ID
   * @param locationData Partial location data to update
   * @returns Promise resolving to updated location or null if not found
   */
  updateLocation: async (
    id: string,
    locationData: Partial<Omit<WarehouseLocation, "id" | "warehouseId">>,
  ): Promise<WarehouseLocation | null> => {
    const index = warehouseLocations.findIndex((loc) => loc.id === id)
    if (index === -1) return null

    warehouseLocations[index] = {
      ...warehouseLocations[index],
      ...locationData,
    }

    return warehouseLocations[index]
  },

  /**
   * Delete a warehouse location (set status to inactive)
   *
   * @param id Location ID
   * @returns Promise resolving to success boolean
   */
  deleteLocation: async (id: string): Promise<boolean> => {
    const index = warehouseLocations.findIndex((loc) => loc.id === id)
    if (index === -1) return false

    warehouseLocations[index].status = "inactive"
    return true
  },

  /**
   * Get the default warehouse
   *
   * @returns Promise resolving to default warehouse or null if none found
   */
  getDefaultWarehouse: async (): Promise<Warehouse | null> => {
    return warehouses.find((w) => w.isDefault && w.status === "active") || null
  },
}
