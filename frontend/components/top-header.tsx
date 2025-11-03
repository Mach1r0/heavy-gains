"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authApi } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export function TopHeader() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<"student" | "trainer" | null>(null)

  useEffect(() => {
    setMounted(true)
    const currentUser = authApi.getUserFromStorage()
    const type = authApi.getUserType()
    setUser(currentUser)
    setUserType(type as "student" | "trainer")
  }, [])

  const handleLogout = () => {
    authApi.logout()
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!user) {
    return null
  }

  const userName = user?.first_name || user?.username || "User"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={userType === "trainer" ? "Buscar alunos, treinos..." : "Buscar treinos, exercícios..."}
            className="pl-9"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Novo aluno cadastrado</p>
              <p className="text-xs text-muted-foreground">João Silva se inscreveu no seu programa</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Treino concluído</p>
              <p className="text-xs text-muted-foreground">Maria completou o treino de hoje</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Nova mensagem</p>
              <p className="text-xs text-muted-foreground">Pedro enviou uma mensagem</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
        {!mounted ? (
          <Sun className="h-5 w-5" />
        ) : theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline-block">{userName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>
            <Link 
              href={userType === "student" ? `/student/${user.id}/settings` : `/trainer/${user.id}/settings`}
              className="w-full"
            >
              Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
