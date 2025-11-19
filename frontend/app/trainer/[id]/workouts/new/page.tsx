"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, GripVertical, Trash2, Save, Search } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { getTeacherStudents } from "@/lib/api/teachers"
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
  exerciseId?: number
  equipment?: string
  primaryMuscles?: string[]
}

export default function NewWorkoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  const [workoutName, setWorkoutName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentSearch, setStudentSearch] = useState("")
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(studentId ? [studentId] : [])
  const [programs, setPrograms] = useState<any[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState<string>("")
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "", notes: "", series: [{ id: "1-1", reps: "12", rest: "60" }] },
  ])
  const [saving, setSaving] = useState(false)
  const [allExercises, setAllExercises] = useState<any[]>([])
  const [exerciseSearch, setExerciseSearch] = useState("")
  const [filterEquipment, setFilterEquipment] = useState("")
  const [filterMuscle, setFilterMuscle] = useState("")
  const [selectedExerciseSlotId, setSelectedExerciseSlotId] = useState<string | null>(null)

  const handleSaveWorkout = async () => {
    try {
      setSaving(true)
      
      // Validate required fields
      if (!workoutName.trim()) {
        alert("Por favor, preencha o nome do treino")
        return
      }
      
      if (!category) {
        alert("Por favor, selecione uma categoria")
        return
      }
      
      if (exercises.some(ex => !ex.name.trim())) {
        alert("Por favor, selecione ou preencha o nome de todos os exercícios")
        return
      }
      
      if (selectedStudentIds.length === 0) {
        alert("Por favor, selecione pelo menos um aluno")
        return
      }

      const user = authApi.getUserFromStorage()
      if (!user) {
        alert("Usuário não encontrado")
        return
      }

      // Get teacher ID
      const teacherResp = await apiClient.get(`/trainer/teachers/?user=${user.id}`)
      const teacher = teacherResp.data?.[0]
      if (!teacher?.id) {
        alert("Professor não encontrado")
        return
      }

      // Map category to goal choices
      const goalMap: Record<string, string> = {
        'hipertrofia': 'HYP',
        'emagrecimento': 'WL',
        'iniciante': 'GEN',
        'avancado': 'STR',
        'funcional': 'GEN'
      }

      // Create training for each selected student
      const trainingPromises = selectedStudentIds.map(async (studentId) => {
        const trainingData = {
          name: workoutName,
          description: description || "",
          goal: goalMap[category] || 'GEN',
          teacher: teacher.id,
          student: parseInt(studentId),
          program: selectedProgramId ? parseInt(selectedProgramId) : null,
          is_active: true
        };

        const trainingResponse = await apiClient.post('/training/', trainingData);
        const training = trainingResponse.data;

        // Create a workout for this training
        const workoutData = {
          training_plan: training.id,
          name: workoutName,
          day_of_week: "1" // Monday by default
        };

        const workoutResponse = await apiClient.post('/training/workouts/', workoutData);
        const workout = workoutResponse.data;

        // Create or link exercises for this workout
        for (const ex of exercises) {
          let exerciseId = ex.exerciseId
          if (!exerciseId) {
            const exerciseData = {
              name: ex.name,
              description: ex.notes || "",
              muscle_group: ex.primaryMuscles?.[0] || "general"
            }
            try {
              const exerciseResponse = await apiClient.post('/exercises/', exerciseData)
              exerciseId = exerciseResponse.data.id
            } catch (error) {
              const existingExercises = await apiClient.get(`/exercises/?search=${encodeURIComponent(ex.name)}`)
              if (existingExercises.data.length > 0) {
                exerciseId = existingExercises.data[0].id
              } else {
                throw error
              }
            }
          }

          const workoutExerciseData = {
            workout: workout.id,
            exercise: exerciseId,
            sets: ex.series.length,
            reps: ex.series[0]?.reps || "12",
            rest_time: `00:00:${(ex.series[0]?.rest || "60").padStart(2, '0')}`,
            notes: ex.notes || ""
          }
          await apiClient.post('/training/workout-exercises/', workoutExerciseData)
        }

        return training;
      });

      await Promise.all(trainingPromises)

      alert("Treino salvo com sucesso!")
      if (studentId) {
        window.location.href = `/trainer/${params?.id}/students/${studentId}`
      } else {
        window.location.href = `/trainer/${params?.id}/workouts`
      }
    } catch (error: any) {
      console.error("Error saving workout:", error)
      const errorMsg = error.response?.data?.detail || 
                      JSON.stringify(error.response?.data) || 
                      error.message
      alert(`Erro ao salvar treino: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      series: [{ id: `${Date.now().toString()}-1`, reps: "12", rest: "60" }],
    }
    setExercises([...exercises, newExercise])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const updateExerciseName = (id: string, value: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, name: value, exerciseId: undefined, equipment: undefined, primaryMuscles: undefined } : ex)))
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

  // Fetch exercise library once
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const resp = await apiClient.get('/exercises/?page_size=1000')
        setAllExercises(resp.data)
      } catch (e) {
        // noop
      }
    }
    fetchExercises()
  }, [])

  const selectExerciseSlot = (id: string) => {
    setSelectedExerciseSlotId(id)
  }
  
  const selectExistingExercise = (exercise: any) => {
    if (!selectedExerciseSlotId) return
    setExercises(prev => prev.map(ex => ex.id === selectedExerciseSlotId ? {
      ...ex,
      name: exercise.name,
      exerciseId: exercise.id,
      equipment: exercise.equipment || undefined,
      primaryMuscles: exercise.primary_muscles_list || [],
    } : ex))
    setSelectedExerciseSlotId(null)
  }

  const equipmentOptions = Array.from(new Set(allExercises.map(e => e.equipment).filter(Boolean))) as string[]
  const muscleOptions = Array.from(new Set(allExercises.flatMap(e => e.primary_muscles_list || [e.muscle_group]).filter(Boolean))) as string[]
  const filteredLibrary = allExercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    const matchesEquip = filterEquipment ? e.equipment === filterEquipment : true
    const muscles = (e.primary_muscles_list || [e.muscle_group]).map((m: string) => m.toLowerCase())
    const matchesMuscle = filterMuscle ? muscles.includes(filterMuscle.toLowerCase()) : true
    return matchesSearch && matchesEquip && matchesMuscle
  })

  useEffect(() => {
    const user = authApi.getUserFromStorage()
    if (!user) return
    const run = async () => {
      try {
        setLoadingStudents(true)
        const list = await getTeacherStudents()
        setStudents(list)
      } catch (e) {
        // noop
      } finally {
        setLoadingStudents(false)
      }
    }
    run()
  }, [])

  useEffect(() => {
    if (studentId && !selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds((prev) => [...prev, studentId])
    }
  }, [studentId, selectedStudentIds])

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true)
        const user = authApi.getUserFromStorage()
        if (!user) return
        const teacherResp = await apiClient.get(`/trainer/teachers/?user=${user.id}`)
        const teacher = teacherResp.data?.[0]
        if (!teacher?.id) return
        const resp = await apiClient.get(`/programs?teacher=${teacher.id}`)
        setPrograms(resp.data || [])
      } catch (e) {
        // noop
      } finally {
        setLoadingPrograms(false)
      }
    }
    fetchPrograms()
  }, [])

  const filteredStudents = students.filter((s) => {
    const name = s.student_name || s.student?.user_data?.username || ""
    return name.toLowerCase().includes(studentSearch.toLowerCase())
  })

  const totalSeries = exercises.reduce((acc, ex) => acc + (ex.series?.length || 0), 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/${params?.id}/workouts`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Novo Treino</h1>
                <p className="text-sm text-muted-foreground">Crie um plano de treino personalizado</p>
                <p className="text-xs text-muted-foreground mt-1">Total de séries: <span className="font-semibold text-foreground">{totalSeries}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trainer/${params?.id}/workouts`}>Cancelar</Link>
              </Button>
              <Button onClick={handleSaveWorkout} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Treino"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
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
              <div className="space-y-2">
                <Label>Programa (opcional)</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingPrograms ? "Carregando programas..." : "Selecione um programa"} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingPrograms ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">Carregando...</div>
                        ) : programs.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">Nenhum programa encontrado</div>
                        ) : (
                          programs.map((p: any) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/trainer/${params?.id}/programs/new`}>Criar Programa</Link>
                  </Button>
                </div>
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

            <div className="space-y-2">
              <Label>Vincular a alunos (opcional)</Label>
              <div className="space-y-2 border rounded-md p-2">
                <Input
                  placeholder="Pesquisar aluno pelo nome..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-auto">
                  {loadingStudents ? (
                    <div className="text-sm text-muted-foreground px-2 py-1.5">Carregando alunos...</div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-sm text-muted-foreground px-2 py-1.5">Nenhum aluno encontrado</div>
                  ) : (
                    filteredStudents.map((s) => {
                      const id = s.student_id?.toString() || s.student?.id?.toString()
                      return (
                        <label key={id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={selectedStudentIds.includes(id)}
                            onChange={(e) =>
                              setSelectedStudentIds((prev) =>
                                e.target.checked ? [...prev, id] : prev.filter((x) => x !== id)
                              )
                            }
                          />
                          <span>{s.student_name || s.student?.user_data?.username}</span>
                        </label>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Exercises */}
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
                    <div 
                      className={`border rounded-md p-3 cursor-pointer transition-colors ${
                        selectedExerciseSlotId === exercise.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => selectExerciseSlot(exercise.id)}
                    >
                      {exercise.name ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                          {exercise.exerciseId && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {exercise.equipment || 'Sem equipamento'} • {(exercise.primaryMuscles?.[0]) || 'Geral'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Clique para selecionar da biblioteca →</p>
                      )}
                    </div>
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

        <Button onClick={addExercise} variant="outline" className="w-full bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exercício
        </Button>
        </div>

        {/* Exercise Library Sidebar */}
        <div className="w-96 border-l border-border bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground mb-3">Biblioteca de Exercícios</h3>
            {selectedExerciseSlotId && (
              <div className="mb-3 p-2 bg-primary/10 border border-primary/20 rounded text-xs text-foreground">
                ✓ Slot selecionado - clique em um exercício abaixo
              </div>
            )}
            <div className="space-y-2">
              <Select value={filterEquipment || 'all'} onValueChange={(v) => setFilterEquipment(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Equipamento" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os equipamentos</SelectItem>
                  {equipmentOptions.map(eq => <SelectItem key={eq} value={eq}>{eq}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterMuscle || 'all'} onValueChange={(v) => setFilterMuscle(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Músculos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os músculos</SelectItem>
                  {muscleOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar exercícios..." 
                  className="pl-8" 
                  value={exerciseSearch} 
                  onChange={e => setExerciseSearch(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredLibrary.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nenhum exercício encontrado
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredLibrary.map(ex => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => selectExistingExercise(ex)}
                    disabled={!selectedExerciseSlotId}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedExerciseSlotId 
                        ? 'hover:bg-primary/5 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {ex.images?.[0] && (
                        <img 
                          src={`http://localhost:8000${ex.images[0].image_path}`} 
                          alt={ex.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{ex.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(ex.primary_muscles_list?.[0]) || ex.muscle_group}
                        </p>
                        {ex.equipment && (
                          <p className="text-xs text-muted-foreground">{ex.equipment}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}