/**
 * Role Management Component
 *
 * This component provides a comprehensive interface for managing roles
 * and their associated permissions.
 */

"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserService } from "@/lib/services/user-services"
import { type Role, SystemModule, PermissionLevel, type ModulePermission } from "@/lib/models/user"
import { Shield, Plus, Edit, Trash2, MoreHorizontal, Users, Lock, CheckCircle2, XCircle } from "lucide-react"

// Form validation schema
const roleFormSchema = z.object({
  name: z.string().min(3, "Role name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

// Module information for UI display
const moduleInfo = {
  [SystemModule.DASHBOARD]: { label: "Panel de Control", description: "Acceso al panel y vista general del sistema" },
  [SystemModule.USERS]: { label: "Usuarios y Empresas", description: "Gestión de usuarios, roles y empresas" },
  [SystemModule.INVENTORY]: { label: "Inventario", description: "Gestión de productos, stock y proveedores" },
  [SystemModule.BILLING]: { label: "Facturación", description: "Gestión de facturas y pagos" },
  [SystemModule.ACCOUNTING]: { label: "Contabilidad", description: "Reportes financieros y transacciones" },
  [SystemModule.POS]: { label: "Punto de Venta", description: "Procesamiento de ventas y devoluciones" },
  [SystemModule.REPORTS]: { label: "Reportes", description: "Generación y visualización de reportes del sistema" },
  [SystemModule.SETTINGS]: { label: "Configuración", description: "Configuración general del sistema" },
}

// Permission level information for UI display
const permissionLevelInfo = {
  [PermissionLevel.NONE]: {
    label: "Sin Acceso",
    description: "No puede ver ni acceder a este módulo",
    badge: { variant: "destructive" as const, icon: XCircle },
  },
  [PermissionLevel.STAFF]: {
    label: "Acceso de Personal",
    description: "Puede realizar operaciones normales",
    badge: { variant: "default" as const, icon: CheckCircle2 },
  },
  [PermissionLevel.ADMIN]: {
    label: "Acceso de Administrador",
    description: "Acceso administrativo completo al módulo",
    badge: { variant: "secondary" as const, icon: Shield },
  },
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)
  const [permissionsChanged, setPermissionsChanged] = useState(false)

  // Form for creating/editing roles
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Load roles on component mount
  useEffect(() => {
    loadRoles()
  }, [])

  // Load roles from service
  const loadRoles = async () => {
    setIsLoading(true)
    try {
      const data = await UserService.getRoles()
      setRoles(data)

      // Select the first role by default if none is selected
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0])
      } else if (selectedRole) {
        // Update the selected role if it exists in the new data
        const updatedRole = data.find((r) => r.id === selectedRole.id)
        if (updatedRole) {
          setSelectedRole(updatedRole)
        } else if (data.length > 0) {
          setSelectedRole(data[0])
        } else {
          setSelectedRole(null)
        }
      }
    } catch (error) {
      console.error("Error loading roles:", error)
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle role selection
  const handleRoleSelect = (role: Role) => {
    // Check if there are unsaved permission changes
    if (permissionsChanged) {
      // Show confirmation dialog
      if (confirm("You have unsaved permission changes. Discard changes?")) {
        setSelectedRole(role)
        setPermissionsChanged(false)
      }
    } else {
      setSelectedRole(role)
    }
  }

  // Reset form for new role
  const handleNewRole = () => {
    form.reset({
      name: "",
      description: "",
    })
    setIsEditing(false)
    setDialogOpen(true)
  }

  // Open form for editing role
  const handleEditRole = (role: Role) => {
    form.reset({
      name: role.name,
      description: role.description,
    })
    setIsEditing(true)
    setDialogOpen(true)
  }

  // Handle role form submission
  const onSubmit = async (data: RoleFormValues) => {
    setIsSubmitting(true)

    try {
      if (isEditing && selectedRole) {
        // Update existing role
        await UserService.updateRole(selectedRole.id, data)
        toast({
          title: "Success",
          description: "Role updated successfully",
        })
      } else {
        // Create new role with default permissions (no access to any module)
        const permissions: ModulePermission[] = Object.values(SystemModule).map((module) => ({
          module,
          level: PermissionLevel.NONE,
        }))

        await UserService.createRole({
          name: data.name,
          description: data.description,
          permissions,
          isSystem: false,
        })

        toast({
          title: "Success",
          description: "Role created successfully",
        })
      }

      // Reload roles and close dialog
      await loadRoles()
      setDialogOpen(false)
    } catch (error) {
      console.error("Error saving role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save role",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open delete confirmation dialog
  const confirmDeleteRole = (id: string) => {
    setRoleToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Handle role deletion
  const handleDeleteRole = async () => {
    if (!roleToDelete) return

    try {
      await UserService.deleteRole(roleToDelete)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })

      // Reload roles
      await loadRoles()

      // If the deleted role was selected, select another one
      if (selectedRole?.id === roleToDelete) {
        setSelectedRole(roles.find((r) => r.id !== roleToDelete) || null)
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive",
      })
    } finally {
      setRoleToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // Update permission level for a module
  const updatePermission = async (module: SystemModule, level: PermissionLevel) => {
    if (!selectedRole) return

    // Mark that permissions have changed
    setPermissionsChanged(true)

    // Create a copy of the selected role
    const updatedRole = { ...selectedRole }

    // Find the permission for the module
    const permissionIndex = updatedRole.permissions.findIndex((p) => p.module === module)

    if (permissionIndex >= 0) {
      // Update existing permission
      updatedRole.permissions[permissionIndex].level = level
    } else {
      // Add new permission
      updatedRole.permissions.push({ module, level })
    }

    // Update the selected role
    setSelectedRole(updatedRole)
  }

  // Save permission changes
  const savePermissionChanges = async () => {
    if (!selectedRole) return

    try {
      await UserService.updateRole(selectedRole.id, {
        permissions: selectedRole.permissions,
      })

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      })

      // Reload roles to get fresh data
      await loadRoles()
      setPermissionsChanged(false)
    } catch (error) {
      console.error("Error updating permissions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update permissions",
        variant: "destructive",
      })
    }
  }

  // Get current permission level for a module
  const getPermissionLevel = (module: SystemModule): PermissionLevel => {
    if (!selectedRole) return PermissionLevel.NONE

    const permission = selectedRole.permissions.find((p) => p.module === module)
    return permission ? permission.level : PermissionLevel.NONE
  }

  // Render permission badge
  const renderPermissionBadge = (level: PermissionLevel) => {
    const info = permissionLevelInfo[level]
    const Icon = info.badge.icon

    return (
      <Badge variant={info.badge.variant} className="ml-2">
        <Icon className="h-3 w-3 mr-1" />
        {info.label}
      </Badge>
    )
  }

  // Render role skeleton during loading
  const renderRoleSkeleton = () => (
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
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Roles</h2>
        <Button onClick={handleNewRole}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de Roles */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Roles
            </CardTitle>
            <CardDescription>Gestiona los roles y permisos de los usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {isLoading ? (
                renderRoleSkeleton()
              ) : roles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Shield className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay roles disponibles</p>
                  <Button variant="outline" className="mt-4" onClick={handleNewRole}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Rol
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedRole?.id === role.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                        }`}
                      onClick={() => handleRoleSelect(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {Math.floor(Math.random() * 10)} usuarios
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          {role.isSystem ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Lock className="h-3 w-3 mr-1" />
                              Sistema
                            </Badge>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditRole(role)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    confirmDeleteRole(role.id)
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detalles y Permisos */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              {selectedRole ? (
                <div className="flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  {selectedRole.name}
                  {selectedRole.isSystem && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                      <Lock className="h-3 w-3 mr-1" />
                      Rol del Sistema
                    </Badge>
                  )}
                </div>
              ) : (
                "Selecciona un rol"
              )}
            </CardTitle>
            {selectedRole && <CardDescription>{selectedRole.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Selecciona un rol para ver y gestionar sus permisos</p>
                <Button variant="outline" onClick={handleNewRole}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Nuevo Rol
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Permisos de Módulo</h3>
                  {permissionsChanged && !selectedRole.isSystem && (
                    <Button onClick={savePermissionChanges}>Guardar Cambios</Button>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Módulo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Nivel de Permiso</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.values(SystemModule).map((module) => (
                        <TableRow key={module}>
                          <TableCell className="font-medium">{moduleInfo[module].label}</TableCell>
                          <TableCell>{moduleInfo[module].description}</TableCell>
                          <TableCell>{renderPermissionBadge(getPermissionLevel(module))}</TableCell>
                          <TableCell className="text-right">
                            {selectedRole.isSystem ? (
                              <Badge variant="outline" className="bg-gray-100">
                                <Lock className="h-3 w-3 mr-1" />
                                Definido por el Sistema
                              </Badge>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Cambiar
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Asignar Permiso</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => updatePermission(module, PermissionLevel.NONE)}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Sin Acceso
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updatePermission(module, PermissionLevel.STAFF)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                    Acceso de Staff
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updatePermission(module, PermissionLevel.ADMIN)}>
                                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                                    Acceso de Admin
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Niveles de Permiso</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Sin Acceso</p>
                        <p className="text-sm text-muted-foreground">El usuario no puede ver ni acceder a este módulo</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Acceso de Staff</p>
                        <p className="text-sm text-muted-foreground">
                          El usuario puede realizar operaciones como crear, leer, actualizar y eliminar
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Acceso de Admin</p>
                        <p className="text-sm text-muted-foreground">
                          El usuario tiene acceso administrativo completo a este módulo, incluyendo su configuración
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza los detalles del rol a continuación. Puedes gestionar los permisos después de guardar."
                : "Define un nuevo rol. Podrás asignar permisos después de crearlo."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Rol</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej.: Gerente de Tienda" {...field} />
                    </FormControl>
                    <FormDescription>Un nombre único para este rol</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej.: Administra operaciones y personal de la tienda" {...field} />
                    </FormControl>
                    <FormDescription>Breve descripción de las responsabilidades de este rol</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Actualizando..."
                      : "Creando..."
                    : isEditing
                      ? "Actualizar Rol"
                      : "Crear Rol"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación para Eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Rol?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el rol. Asegúrate de que ningún usuario esté
              asignado a este rol antes de eliminarlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
