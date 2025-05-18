"use client"

import { Bell, PanelLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { CashDrawerIndicator } from "./cash-drawer-indicator"
import { UserAccountNav } from "./user-account-nav"
import { useSidebarMobile } from "@/hooks/use-sidebar-mobile"
import { useSidebarDesktop } from "@/hooks/use-sidebar-desktop"
import { cn } from "@/lib/utils"

export default function Header() {
  const openSidebarMobile = useSidebarMobile((state) => state.open)
  const toggleDesktop = useSidebarDesktop((state) => state.toggle)
  const { isOpen } = useSidebarDesktop()

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Desktop toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDesktop}
          className="hidden sm:flex transition-transform duration-300 ease-in-out"
          aria-label="Toggle sidebar"
        >
          <PanelLeft
            className={cn(
              "h-5 w-5",
              "transform transition-transform duration-300 ease-in-out",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </Button>

        {/* Search input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px] transition-[width] duration-300 ease-in-out focus:md:w-[400px] focus:lg:w-[500px]"
          />
        </div>

        {/* Mobile toggle + right utilities */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={openSidebarMobile}
            className="sm:hidden transition-colors duration-200 hover:text-primary"
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <CashDrawerIndicator />
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="transition-colors duration-200 hover:text-primary">
            <Bell className="h-5 w-5 transform transition-transform duration-200 hover:rotate-12" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="hidden sm:block">
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  )
}
