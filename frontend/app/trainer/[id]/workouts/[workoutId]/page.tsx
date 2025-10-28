"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Copy, Trash2, Users, Clock, Dumbbell } from "lucide-react"
import Link from "next/link"

// Mock data
const mockWorkout = {
  id: 1,
  name: "Treino A - Peito e Tríceps",
  category: "Hipertrofia",
  description: "Treino focado em desenvolvimento de peito e tríceps com ênfase em hipertrofia muscular.",
  students: 12,
  lastUsed: "2024-01-15",
  exercises: [
    {
      id: 1,
      name: "Supino Reto com Barra",
      sets: "4",
      reps: "8-12",
      rest: "90",
      notes: "Manter cotovelos a 45°, descer até o peito",
    },
    {
      id: 2,
      name: "Supino Inclinado com Halteres",
      sets: "3",
      reps: "10-12",
      rest: "60",
      notes: "Inclinação de 30-45°",
    },
    {
      id: 3,
      name: "Crucifixo na Polia",
      sets: "3",
      reps: "12-15",
      rest: "45",
      notes: "Foco na contração do peitoral",
    },
    {
      id: 4,
      name: "Tríceps Testa com Barra W",
      sets: "3",
      reps: "10-12",
      rest: "60",
      notes: "Manter cotovelos fixos",
    },
    {
      id: 5,
      name: "Tríceps na Polia",
      sets: "3",
      reps: "12-15",
      rest: "45",
      notes: "Usar corda, extensão completa",
    },
    {
      id: 6,
      name: "Mergulho em Paralelas",
      sets: "3",
      reps: "8-12",
      rest: "60",
      notes: "Inclinar corpo para frente para focar no peito",
    },
  ],
}

export default function WorkoutDetailPage() {
  const totalSets = mockWorkout.exercises.reduce((acc, ex) => acc + Number.parseInt(ex.sets), 0)
  const estimatedTime = mockWorkout.exercises.reduce((acc, ex) => {
    const sets = Number.parseInt(ex.sets)
    const rest = Number.parseInt(ex.rest)
    return acc + sets * 60 + (sets - 1) * rest
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/trainer/workouts">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{mockWorkout.name}</h1>
                  <Badge>{mockWorkout.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{mockWorkout.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trainer/workouts/${mockWorkout.id}/edit`}>
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
                <p className="text-2xl font-bold text-foreground">{mockWorkout.exercises.length}</p>
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
                <p className="text-2xl font-bold text-foreground">{mockWorkout.students}</p>
                <p className="text-xs text-muted-foreground">Alunos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Exercícios</h2>
          {mockWorkout.exercises.map((exercise, index) => (
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
