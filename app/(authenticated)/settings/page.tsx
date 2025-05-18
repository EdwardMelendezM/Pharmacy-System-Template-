import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuraciones</h1>
        <Button>Guardar Cambios</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pharmacy">Farmacia</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="tenant">Organización</TabsTrigger>
          <TabsTrigger value="themes">Temas</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>Actualiza los detalles de tu empresa y la información comercial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de información de la empresa se implementará aquí</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias del Sistema</CardTitle>
              <CardDescription>Configura los ajustes y preferencias a nivel de sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de preferencias del sistema se implementará aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes de Farmacia</CardTitle>
              <CardDescription>Configura los ajustes específicos de la farmacia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de ajustes de farmacia se implementará aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes de Facturación</CardTitle>
              <CardDescription>Configura los ajustes de facturación y pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de ajustes de facturación se implementará aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Configura los roles y permisos de los usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de gestión de usuarios se implementará aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones</CardTitle>
              <CardDescription>Conéctate con servicios y APIs de terceros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de integraciones se implementará aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes de Organización</CardTitle>
              <CardDescription>Configura los ajustes de tu organización</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de ajustes de organización se implementará aquí</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marca</CardTitle>
              <CardDescription>Personaliza la apariencia de tu aplicación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de personalización de marca se implementará aquí</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localización</CardTitle>
              <CardDescription>Configura el idioma, formato de fecha y otros ajustes regionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">El formulario de ajustes de localización se implementará aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Temas</CardTitle>
              <CardDescription>Personaliza la apariencia de tu aplicación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Crea y gestiona temas personalizados para tu aplicación</p>
                <Button asChild>
                  <Link href="/settings/themes">Gestionar Temas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
