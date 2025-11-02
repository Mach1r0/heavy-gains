"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Dumbbell, Apple, Users, MessageSquare, Settings, TrendingUp, Video, Ruler} from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"

interface SidebarNavProps {
  userType: "trainer" | "student"
}

export function SidebarNav({ userType }: SidebarNavProps) {
  const pathname = usePathname()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const user = authApi.getUserFromStorage()
    if (user) {
      setUserId(user.id.toString())
    }
  }, [])

  if (!userId) {
    return null
  }

  const trainerLinks = [
    {
      title: "Dashboard",
      href: `/trainer/${userId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Alunos",
      href: `/trainer/${userId}/students`,
      icon: Users,
    },
    {
      title: "Treinos",
      href: `/trainer/${userId}/workouts`,
      icon: Dumbbell,
    },
    {
      title: "Dietas",
      href: `/trainer/${userId}/diets`,
      icon: Apple,
    },
    {
      title: "Vídeo Aulas",
      href: `/trainer/${userId}/videos`,
      icon: Video,
    },
    {
      title: "Assistente IA",
      href: `/ai-assistant`,
      icon: MessageSquare,
    },
    {
      title: "Configurações",
      href: `/trainer/${userId}/settings`,
      icon: Settings,
    },
  ]

  const studentLinks = [
    {
      title: "Dashboard",
      href: `/student/${userId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Meus Treinos",
      href: `/student/${userId}/workout`,
      icon: Dumbbell,
    },
    {
      title: "Minha Dieta",
      href: `/student/${userId}/diet`,
      icon: Apple,
    },
    {
      title: "Vídeo Aulas",
      href: `/student/${userId}/videos`,
      icon: Video,
    },
    {
      title: "Progresso",
      href: `/student/${userId}/progress`,
      icon: TrendingUp,
    },
    {
      title: "Medidas",
      href: `/student/${userId}/measurements`,
      icon: Ruler,
    },
  ]

  const links = userType === "trainer" ? trainerLinks : studentLinks

  const dashboardUrl = userType === "trainer" 
    ? `/trainer/${userId}/dashboard` 
    : `/student/${userId}/dashboard`

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href={dashboardUrl} className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">Heavy Gains</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.title}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {userType === "trainer" ? "PT" : "AL"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {userType === "trainer" ? "Personal Trainer" : "Aluno"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {userType === "trainer" ? "trainer@fitpro.com" : "aluno@fitpro.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
