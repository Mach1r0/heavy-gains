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
import { apiClient } from "@/lib/api/client"

export default function WorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const user = authApi.getUserFromStorage()
        console.log('User from storage:', user)
        
        if (user) {
          const teacherResponse = await apiClient.get(`/trainer/teachers/?user=${user.id}`)
          console.log('Teacher response:', teacherResponse.data)
          const teacher = teacherResponse.data[0]
          
          if (teacher) {
            console.log('Fetching workouts for teacher:', teacher.id)
            const response = await apiClient.get(`/training/grouped_by_name/?teacher=${teacher.id}`)
            console.log('Grouped workouts response:', response.data)
            setWorkouts(response.data)
          } else {
            console.error('No teacher found for user')
          }
        } else {
          console.error('No user in storage')
        }
      } catch (error) {
        console.error('Erro ao buscar treinos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkouts()
  }, [])

  useEffect(() => {
    const user = authApi.getUserFromStorage()
    if (user) {
      setUserId(user.id.toString())
    }
  }, [])

  const filteredWorkouts = workouts.filter((workout: any) =>
    workout.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log('Workouts state:', workouts)
  console.log('Filtered workouts:', filteredWorkouts)

  if (!userId) {
    return null
  }
  
  if (loading) {
    return <div>Carregando treinos...</div>
  }

  return (
    <div className="min-h-screen bg-background">
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

        <div className="grid gap-4">
          {filteredWorkouts.map((workout: any) => (
            <Card key={workout.name} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{workout.name}</h3>
                      <Badge variant="secondary">{workout.category || 'Treino'}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{workout.exercises || 0} exercício{(workout.exercises || 0) !== 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {workout.student_count || 0} {(workout.student_count) === 1 ? 'aluno' : 'alunos'}
                      </span>
                      <span>Criado em {workout.start_date ? new Date(workout.start_date).toLocaleDateString("pt-BR") : "-"}</span>
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
                    <Link href={`/trainer/${userId}/workouts/${encodeURIComponent(workout.name)}`}>Ver Detalhes</Link>
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
