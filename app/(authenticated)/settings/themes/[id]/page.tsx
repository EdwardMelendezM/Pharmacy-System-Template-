import EditThemeForm from "@/components/themes/edit-theme-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditThemePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Theme</h1>
        <p className="text-muted-foreground">Modify the appearance of your custom theme</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Theme</CardTitle>
          <CardDescription>Update the colors and properties of your theme</CardDescription>
        </CardHeader>
        <CardContent>
          <EditThemeForm themeId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
