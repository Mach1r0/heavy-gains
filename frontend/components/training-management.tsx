"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Edit, Eye, Dumbbell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrainingForm } from "@/components/training-form"
import { TrainingDetails } from "@/components/training-details"

interface Training {
  id: number
  name: string
  goal: "STR" | "HYP" | "END" | "WL" | "GEN"
  description: string
  start_date: string
  end_date: string
  is_active: boolean
  workouts_count: number
}

const goalLabels = {
  STR: "Força",
  HYP: "Hipertrofia",
  END: "Resistência",
  WL: "Perda de Peso",
  GEN: "Fitness Geral",
}

const goalColors = {
  STR: "bg-purple-100 text-purple-800",
  HYP: "bg-blue-100 text-blue-800",
  END: "bg-green-100 text-green-800",
  WL: "bg-orange-100 text-orange-800",
  GEN: "bg-gray-100 text-gray-800",
}

export function TrainingManagement({ studentId }: { studentId: string }) {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  useEffect(() => {
    // TODO: Fetch trainings from API
    // Mock data for now
    const mockTrainings: Training[] = [
      {
        id: 1,
        name: "Treino de Hipertrofia - ABC",
        goal: "HYP",
        description: "Treino focado em ganho de massa muscular",
        start_date: "2025-01-01",
        end_date: "2025-03-31",
        is_active: true,
        workouts_count: 5,
      },
      {
        id: 2,
        name: "Treino de Força",
        goal: "STR",
        description: "Treino para aumento de força máxima",
        start_date: "2024-10-01",
        end_date: "2024-12-31",
        is_active: false,
        workouts_count: 4,
      },
    ]

    setTrainings(mockTrainings)
    setLoading(false)
  }, [studentId])

  const handleEdit = (training: Training) => {
    setSelectedTraining(training)
    setIsEditOpen(true)
  }

  const handleView = (training: Training) => {
    setSelectedTraining(training)
    setIsViewOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">Carregando treinos...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Planos de Treino</h2>
          <p className="text-muted-foreground">Gerencie os treinos do aluno</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Treino</DialogTitle>
            </DialogHeader>
            <TrainingForm studentId={studentId} onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Trainings List */}
      {trainings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum treino criado ainda</p>
            <Button onClick={() => setIsCreateOpen(true)}>Criar Primeiro Treino</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trainings.map((training) => (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{training.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap">
                      <Badge className={goalColors[training.goal]}>{goalLabels[training.goal]}</Badge>
                      {training.is_active && <Badge variant="default">Ativo</Badge>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{training.description}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(training.start_date).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(training.end_date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Dumbbell className="h-4 w-4" />
                  <span>{training.workouts_count} treinos</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleView(training)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(training)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Treino</DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <TrainingForm studentId={studentId} training={selectedTraining} onSuccess={() => setIsEditOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Treino</DialogTitle>
          </DialogHeader>
          {selectedTraining && <TrainingDetails trainingId={selectedTraining.id} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
