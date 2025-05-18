import { type NextRequest, NextResponse } from "next/server"
import { defaultThemes } from "@/lib/themes/default-themes"

// In a real application, this would interact with a database
const customThemes = [...defaultThemes]

// GET /api/themes - Get all themes
export async function GET(request: NextRequest) {
  // In a real app, you would filter themes by tenant ID
  // const tenantId = request.headers.get("x-tenant-id");

  return NextResponse.json(customThemes)
}

// POST /api/themes - Create a new theme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // const validatedData = createThemeSchema.parse(body)

    // const newTheme = {
    //   ...validatedData,
    //   id: crypto.randomUUID(),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }

    // customThemes.push(newTheme)

    return NextResponse.json("NO SUPPORT YET", { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid theme data" }, { status: 400 })
  }
}
