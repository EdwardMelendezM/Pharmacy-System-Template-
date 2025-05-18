import { type NextRequest, NextResponse } from "next/server"
import { defaultThemes } from "@/lib/themes/default-themes"

// In a real application, this would interact with a database
const customThemes = [...defaultThemes]

// GET /api/themes/[id] - Get a specific theme
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const theme = customThemes.find((t) => t.id === params.id)

  if (!theme) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 })
  }

  return NextResponse.json(theme)
}

// PUT /api/themes/[id] - Update a theme
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const body = await request.json()
//     const validatedData = updateThemeSchema.parse(body)

//     const index = customThemes.findIndex((t) => t.id === params.id)

//     if (index === -1) {
//       return NextResponse.json({ error: "Theme not found" }, { status: 404 })
//     }

//     // Don't allow updating default themes
//     if (customThemes[index].isDefault) {
//       return NextResponse.json({ error: "Cannot update default theme" }, { status: 403 })
//     }

//     const updatedTheme = {
//       ...customThemes[index],
//       ...validatedData,
//       updatedAt: new Date(),
//     }

//     customThemes[index] = updatedTheme

//     return NextResponse.json(updatedTheme)
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid theme data" }, { status: 400 })
//   }
// }

// DELETE /api/themes/[id] - Delete a theme
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   const index = customThemes.findIndex((t) => t.id === params.id)

//   if (index === -1) {
//     return NextResponse.json({ error: "Theme not found" }, { status: 404 })
//   }

//   // Don't allow deleting default themes
//   if (customThemes[index].isDefault) {
//     return NextResponse.json({ error: "Cannot delete default theme" }, { status: 403 })
//   }

//   customThemes.splice(index, 1)

//   return NextResponse.json({ success: true })
// }
