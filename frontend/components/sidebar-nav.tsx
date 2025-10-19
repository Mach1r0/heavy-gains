"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Dumbbell, Apple, Users, MessageSquare, Settings, TrendingUp } from "lucide-react"

interface SidebarNavProps {
  userType: "trainer" | "student"
}

export function SidebarNav({ userType }: SidebarNavProps) {
  const pathname = usePathname()

  const trainerLinks = [
    {
      title: "Dashboard",
      href: "/trainer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Alunos",
      href: "/trainer/students",
      icon: Users,
    },
    {
      title: "Treinos",
      href: "/trainer/workouts",
      icon: Dumbbell,
    },
    {
      title: "Dietas",
      href: "/trainer/diets",
      icon: Apple,
    },
    {
      title: "Chat",
      href: "/trainer/messages",
      icon: MessageSquare,
    },
    {
      title: "Configurações",
      href: "/trainer/settings",
      icon: Settings,
    },
  ]

  const studentLinks = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Meus Treinos",
      href: "/student/workout",
      icon: Dumbbell,
    },
    {
      title: "Minha Dieta",
      href: "/student/diet",
      icon: Apple,
    },
    {
      title: "Progresso",
      href: "/student/progress",
      icon: TrendingUp,
    },
    {
      title: "Chat",
      href: "/student/messages",
      icon: MessageSquare,
    },
    {
      title: "Configurações",
      href: "/student/settings",
      icon: Settings,
    },
  ]

  const links = userType === "trainer" ? trainerLinks : studentLinks

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold text-sidebar-foreground">Heavy gains</span>
        </div>

        {/* Navigation */}
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

        {/* User info */}
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
