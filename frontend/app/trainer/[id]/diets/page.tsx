"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Target, Eye, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { authApi } from "@/lib/api/auth"

interface DietPlan {
  id: number
  name: string
  goal: "BUK" | "CUT" | "MAINT"
  start_date: string
  end_date: string
  is_active: boolean
  meals_count: number
  student_name: string
}

const goalLabels = {
  BUK: "Bulking",
  CUT: "Cutting",
  MAINT: "Manutenção",
}

const goalColors = {
  BUK: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CUT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  MAINT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

export default function DietsPage() {
  const [diets, setDiets] = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const [userId, setUserId] = useState<string | null>(null)
  

  useEffect(() => {
    // TODO: Fetch all diets from API
    // Mock data for now
    const mockDiets: DietPlan[] = [
      {
        id: 1,
        name: "Dieta de Ganho de Massa",
        goal: "BUK",
        start_date: "2025-01-01",
        end_date: "2025-03-31",
        is_active: true,
        meals_count: 6,
        student_name: "João Silva",
      },
      {
        id: 2,
        name: "Dieta de Definição",
        goal: "CUT",
        start_date: "2024-10-01",
        end_date: "2024-12-31",
        is_active: false,
        meals_count: 5,
        student_name: "Maria Santos",
      },
      {
        id: 3,
        name: "Dieta de Manutenção",
        goal: "MAINT",
        start_date: "2025-01-15",
        end_date: "2025-04-15",
        is_active: true,
        meals_count: 5,
        student_name: "Pedro Costa",
      },
    ]

    setDiets(mockDiets)
    setLoading(false)
  }, [])

  // Separate hook to get current user (must be top-level)
  useEffect(() => {
    const user = authApi.getUserFromStorage()
    if (user) {
      setUserId(user.id.toString())
    }
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Carregando dietas...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dietas</h1>
            <p className="text-muted-foreground">Gerencie todas as dietas dos seus alunos</p>
          </div>
          <Button asChild>
            <Link href={`/trainer/${userId}/diets/new`} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Dieta
            </Link>
          </Button>
        </div>

        {/* Diets List */}
        {diets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhuma dieta criada ainda</p>
              <Button asChild>
                <Link href="/diets/new">Criar Primeira Dieta</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diets.map((diet) => (
              <Card key={diet.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{diet.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <Badge className={goalColors[diet.goal]}>{goalLabels[diet.goal]}</Badge>
                        {diet.is_active && <Badge variant="default">Ativa</Badge>}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{diet.student_name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(diet.start_date).toLocaleDateString("pt-BR")} -{" "}
                        {new Date(diet.end_date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{diet.meals_count} refeições</span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <Link
                      href={userId ? `/trainer/${userId}/diets/${diet.id}` : `/diets/${diet.id}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
