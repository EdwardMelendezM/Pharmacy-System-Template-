"use client"

/**
 * Warehouse Management Component
 *
 * This component provides a comprehensive interface for managing warehouses
 * and their locations in the inventory system.
 */

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Building2,
  MapPin,
  Package,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { WarehouseService } from "@/lib/services/warehouse-service"
import type { Warehouse, WarehouseLocation } from "@/lib/models/inventory"

// PASO 1: Definir los tipos de estado como constantes para evitar errores de tipado
const ACTIVE_STATUS = "active" as const
const INACTIVE_STATUS = "inactive" as const
type WarehouseStatus = typeof ACTIVE_STATUS | typeof INACTIVE_STATUS

// PASO 2: Definir los tipos de ubicación como constantes
const LOCATION_TYPES = {
  RECEIVING: "receiving",
  SHIPPING: "shipping",
  STORAGE: "storage",
  QUARANTINE: "quarantine",
  RETURNS: "returns",
} as const
type LocationType = (typeof LOCATION_TYPES)[keyof typeof LOCATION_TYPES]

// PASO 3: Redefinir los esquemas Zod con tipos más estrictos
const warehouseFormSchema = z.object({
  code: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(10, "El código no puede exceder 10 caracteres")
    .refine((val) => /^[A-Za-z0-9-_]+$/.test(val), {
      message: "El código solo puede contener letras, números, guiones y guiones bajos",
    }),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().optional(),
  isDefault: z.boolean(),
  status: z.enum([ACTIVE_STATUS, INACTIVE_STATUS]),
})

const locationFormSchema = z.object({
  code: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(15, "El código no puede exceder 15 caracteres")
    .refine((val) => /^[A-Za-z0-9-_]+$/.test(val), {
      message: "El código solo puede contener letras, números, guiones y guiones bajos",
    }),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  type: z.enum([
    LOCATION_TYPES.RECEIVING,
    LOCATION_TYPES.SHIPPING,
    LOCATION_TYPES.STORAGE,
    LOCATION_TYPES.QUARANTINE,
    LOCATION_TYPES.RETURNS,
  ]),
  status: z.enum([ACTIVE_STATUS, INACTIVE_STATUS]),
})

// PASO 4: Definir los tipos inferidos de los esquemas
type WarehouseFormValues = z.infer<typeof warehouseFormSchema>
type LocationFormValues = z.infer<typeof locationFormSchema>

/**
 * Warehouse Management Component
 */
export function WarehouseManagement() {
  // State for warehouses and locations
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [locations, setLocations] = useState<WarehouseLocation[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationStats, setLocationStats] = useState<Record<string, number>>({})

  // Dialog states
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteWarehouseId, setDeleteWarehouseId] = useState<string | null>(null)
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<"warehouse" | "location">("warehouse")

  // PASO 5: Configurar los formularios con los valores por defecto correctos
  const warehouseForm = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      code: "",
      name: "",
      address: "",
      isDefault: false,
      status: ACTIVE_STATUS,
    },
  })

  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      code: "",
      name: "",
      type: LOCATION_TYPES.STORAGE,
      status: ACTIVE_STATUS,
    },
  })

  // Load warehouses on component mount
  useEffect(() => {
    loadWarehouses()
  }, [])

  // Load locations when a warehouse is selected
  useEffect(() => {
    if (selectedWarehouse) {
      loadLocations(selectedWarehouse.id)
    }
  }, [selectedWarehouse])

  // Calculate location statistics when locations change
  useEffect(() => {
    if (locations.length > 0) {
      calculateLocationStats()
    }
  }, [locations])

  // Calculate statistics for locations by type
  const calculateLocationStats = () => {
    const stats: Record<string, number> = {
      [LOCATION_TYPES.RECEIVING]: 0,
      [LOCATION_TYPES.SHIPPING]: 0,
      [LOCATION_TYPES.STORAGE]: 0,
      [LOCATION_TYPES.QUARANTINE]: 0,
      [LOCATION_TYPES.RETURNS]: 0,
    }

    locations.forEach((location) => {
      if (location.type && location.status === ACTIVE_STATUS) {
        stats[location.type] = (stats[location.type] || 0) + 1
      }
    })

    setLocationStats(stats)
  }

  // Load warehouses from service
  const loadWarehouses = async () => {
    setIsLoading(true)
    try {
      const data = await WarehouseService.getWarehouses({
        search: searchQuery,
        status: ACTIVE_STATUS,
      })
      setWarehouses(data)

      // Select the first warehouse by default if none is selected
      if (data.length > 0 && !selectedWarehouse) {
        setSelectedWarehouse(data[0])
      } else if (selectedWarehouse) {
        // Update the selected warehouse if it exists in the new data
        const updatedWarehouse = data.find((w) => w.id === selectedWarehouse.id)
        if (updatedWarehouse) {
          setSelectedWarehouse(updatedWarehouse)
        } else if (data.length > 0) {
          // If the selected warehouse no longer exists, select the first one
          setSelectedWarehouse(data[0])
        } else {
          setSelectedWarehouse(null)
        }
      }
    } catch (error) {
      console.error("Error loading warehouses:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los almacenes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load locations for a specific warehouse
  const loadLocations = async (warehouseId: string) => {
    try {
      const data = await WarehouseService.getWarehouseLocations(warehouseId)
      setLocations(data)
    } catch (error) {
      console.error("Error loading locations:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las ubicaciones",
        variant: "destructive",
      })
    }
  }

  // Handle warehouse selection
  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
  }

  // PASO 6: Actualizar las funciones de reset para usar los valores por defecto correctos
  const resetWarehouseForm = useCallback(() => {
    warehouseForm.reset({
      code: "",
      name: "",
      address: "",
      isDefault: false,
      status: ACTIVE_STATUS,
    })
    setIsEditing(false)
    setEditId(null)
  }, [warehouseForm])

  const resetLocationForm = useCallback(() => {
    locationForm.reset({
      code: "",
      name: "",
      type: LOCATION_TYPES.STORAGE,
      status: ACTIVE_STATUS,
    })
    setIsEditing(false)
    setEditId(null)
  }, [locationForm])

  // PASO 7: Asegurar que los valores de edición sean del tipo correcto
  const handleEditWarehouse = (warehouse: Warehouse) => {
    // Asegurarse de que el status sea uno de los valores permitidos
    const status: WarehouseStatus = warehouse.status === INACTIVE_STATUS ? INACTIVE_STATUS : ACTIVE_STATUS

    warehouseForm.reset({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address || "",
      isDefault: warehouse.isDefault,
      status: status,
    })
    setIsEditing(true)
    setEditId(warehouse.id)
    setWarehouseDialogOpen(true)
  }

  const handleEditLocation = (location: WarehouseLocation) => {
    // Asegurarse de que el tipo sea uno de los valores permitidos
    const locationType = Object.values(LOCATION_TYPES).includes(location.type as LocationType)
      ? (location.type as LocationType)
      : LOCATION_TYPES.STORAGE

    // Asegurarse de que el status sea uno de los valores permitidos
    const status: WarehouseStatus = location.status === INACTIVE_STATUS ? INACTIVE_STATUS : ACTIVE_STATUS

    locationForm.reset({
      code: location.code,
      name: location.name || "",
      type: locationType,
      status: status,
    })
    setIsEditing(true)
    setEditId(location.id)
    setLocationDialogOpen(true)
  }

  // Handle warehouse form submission
  const onWarehouseSubmit = async (data: WarehouseFormValues) => {
    try {
      if (isEditing && editId) {
        // Update existing warehouse
        await WarehouseService.updateWarehouse(editId, data)
        toast({
          title: "Éxito",
          description: "Almacén actualizado correctamente",
        })
      } else {
        // Create new warehouse
        await WarehouseService.createWarehouse(data)
        toast({
          title: "Éxito",
          description: "Almacén creado correctamente",
        })
      }

      // Reload warehouses and close dialog
      await loadWarehouses()
      setWarehouseDialogOpen(false)
      resetWarehouseForm()
    } catch (error) {
      console.error("Error saving warehouse:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el almacén",
        variant: "destructive",
      })
    }
  }

  // Handle location form submission
  const onLocationSubmit = async (data: LocationFormValues) => {
    if (!selectedWarehouse) {
      toast({
        title: "Error",
        description: "Debe seleccionar un almacén primero",
        variant: "destructive",
      })
      return
    }

    try {
      if (isEditing && editId) {
        // Update existing location
        await WarehouseService.updateLocation(editId, data)
        toast({
          title: "Éxito",
          description: "Ubicación actualizada correctamente",
        })
      } else {
        // Create new location
        await WarehouseService.createLocation({
          ...data,
          warehouseId: selectedWarehouse.id,
        })
        toast({
          title: "Éxito",
          description: "Ubicación creada correctamente",
        })
      }

      // Reload locations and close dialog
      await loadLocations(selectedWarehouse.id)
      setLocationDialogOpen(false)
      resetLocationForm()
    } catch (error) {
      console.error("Error saving location:", error)
      toast({
        title: "Error",
        description: "Error al guardar la ubicación",
        variant: "destructive",
      })
    }
  }

  // Handle setting a warehouse as default
  const handleSetDefault = async (id: string) => {
    try {
      await WarehouseService.setDefaultWarehouse(id)
      toast({
        title: "Éxito",
        description: "Almacén predeterminado actualizado",
      })
      await loadWarehouses()
    } catch (error) {
      console.error("Error setting default warehouse:", error)
      toast({
        title: "Error",
        description: "Error al establecer el almacén predeterminado",
        variant: "destructive",
      })
    }
  }

  // Open delete confirmation dialog
  const confirmDelete = (id: string, type: "warehouse" | "location") => {
    if (type === "warehouse") {
      setDeleteWarehouseId(id)
    } else {
      setDeleteLocationId(id)
    }
    setDeleteType(type)
    setDeleteDialogOpen(true)
  }

  // Handle warehouse deletion
  const handleDeleteWarehouse = async () => {
    if (!deleteWarehouseId) return

    try {
      await WarehouseService.deleteWarehouse(deleteWarehouseId)
      toast({
        title: "Éxito",
        description: "Almacén eliminado correctamente",
      })
      await loadWarehouses()

      // If the deleted warehouse was selected, select another one
      if (selectedWarehouse?.id === deleteWarehouseId) {
        setSelectedWarehouse(warehouses.find((w) => w.id !== deleteWarehouseId) || null)
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el almacén",
        variant: "destructive",
      })
    } finally {
      setDeleteWarehouseId(null)
      setDeleteDialogOpen(false)
    }
  }

  // Handle location deletion
  const handleDeleteLocation = async () => {
    if (!deleteLocationId) return

    try {
      await WarehouseService.deleteLocation(deleteLocationId)
      toast({
        title: "Éxito",
        description: "Ubicación eliminada correctamente",
      })

      if (selectedWarehouse) {
        await loadLocations(selectedWarehouse.id)
      }
    } catch (error) {
      console.error("Error deleting location:", error)
      toast({
        title: "Error",
        description: "Error al eliminar la ubicación",
        variant: "destructive",
      })
    } finally {
      setDeleteLocationId(null)
      setDeleteDialogOpen(false)
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteType === "warehouse") {
      handleDeleteWarehouse()
    } else {
      handleDeleteLocation()
    }
  }

  // PASO 8: Actualizar la función de renderizado de tipos de ubicación para usar las constantes
  const renderLocationType = (type: string) => {
    const types: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      [LOCATION_TYPES.RECEIVING]: { label: "Recepción", variant: "default" },
      [LOCATION_TYPES.SHIPPING]: { label: "Envío", variant: "secondary" },
      [LOCATION_TYPES.STORAGE]: { label: "Almacenamiento", variant: "outline" },
      [LOCATION_TYPES.QUARANTINE]: { label: "Cuarentena", variant: "destructive" },
      [LOCATION_TYPES.RETURNS]: { label: "Devoluciones", variant: "outline" },
    }

    const typeInfo = types[type] || { label: type, variant: "default" }

    return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
  }

  // Render warehouse skeleton during loading
  const renderWarehouseSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <div className="flex justify-end mt-2 space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Almacenes</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar almacenes..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadWarehouses()}
            />
          </div>
          <Button onClick={loadWarehouses}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Warehouses List */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Almacenes</CardTitle>
            <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => {
                    resetWarehouseForm()
                    setWarehouseDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Almacén
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Editar Almacén" : "Nuevo Almacén"}</DialogTitle>
                  <DialogDescription>Complete los detalles del almacén a continuación.</DialogDescription>
                </DialogHeader>
                <Form {...warehouseForm}>
                  <form onSubmit={warehouseForm.handleSubmit(onWarehouseSubmit)} className="space-y-4">
                    <FormField
                      control={warehouseForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input placeholder="MAIN" {...field} />
                          </FormControl>
                          <FormDescription>Código único para identificar el almacén</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={warehouseForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Almacén Principal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={warehouseForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Dirección completa del almacén" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={warehouseForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Almacén Predeterminado</FormLabel>
                            <FormDescription>Este almacén se usará por defecto para nuevos productos</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={warehouseForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={ACTIVE_STATUS}>Activo</SelectItem>
                              <SelectItem value={INACTIVE_STATUS}>Inactivo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetWarehouseForm()
                          setWarehouseDialogOpen(false)
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">{isEditing ? "Actualizar" : "Crear"} Almacén</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                renderWarehouseSkeleton()
              ) : warehouses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay almacenes disponibles</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      resetWarehouseForm()
                      setWarehouseDialogOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Almacén
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {warehouses.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedWarehouse?.id === warehouse.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                      }`}
                      onClick={() => handleWarehouseSelect(warehouse)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{warehouse.name}</p>
                            <p className="text-sm text-muted-foreground">Código: {warehouse.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {warehouse.isDefault && (
                            <Badge variant="secondary" className="mr-2">
                              <Star className="h-3 w-3 mr-1" />
                              Predeterminado
                            </Badge>
                          )}
                          {warehouse.status === INACTIVE_STATUS && (
                            <Badge variant="destructive" className="mr-2">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                      </div>
                      {warehouse.address && (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {warehouse.address}
                        </div>
                      )}
                      <div className="flex items-center justify-end mt-2 space-x-2">
                        {!warehouse.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetDefault(warehouse.id)
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Predeterminado
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditWarehouse(warehouse)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDelete(warehouse.id, "warehouse")
                          }}
                          disabled={warehouse.isDefault}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Warehouse Details and Locations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedWarehouse ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-6 w-6 mr-2" />
                    {selectedWarehouse.name}
                    {selectedWarehouse.isDefault && (
                      <Badge variant="secondary" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Predeterminado
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditWarehouse(selectedWarehouse)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </div>
              ) : (
                "Seleccione un almacén"
              )}
            </CardTitle>
            {selectedWarehouse && (
              <CardDescription>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {selectedWarehouse.address || "Sin dirección registrada"}
                </div>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedWarehouse ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Seleccione un almacén para ver sus detalles</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetWarehouseForm()
                    setWarehouseDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Nuevo Almacén
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="locations" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
                  <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                </TabsList>
                <TabsContent value="locations" className="space-y-4">
                  <div className="flex justify-between items-center my-4">
                    <h3 className="text-lg font-medium">Ubicaciones del Almacén</h3>
                    <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            resetLocationForm()
                            setLocationDialogOpen(true)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nueva Ubicación
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{isEditing ? "Editar Ubicación" : "Nueva Ubicación"}</DialogTitle>
                          <DialogDescription>Complete los detalles de la ubicación a continuación.</DialogDescription>
                        </DialogHeader>
                        <Form {...locationForm}>
                          <form onSubmit={locationForm.handleSubmit(onLocationSubmit)} className="space-y-4">
                            <FormField
                              control={locationForm.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Código</FormLabel>
                                  <FormControl>
                                    <Input placeholder="A-01-01" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Código único para identificar la ubicación (ej: Pasillo-Estante-Nivel)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={locationForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Estantería A, Pasillo 1, Nivel 1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={locationForm.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value={LOCATION_TYPES.RECEIVING}>Recepción</SelectItem>
                                      <SelectItem value={LOCATION_TYPES.SHIPPING}>Envío</SelectItem>
                                      <SelectItem value={LOCATION_TYPES.STORAGE}>Almacenamiento</SelectItem>
                                      <SelectItem value={LOCATION_TYPES.QUARANTINE}>Cuarentena</SelectItem>
                                      <SelectItem value={LOCATION_TYPES.RETURNS}>Devoluciones</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={locationForm.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estado</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un estado" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value={ACTIVE_STATUS}>Activo</SelectItem>
                                      <SelectItem value={INACTIVE_STATUS}>Inactivo</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  resetLocationForm()
                                  setLocationDialogOpen(false)
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit">{isEditing ? "Actualizar" : "Crear"} Ubicación</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {locations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center border rounded-lg p-6">
                      <Package className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground mb-2">No hay ubicaciones definidas para este almacén</p>
                      <Button
                        onClick={() => {
                          resetLocationForm()
                          setLocationDialogOpen(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Primera Ubicación
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {locations.map((location) => (
                            <TableRow key={location.id}>
                              <TableCell className="font-medium">{location.code}</TableCell>
                              <TableCell>{location.name || "-"}</TableCell>
                              <TableCell>{location.type && renderLocationType(location.type)}</TableCell>
                              <TableCell>
                                {location.status === ACTIVE_STATUS ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Activo
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactivo
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditLocation(location)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => confirmDelete(location.id, "location")}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="stats">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">--</div>
                          <p className="text-xs text-muted-foreground">Productos almacenados en este almacén</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Ubicaciones Activas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {locations.filter((l) => l.status === ACTIVE_STATUS).length}
                          </div>
                          <p className="text-xs text-muted-foreground">De un total de {locations.length} ubicaciones</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">Distribución por Tipo de Ubicación</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(locationStats).length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(locationStats).map(([type, count]) => {
                              const percentage = locations.length > 0 ? (count / locations.length) * 100 : 0
                              return (
                                <div key={type} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{renderLocationType(type)}</span>
                                    <span>
                                      {count} ({percentage.toFixed(1)}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2.5">
                                    <div
                                      className={`h-2.5 rounded-full ${
                                        type === LOCATION_TYPES.RECEIVING
                                          ? "bg-blue-500"
                                          : type === LOCATION_TYPES.SHIPPING
                                            ? "bg-purple-500"
                                            : type === LOCATION_TYPES.STORAGE
                                              ? "bg-green-500"
                                              : type === LOCATION_TYPES.QUARANTINE
                                                ? "bg-red-500"
                                                : "bg-amber-500"
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="h-[200px] flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                              No hay datos de ubicaciones disponibles
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteType === "warehouse" ? "¿Eliminar almacén?" : "¿Eliminar ubicación?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === "warehouse"
                ? "Esta acción no se puede deshacer. Esto eliminará permanentemente el almacén y todas sus ubicaciones asociadas."
                : "Esta acción no se puede deshacer. Esto eliminará permanentemente la ubicación seleccionada."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
