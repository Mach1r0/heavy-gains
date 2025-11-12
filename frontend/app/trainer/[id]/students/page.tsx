"use client"
import { NavHeader } from "@/components/nav-header"
import { StudentsList } from "@/components/students-list"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"

export default function StudentsPage() {
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
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meus Alunos</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus alunos, dietas e treinos</p>
          </div>
          <Link href={`students/new`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Aluno
            </Button>
          </Link>
        </div>
        <StudentsList />
      </main>
    </div>
  )
}
