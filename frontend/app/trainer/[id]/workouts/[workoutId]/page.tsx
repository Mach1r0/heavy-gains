"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Copy, Trash2, Users, Clock, Dumbbell, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function WorkoutDetailPage() {
  const params = useParams()
  const workoutId = params?.workoutId as string
  const [userId, setUserId] = useState<string | null>(null)
  const [workout, setWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set())

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId)
      } else {
        newSet.add(exerciseId)
      }
      return newSet
    })
  }

  useEffect(() => {
    const user = authApi.getUserFromStorage()
    if (user) {
      setUserId(user.id.toString())
    }
  }, [])

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const user = authApi.getUserFromStorage()
        if (user) {
          const teacherResponse = await apiClient.get(`/trainer/teachers/?user=${user.id}`)
          const teacher = teacherResponse.data[0]
          
          if (teacher) {
            const response = await apiClient.get(`/training/grouped_by_name/?teacher=${teacher.id}`)
            const decodedWorkoutId = decodeURIComponent(workoutId)
            const foundWorkout = response.data.find((w: any) => w.name === decodedWorkoutId)
            
            if (foundWorkout) {
              // Transform workouts into exercises format
              const exercises = foundWorkout.workouts?.flatMap((workout: any) => 
                workout.exercises?.map((ex: any) => {
                  const numSets = parseInt(ex.sets) || 1
                  const series = Array.from({ length: numSets }, (_, i) => ({
                    id: `${ex.id}-${i + 1}`,
                    number: i + 1,
                    reps: ex.reps || '12',
                    rest: ex.rest_time || '60',
                  }))
                  
                  return {
                    id: ex.id,
                    name: ex.name,
                    sets: ex.sets,
                    series: series,
                    notes: ex.notes,
                    workout_name: workout.name,
                    workout_id: workout.id
                  }
                }) || []
              ) || []
              
              setWorkout({
                ...foundWorkout,
                exercises,
                workouts: foundWorkout.workouts
              })
              
              if (foundWorkout.student_ids && foundWorkout.student_ids.length > 0) {
                const studentsPromises = foundWorkout.student_ids.map((studentId: number) =>
                  apiClient.get(`/students/${studentId}/`)
                )
                const studentsResponses = await Promise.all(studentsPromises)
                const studentsData = studentsResponses.map(res => res.data)
                console.log('Students data:', studentsData)
                setStudents(studentsData)
              }
            }
          }
        }
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
                <Link href={`/trainer/${userId}/workouts/${encodeURIComponent(workout.name)}/edit`}>
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

          <Card 
            className="p-4 bg-card border-border cursor-pointer hover:border-purple-500/50 transition-colors"
            onClick={() => setShowStudentsModal(true)}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{workout.student_count || 0}</p>
                <p className="text-xs text-muted-foreground">Alunos (clique para ver)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Exercícios</h2>
          {workout.exercises?.length > 0 ? (
            workout.exercises.map((exercise: any, index: number) => {
              const exerciseKey = `${exercise.id}-${index}`
              const isExpanded = expandedExercises.has(exerciseKey)
              const totalSeries = exercise.series?.length || 0
              // Always show 'Descanso' and use first series rest value
              const restPreview = totalSeries > 0 ? exercise.series[0]?.rest || '0' : '0'

              return (
                <Card 
                  key={exerciseKey} 
                  className="p-4 bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => toggleExercise(exerciseKey)}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                          {exercise.workout_name && (
                            <Badge variant="outline" className="text-xs">{exercise.workout_name}</Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>

                      {/* Preview: show when collapsed */}
                      {!isExpanded && (
                        <div className="flex items-center gap-6 text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Séries:</span>
                            <span className="font-medium text-foreground">{totalSeries}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Descanso:</span>
                            <span className="font-medium text-foreground">{restPreview}s</span>
                          </div>
                        </div>
                      )}

                      {isExpanded && (
                        <>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded mb-3">{exercise.notes}</p>
                          )}
                          
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Séries</p>
                            {exercise.series?.map((serie: any) => (
                              <div key={serie.id} className="flex items-center gap-4 text-sm bg-muted/30 p-2 rounded">
                                <span className="font-semibold text-foreground min-w-[60px]">Série {serie.number}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Reps:</span>
                                  <span className="font-medium text-foreground">{serie.reps}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Descanso:</span>
                                  <span className="font-medium text-foreground">{serie.rest}s</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 bg-card border-border">
              <p className="text-center text-muted-foreground">Nenhum exercício encontrado neste treino.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Students Modal */}
      <Dialog open={showStudentsModal} onOpenChange={setShowStudentsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alunos usando o treino "{workout?.name}"</DialogTitle>
            <DialogDescription>
              {students.length} {students.length === 1 ? 'aluno está' : 'alunos estão'} usando este treino
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {students.map((student: any) => (
              <Card key={student.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {student.user_data?.first_name || student.user?.first_name || 'Nome não disponível'} {student.user_data?.last_name || student.user?.last_name || ''}
                      </p>
                      <p className="text-sm text-muted-foreground">@{student.user_data?.username || student.user?.username || 'N/A'}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/trainer/${userId}/students/${student.id}`}>
                      Ver Perfil
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
