"use client"

/**
 * Access Denied Page
 *
 * This page is shown when a user tries to access a page they don't have permission for.
 */

import { useContext } from "react"
import { AuthContext } from "@/lib/context/auth-context"
import { redirect } from "next/navigation"

export default function RedirectAfterLoginPage() {
  const { isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }
}
