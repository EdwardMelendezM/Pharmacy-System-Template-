/**
 * Login Page
 *
 * This page provides the login form for users to authenticate.
 */

import { LoginForm } from "@/components/auth/login-form"
import { Package } from "lucide-react"

export default function RegistrationPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Registration</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
