import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

export function ModuleCard({ title, description, icon, href }: ModuleCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="text-primary">{icon}</div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
