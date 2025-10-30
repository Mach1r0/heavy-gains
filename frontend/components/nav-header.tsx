"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Dumbbell, Moon, Sun, UtensilsCrossed, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function NavHeader() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Heavy Gains</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button variant={pathname === "/" || pathname.startsWith("/students") ? "default" : "ghost"} asChild>
              <Link href="/students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Alunos
              </Link>
            </Button>

            <Button variant={pathname.startsWith("/diets") ? "default" : "ghost"} asChild>
              <Link href="/diets" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Dietas
              </Link>
            </Button>

            <Button variant={pathname.startsWith("/ai-assistant") ? "default" : "ghost"} asChild>
              <Link href="/ai-assistant" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Assistente IA
              </Link>
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
