"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Store, Mail, Phone, MapPin, Calendar, Users, FileText } from "lucide-react"

// Mock store data
const storeData = {
  id: 1,
  name: "MediCorp Farmacia Central",
  ruc: "20123456789",
  address: "123 Main St, Suite 100",
  city: "Lima",
  phone: "(01) 123-4567",
  email: "contact@medicorp.com",
  contactPerson: "Sarah Johnson",
  status: "Activa",
  registrationDate: "2020-01-15T00:00:00Z",
  totalUsers: 15,
  notes: "Farmacia principal para la región norte.",
  users: [
    { id: 101, name: "Sarah Johnson", role: "Administrador" },
    { id: 102, name: "Mark Wilson", role: "Farmacéutico" },
    { id: 103, name: "Emily Davis", role: "Gestor de Inventario" },
    { id: 104, name: "Robert Brown", role: "Gestor Financiero" },
    { id: 105, name: "Jennifer Lee", role: "Cajero" },
  ],
  documents: [
    { name: "Registro de Negocio", date: "2020-01-15T00:00:00Z", status: "Válido" },
    { name: "Certificado Tributario", date: "2023-01-10T00:00:00Z", status: "Válido" },
    { name: "Licencia Farmacéutica", date: "2023-03-22T00:00:00Z", status: "Válido" },
    { name: "Póliza de Seguro", date: "2023-02-15T00:00:00Z", status: "Válido" },
  ],
}

export function StoreDetailView({ storeId }: { storeId?: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isDeactivating, setIsDeactivating] = useState(false)

  const handleDeactivate = () => {
    setIsDeactivating(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Tienda desactivada",
        description: `${storeData.name} ha sido desactivada.`,
      })
      setIsDeactivating(false)
      router.push("/users?tab=stores")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Detalles de Tienda</h2>
          <p className="text-muted-foreground">Ver y gestionar información de la tienda.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/users/edit-store/${storeData.id}`)}>Editar Tienda</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Desactivar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto desactivará la tienda. Todos los usuarios asociados permanecerán pero podrían necesitar ser
                  reasignados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeactivating ? "Desactivando..." : "Desactivar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información de Tienda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <h3 className="font-medium text-lg">{storeData.name}</h3>
              <p className="text-sm text-muted-foreground">RUC: {storeData.ruc}</p>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {storeData.status}
              </Badge>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {storeData.address}, {storeData.city}
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{storeData.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{storeData.email}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Contacto: {storeData.contactPerson}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Registrada: {new Date(storeData.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/users?tab=stores")}>
              Volver a Tiendas
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">General</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Tienda</CardTitle>
                  <CardDescription>Visión general de los detalles y estado de la tienda.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Nombre de Tienda</h4>
                      <p>{storeData.name}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">RUC</h4>
                      <p>{storeData.ruc}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Dirección</h4>
                      <p>
                        {storeData.address}, {storeData.city}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Información de Contacto</h4>
                      <p>
                        {storeData.phone}, {storeData.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Persona de Contacto</h4>
                      <p>{storeData.contactPerson}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Estado</h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {storeData.status}
                      </Badge>
                    </div>
                  </div>
                  {storeData.notes && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Notas</h4>
                      <p className="text-sm">{storeData.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                  <CardDescription>Métricas clave para esta tienda.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col items-center justify-center rounded-md border p-4">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h4 className="text-lg font-bold">{storeData.totalUsers}</h4>
                    <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md border p-4">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <h4 className="text-lg font-bold">{storeData.documents.length}</h4>
                    <p className="text-sm text-muted-foreground">Documentos</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md border p-4">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <h4 className="text-lg font-bold">
                      {Math.floor(
                        (new Date().getTime() - new Date(storeData.registrationDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 30),
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">Meses Activa</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios de la Tienda</CardTitle>
                  <CardDescription>Usuarios asociados con esta tienda.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Nombre</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Rol</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeData.users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-4 text-sm">{user.name}</td>
                            <td className="py-3 px-4 text-sm">{user.role}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/users/detail/${user.id}`)}>
                                Ver
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Ver Todos los Usuarios</Button>
                  <Button onClick={() => router.push("/users/add")}>Añadir Usuario</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos de la Tienda</CardTitle>
                  <CardDescription>Documentos legales y administrativos para esta tienda.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Documento</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Fecha</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Estado</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeData.documents.map((doc, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4 text-sm">{doc.name}</td>
                            <td className="py-3 px-4 text-sm">{new Date(doc.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-sm">
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Ver Todos los Documentos</Button>
                  <Button>Subir Documento</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
