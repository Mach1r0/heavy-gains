"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Dumbbell, Apple, TrendingUp, MessageSquare, Edit, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data
const mockStudent = {
  id: 1,
  name: "João Silva",
  email: "joao@email.com",
  avatar: "/male-athlete.png",
  status: "active",
  joinDate: "2023-10-15",
  age: 28,
  weight: 82,
  height: 178,
  goal: "Hipertrofia",
}

const mockProgressData = [
  { date: "Sem 1", weight: 85, muscle: 35 },
  { date: "Sem 2", weight: 84, muscle: 35.5 },
  { date: "Sem 3", weight: 83.5, muscle: 36 },
  { date: "Sem 4", weight: 83, muscle: 36.5 },
  { date: "Sem 5", weight: 82.5, muscle: 37 },
  { date: "Sem 6", weight: 82, muscle: 37.5 },
]

const mockWorkouts = [
  { id: 1, name: "Treino A - Peito e Tríceps", lastCompleted: "2024-01-15", completionRate: 100 },
  { id: 2, name: "Treino B - Costas e Bíceps", lastCompleted: "2024-01-14", completionRate: 100 },
  { id: 3, name: "Treino C - Pernas", lastCompleted: "2024-01-13", completionRate: 85 },
]

export default function StudentDetail() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/trainer/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Perfil do Aluno</h1>
                <p className="text-sm text-muted-foreground">Acompanhamento detalhado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Student Info Card */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockStudent.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {mockStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">{mockStudent.name}</h2>
                  <Badge>{mockStudent.status === "active" ? "Ativo" : "Inativo"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{mockStudent.email}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{mockStudent.age}</span> anos
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{mockStudent.weight}</span> kg
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{mockStudent.height}</span> cm
                  </span>
                  <span className="text-muted-foreground">
                    Objetivo: <span className="font-medium text-foreground">{mockStudent.goal}</span>
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Treinos Completos</p>
                <p className="text-3xl font-bold text-foreground mt-1">12</p>
                <p className="text-xs text-green-500 mt-1">+3 esta semana</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Adesão à Dieta</p>
                <p className="text-3xl font-bold text-foreground mt-1">87%</p>
                <p className="text-xs text-green-500 mt-1">+5% vs mês anterior</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Apple className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progresso Geral</p>
                <p className="text-3xl font-bold text-foreground mt-1">85%</p>
                <p className="text-xs text-green-500 mt-1">No caminho certo</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="workouts">Treinos</TabsTrigger>
            <TabsTrigger value="diet">Dieta</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Evolução de Peso e Massa Muscular</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockProgressData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Peso (kg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="muscle"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Massa Muscular (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Treinos Atribuídos</h3>
              <Button size="sm">Atribuir Novo Treino</Button>
            </div>
            <div className="grid gap-3">
              {mockWorkouts.map((workout) => (
                <Card key={workout.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{workout.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Último treino: {new Date(workout.lastCompleted).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{workout.completionRate}%</p>
                        <p className="text-xs text-muted-foreground">Conclusão</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diet">
            <Card className="p-8 bg-card border-border">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <Apple className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Plano Alimentar</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Atribua um plano alimentar personalizado para este aluno
                  </p>
                </div>
                <Button>Atribuir Dieta</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Histórico de Atividades</h3>
              <div className="space-y-4">
                {[
                  { date: "2024-01-15", action: "Completou Treino A - Peito e Tríceps", type: "workout" },
                  { date: "2024-01-14", action: "Completou Treino B - Costas e Bíceps", type: "workout" },
                  { date: "2024-01-14", action: "Registrou refeição - Almoço", type: "diet" },
                  { date: "2024-01-13", action: "Completou Treino C - Pernas", type: "workout" },
                  { date: "2024-01-13", action: "Atualização de peso: 82kg", type: "progress" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {item.type === "workout" && <Dumbbell className="h-4 w-4 text-primary" />}
                      {item.type === "diet" && <Apple className="h-4 w-4 text-green-500" />}
                      {item.type === "progress" && <TrendingUp className="h-4 w-4 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
