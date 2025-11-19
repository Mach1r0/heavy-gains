"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, GripVertical, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"

interface ExerciseSeries {
  id: string
  reps: string
  rest: string
  notes?: string
}

interface Exercise {
  id: string
  name: string
  notes?: string
  series: ExerciseSeries[]
  workout_id?: number
}

export default function EditWorkoutPage() {
  const params = useParams()
  const router = useRouter()
  const workoutId = params?.workoutId as string
  const trainerId = params?.id as string
  
  const [workoutName, setWorkoutName] = useState("")
  const [category, setCategory] = useState("hipertrofia")
  const [description, setDescription] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workout, setWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      notes: "",
      series: [{ id: `${Date.now().toString()}-1`, reps: "12", rest: "60" }],
    }
    setExercises([...exercises, newExercise])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const updateExerciseName = (id: string, value: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, name: value } : ex)))
  }

  const updateExerciseNotes = (id: string, value: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, notes: value } : ex)))
  }

  const addSeries = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex
        return {
          ...ex,
          series: [
            ...ex.series,
            { id: `${exerciseId}-${ex.series.length + 1}`, reps: "12", rest: "60" },
          ],
        }
      })
    )
  }

  const updateSeriesField = (exerciseId: string, seriesId: string, field: keyof ExerciseSeries, value: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex
        return {
          ...ex,
          series: ex.series.map((s) => (s.id === seriesId ? { ...s, [field]: value } : s)),
        }
      })
    )
  }

  const removeSeries = (exerciseId: string, seriesId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex
        return { ...ex, series: ex.series.filter((s) => s.id !== seriesId) }
      })
    )
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
              setWorkoutName(foundWorkout.name)
              setCategory(foundWorkout.goal || 'hipertrofia')
              setDescription(foundWorkout.description || '')
              
              const exercisesData = foundWorkout.workouts?.flatMap((workout: any) => 
                workout.exercises?.map((ex: any) => {
                  const numSets = parseInt(ex.sets) || 1
                  const series = Array.from({ length: numSets }, (_, i) => ({
                    id: `${ex.id}-${i + 1}`,
                    reps: ex.reps || '12',
                    rest: ex.rest_time || '60',
                  }))
                  
                  return {
                    id: ex.id.toString(),
                    name: ex.name,
                    notes: ex.notes || '',
                    series,
                    workout_id: workout.id
                  }
                }) || []
              ) || []
              
              setExercises(exercisesData)
              setWorkout(foundWorkout)
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

  const handleSave = async () => {
    try {
      setSaving(true)
      
      for (const exercise of exercises) {
        if (exercise.workout_id) {
          const workoutExerciseData = {
            sets: exercise.series.length,
            reps: exercise.series[0]?.reps || '12',
            rest_time: exercise.series[0]?.rest || '60',
            notes: exercise.notes || ''
          }
          
          await apiClient.patch(
            `/training/workout-exercises/${exercise.id}/`,
            workoutExerciseData
          )
        }
      }
      
      if (workout?.training_ids && workout.training_ids.length > 0) {
        for (const trainingId of workout.training_ids) {
          await apiClient.patch(`/training/${trainingId}/`, {
            name: workoutName,
            description: description,
            goal: category
          })
        }
      }
      
      alert('Treino atualizado com sucesso!')
      router.push(`/trainer/${trainerId}/workouts/${encodeURIComponent(workoutName)}`)
    } catch (error) {
      console.error('Erro ao salvar treino:', error)
      alert('Erro ao salvar treino. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Treino não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/${trainerId}/workouts/${encodeURIComponent(workoutName)}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Treino</h1>
                <p className="text-sm text-muted-foreground">Atualize as informações do treino</p>
                <p className="text-xs text-muted-foreground mt-1">Total de séries: <span className="font-semibold text-foreground">{exercises.reduce((acc, ex) => acc + (ex.series?.length || 0), 0)}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trainer/${trainerId}/workouts/${encodeURIComponent(workoutName)}`}>Cancelar</Link>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Workout Info */}
        <Card className="p-6 bg-card border-border mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Informações do Treino</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Treino</Label>
              <Input
                id="name"
                placeholder="Ex: Treino A - Peito e Tríceps"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                    <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                    <SelectItem value="funcional">Funcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Adicione observações sobre o treino..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Exercícios</h2>
            <Button onClick={addExercise} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercício
            </Button>
          </div>

          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="p-4 bg-card border-border">
              <div className="flex items-start gap-3">
                <div className="mt-8 cursor-move">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Exercício {index + 1}</Label>
                    {exercises.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeExercise(exercise.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exercise-name-${exercise.id}`}>Nome do Exercício</Label>
                    <Input
                      id={`exercise-name-${exercise.id}`}
                      placeholder="Ex: Supino Reto com Barra"
                      value={exercise.name}
                      onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exercise-notes-${exercise.id}`}>Observações (instruções para o aluno)</Label>
                    <Textarea
                      id={`exercise-notes-${exercise.id}`}
                      placeholder="Ex: Controle o movimento, foco na fase excêntrica..."
                      value={exercise.notes || ""}
                      onChange={(e) => updateExerciseNotes(exercise.id, e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Séries</Label>
                      <Button variant="outline" size="sm" onClick={() => addSeries(exercise.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Série
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {exercise.series.map((serie, idx) => (
                        <div key={serie.id} className="grid grid-cols-5 gap-2 items-end">
                          <div className="col-span-1">
                            <Label className="text-xs">Série {idx + 1}</Label>
                            <Input disabled value={idx + 1} />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label htmlFor={`reps-${serie.id}`} className="text-xs">Repetições</Label>
                            <Input
                              id={`reps-${serie.id}`}
                              placeholder="12"
                              value={serie.reps}
                              onChange={(e) => updateSeriesField(exercise.id, serie.id, "reps", e.target.value)}
                            />
                          </div>
                          <div className="col-span-1 space-y-1">
                            <Label htmlFor={`rest-${serie.id}`} className="text-xs">Descanso (s)</Label>
                            <Input
                              id={`rest-${serie.id}`}
                              type="number"
                              placeholder="60"
                              value={serie.rest}
                              onChange={(e) => updateSeriesField(exercise.id, serie.id, "rest", e.target.value)}
                            />
                          </div>
                          <div className="col-span-1 flex items-center justify-end">
                            {exercise.series.length > 1 && (
                              <Button variant="ghost" size="icon" onClick={() => removeSeries(exercise.id, serie.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Exercise Button */}
        <Button onClick={addExercise} variant="outline" className="w-full bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exercício
        </Button>
      </div>
    </div>
  )
}
