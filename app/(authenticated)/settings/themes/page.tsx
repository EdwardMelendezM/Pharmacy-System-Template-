import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ThemesList from "@/components/themes/themes-list"
import CreateThemeForm from "@/components/themes/create-theme-form"

export default function ThemesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Theme Management</h1>
        <p className="text-muted-foreground">Customize the appearance of your application with custom themes</p>
      </div>

      <Tabs defaultValue="themes">
        <TabsList>
          <TabsTrigger value="themes">Available Themes</TabsTrigger>
          <TabsTrigger value="create">Create Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="themes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Themes</CardTitle>
              <CardDescription>Manage your themes or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemesList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Theme</CardTitle>
              <CardDescription>Design a new theme for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateThemeForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
