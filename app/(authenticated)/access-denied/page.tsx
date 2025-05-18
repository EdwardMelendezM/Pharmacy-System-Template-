/**
 * Access Denied Page
 *
 * This page is shown when a user tries to access a page they don't have permission for.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home, ArrowLeft } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <ShieldAlert className="h-24 w-24 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-xl text-muted-foreground mb-8">You don't have permission to access this page.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  )
}
