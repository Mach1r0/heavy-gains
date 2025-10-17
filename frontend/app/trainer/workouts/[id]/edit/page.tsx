"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, GripVertical, Trash2, Save } from "lucide-react"
import Link from "next/link"

interface Exercise {
  id: string
  name: string
  sets: string
  reps: string
  rest: string
  notes: string
}

const mockWorkout = {
  id: 1,
  name: "Treino A - Peito e Tríceps",
  category: "hipertrofia",
  description: "Treino focado em desenvolvimento de peito e tríceps com ênfase em hipertrofia muscular.",
  exercises: [
    {
      id: "1",
      name: "Supino Reto com Barra",
      sets: "4",
      reps: "8-12",
      rest: "90",
      notes: "Manter cotovelos a 45°, descer até o peito",
    },
    {
      id: "2",
      name: "Supino Inclinado com Halteres",
      sets: "3",
      reps: "10-12",
      rest: "60",
      notes: "Inclinação de 30-45°",
    },
  ],
}

export default function EditWorkoutPage() {
  const [workoutName, setWorkoutName] = useState(mockWorkout.name)
  const [category, setCategory] = useState(mockWorkout.category)
  const [description, setDescription] = useState(mockWorkout.description)
  const [exercises, setExercises] = useState<Exercise[]>(mockWorkout.exercises)

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: "3",
      reps: "12",
      rest: "60",
      notes: "",
    }
    setExercises([...exercises, newExercise])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/workouts/${mockWorkout.id}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Treino</h1>
                <p className="text-sm text-muted-foreground">Atualize as informações do treino</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trainer/workouts/${mockWorkout.id}`}>Cancelar</Link>
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
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
                      onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`sets-${exercise.id}`}>Séries</Label>
                      <Input
                        id={`sets-${exercise.id}`}
                        type="number"
                        placeholder="3"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, "sets", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`reps-${exercise.id}`}>Repetições</Label>
                      <Input
                        id={`reps-${exercise.id}`}
                        placeholder="12"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`rest-${exercise.id}`}>Descanso (s)</Label>
                      <Input
                        id={`rest-${exercise.id}`}
                        type="number"
                        placeholder="60"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(exercise.id, "rest", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`notes-${exercise.id}`}>Observações (opcional)</Label>
                    <Textarea
                      id={`notes-${exercise.id}`}
                      placeholder="Ex: Manter cotovelos a 45°, descer até o peito..."
                      value={exercise.notes}
                      onChange={(e) => updateExercise(exercise.id, "notes", e.target.value)}
                      rows={2}
                    />
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
