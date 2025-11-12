"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Copy, Trash2, Users, Clock, Dumbbell } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"

export default function WorkoutDetailPage() {
  const params = useParams()
  const workoutId = params?.workoutId as string
  const [userId, setUserId] = useState<string | null>(null)
  const [workout, setWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = authApi.getUserFromStorage()
    if (user) {
      setUserId(user.id.toString())
    }
  }, [])

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await apiClient.get(`/training/${workoutId}/`)
        setWorkout(response.data)
      } catch (error) {
        console.error('Erro ao buscar treino:', error)
      } finally {
        setLoading(false)
      }
    }
    if (workoutId) {
      fetchWorkout()
    }
  }, [workoutId])

  if (!userId) {
    return null
  }

  if (loading) {
    return <div>Carregando treino...</div>
  }

  if (!workout) {
    return <div>Treino não encontrado</div>
  }

  const totalSets = workout.exercises?.reduce((acc: number, ex: any) => acc + Number.parseInt(ex.sets || 0), 0) || 0
  const estimatedTime = workout.exercises?.reduce((acc: number, ex: any) => {
    const sets = Number.parseInt(ex.sets || 0)
    const rest = Number.parseInt(ex.rest || 0)
    return acc + sets * 60 + (sets - 1) * rest
  }, 0) || 0
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/${userId}/workouts`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{workout.name}</h1>
                  <Badge>{workout.category || 'Treino'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{workout.description || 'Sem descrição'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trainer/${userId}/workouts/${workout.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{workout.exercises?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Exercícios</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSets}</p>
                <p className="text-xs text-muted-foreground">Séries Totais</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.round(estimatedTime / 60)}</p>
                <p className="text-xs text-muted-foreground">Min (estimado)</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{workout.students || 0}</p>
                <p className="text-xs text-muted-foreground">Alunos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Exercícios</h2>
          {workout.exercises?.map((exercise: any, index: number) => (
            <Card key={exercise.id} className="p-4 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">{index + 1}</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{exercise.name}</h3>

                  <div className="flex items-center gap-6 text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Séries:</span>
                      <span className="font-medium text-foreground">{exercise.sets}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Repetições:</span>
                      <span className="font-medium text-foreground">{exercise.reps}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Descanso:</span>
                      <span className="font-medium text-foreground">{exercise.rest}s</span>
                    </div>
                  </div>

                  {exercise.notes && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{exercise.notes}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
