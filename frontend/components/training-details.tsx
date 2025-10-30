"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock } from "lucide-react"

interface Exercise {
  id: number
  name: string
  sets: number
  reps: number
  rest_time: string
  notes?: string
}

interface Workout {
  id: number
  name: string
  day_of_week: string
  exercises: Exercise[]
}

interface TrainingDetailsData {
  id: number
  name: string
  goal: string
  description: string
  workouts: Workout[]
}

const dayLabels: Record<string, string> = {
  "0": "Domingo",
  "1": "Segunda-feira",
  "2": "Terça-feira",
  "3": "Quarta-feira",
  "4": "Quinta-feira",
  "5": "Sexta-feira",
  "6": "Sábado",
}

export function TrainingDetails({ trainingId }: { trainingId: number }) {
  const [training, setTraining] = useState<TrainingDetailsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch training details from API
    // Mock data for now
    const mockTraining: TrainingDetailsData = {
      id: trainingId,
      name: "Treino de Hipertrofia - ABC",
      goal: "HYP",
      description: "Treino focado em ganho de massa muscular",
      workouts: [
        {
          id: 1,
          name: "Treino A - Peito e Tríceps",
          day_of_week: "1",
          exercises: [
            {
              id: 1,
              name: "Supino Reto",
              sets: 4,
              reps: 10,
              rest_time: "00:01:30",
              notes: "Controlar a descida",
            },
            {
              id: 2,
              name: "Supino Inclinado",
              sets: 3,
              reps: 12,
              rest_time: "00:01:00",
            },
            {
              id: 3,
              name: "Tríceps Testa",
              sets: 3,
              reps: 12,
              rest_time: "00:01:00",
            },
          ],
        },
        {
          id: 2,
          name: "Treino B - Costas e Bíceps",
          day_of_week: "3",
          exercises: [
            {
              id: 4,
              name: "Barra Fixa",
              sets: 4,
              reps: 8,
              rest_time: "00:02:00",
              notes: "Usar pegada pronada",
            },
            {
              id: 5,
              name: "Remada Curvada",
              sets: 4,
              reps: 10,
              rest_time: "00:01:30",
            },
            {
              id: 6,
              name: "Rosca Direta",
              sets: 3,
              reps: 12,
              rest_time: "00:01:00",
            },
          ],
        },
      ],
    }

    setTraining(mockTraining)
    setLoading(false)
  }, [trainingId])

  if (loading) {
    return <div className="text-center py-8">Carregando detalhes...</div>
  }

  if (!training) {
    return <div className="text-center py-8">Treino não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">{training.name}</h3>
        <p className="text-muted-foreground mt-1">{training.description}</p>
      </div>

      <div className="space-y-4">
        {training.workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workout.name}</CardTitle>
                <Badge variant="secondary">{dayLabels[workout.day_of_week]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-primary" />
                        <span className="font-medium">{exercise.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {exercise.rest_time.slice(3)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {exercise.sets} séries x {exercise.reps} repetições
                      </span>
                    </div>
                    {exercise.notes && <p className="text-sm text-muted-foreground mt-2 italic">{exercise.notes}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
