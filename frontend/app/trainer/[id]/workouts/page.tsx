"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Search, Plus, Copy, Edit, Trash2, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"

// Mock data
const mockWorkouts = [
  {
    id: 1,
    name: "Treino A - Peito e Tríceps",
    exercises: 8,
    students: 12,
    lastUsed: "2024-01-15",
    category: "Hipertrofia",
  },
  {
    id: 2,
    name: "Treino B - Costas e Bíceps",
    exercises: 9,
    students: 12,
    lastUsed: "2024-01-14",
    category: "Hipertrofia",
  },
  {
    id: 3,
    name: "Treino C - Pernas",
    exercises: 7,
    students: 10,
    lastUsed: "2024-01-13",
    category: "Hipertrofia",
  },
  {
    id: 4,
    name: "Treino Full Body - Iniciante",
    exercises: 6,
    students: 5,
    lastUsed: "2024-01-12",
    category: "Iniciante",
  },
  {
    id: 5,
    name: "HIIT Cardio",
    exercises: 5,
    students: 8,
    lastUsed: "2024-01-11",
    category: "Emagrecimento",
  },
]

export default function WorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWorkouts = mockWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

    const pathname = usePathname()
    const [userId, setUserId] = useState<string | null>(null)
  
    useEffect(() => {
      const user = authApi.getCurrentUser()
      if (user) {
        setUserId(user.id.toString())
      }
    }, [])
  
    if (!userId) {
      return null
    }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/${userId}/dashboard`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Treinos</h1>
                <p className="text-sm text-muted-foreground">Gerencie seus planos de treino</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/trainer/${userId}/workouts/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Treino
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar treinos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Workouts Grid */}
        <div className="grid gap-4">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{workout.name}</h3>
                      <Badge variant="secondary">{workout.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{workout.exercises} exercícios</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {workout.students} alunos
                      </span>
                      <span>Usado em {new Date(workout.lastUsed).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Duplicar">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild title="Editar">
                    <Link href={`/trainer/${userId}/workouts/${workout.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" title="Excluir">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/trainer/${userId}/workouts/${workout.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
