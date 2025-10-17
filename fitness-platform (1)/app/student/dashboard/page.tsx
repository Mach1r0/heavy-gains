"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Apple, TrendingUp, Calendar, Clock, CheckCircle2, Circle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data
const mockStudent = {
  name: "João Silva",
  avatar: "/male-athlete.png",
  trainer: "Carlos Mendes",
  goal: "Hipertrofia",
  startDate: "2023-10-15",
}

const mockStats = {
  workoutsThisWeek: 3,
  workoutsGoal: 5,
  dietAdherence: 87,
  currentWeight: 82,
  startWeight: 85,
  goalWeight: 80,
}

const mockProgressData = [
  { date: "Sem 1", weight: 85 },
  { date: "Sem 2", weight: 84 },
  { date: "Sem 3", weight: 83.5 },
  { date: "Sem 4", weight: 83 },
  { date: "Sem 5", weight: 82.5 },
  { date: "Sem 6", weight: 82 },
]

const mockTodayWorkout = {
  id: 1,
  name: "Treino A - Peito e Tríceps",
  completed: false,
  exercises: [
    { name: "Supino Reto", sets: 4, reps: "8-12", completed: false },
    { name: "Supino Inclinado", sets: 3, reps: "10-12", completed: false },
    { name: "Crucifixo", sets: 3, reps: "12-15", completed: false },
    { name: "Tríceps Testa", sets: 3, reps: "10-12", completed: false },
  ],
}

const mockTodayMeals = [
  { name: "Café da Manhã", time: "07:00", calories: 649, completed: true },
  { name: "Lanche da Manhã", time: "10:00", calories: 244, completed: true },
  { name: "Almoço", time: "13:00", calories: 656, completed: false },
  { name: "Lanche da Tarde", time: "16:00", calories: 312, completed: false },
  { name: "Jantar", time: "19:00", calories: 482, completed: false },
  { name: "Ceia", time: "22:00", calories: 326, completed: false },
]

export default function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const totalCalories = mockTodayMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const consumedCalories = mockTodayMeals.filter((m) => m.completed).reduce((sum, meal) => sum + meal.calories, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {mockStudent.name.split(" ")[0]}!</h1>
              <p className="text-sm text-muted-foreground">Vamos treinar hoje?</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/student/messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensagens
                </Link>
              </Button>
              <Avatar>
                <AvatarImage src={mockStudent.avatar || "/placeholder.svg"} />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">
                {mockStats.workoutsThisWeek}/{mockStats.workoutsGoal}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Treinos esta semana</p>
            <Progress value={(mockStats.workoutsThisWeek / mockStats.workoutsGoal) * 100} className="h-2" />
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Apple className="h-5 w-5 text-green-500" />
              </div>
              <Badge variant="secondary">{mockStats.dietAdherence}%</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Adesão à dieta</p>
            <Progress value={mockStats.dietAdherence} className="h-2" />
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <Badge variant="secondary">{mockStats.currentWeight} kg</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Peso atual</p>
            <p className="text-xs text-green-500">
              -{mockStats.startWeight - mockStats.currentWeight}kg desde o início
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="workout">Treino de Hoje</TabsTrigger>
            <TabsTrigger value="diet">Dieta de Hoje</TabsTrigger>
            <TabsTrigger value="progress">Meu Progresso</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Today's Workout */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Treino de Hoje</h3>
                  <Badge variant={mockTodayWorkout.completed ? "default" : "secondary"}>
                    {mockTodayWorkout.completed ? "Completo" : "Pendente"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{mockTodayWorkout.name}</p>
                      <p className="text-sm text-muted-foreground">{mockTodayWorkout.exercises.length} exercícios</p>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/student/workout">Iniciar Treino</Link>
                  </Button>
                </div>
              </Card>

              {/* Today's Diet */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Dieta de Hoje</h3>
                  <Badge variant="secondary">
                    {consumedCalories}/{totalCalories} kcal
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Apple className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {mockTodayMeals.filter((m) => m.completed).length}/{mockTodayMeals.length} refeições
                      </p>
                      <Progress value={(consumedCalories / totalCalories) * 100} className="h-2 mt-2" />
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <Link href="/student/diet">Ver Dieta Completa</Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Evolução de Peso</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockProgressData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 86]} />
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
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="workout" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{mockTodayWorkout.name}</h2>
                  <p className="text-sm text-muted-foreground">{mockTodayWorkout.exercises.length} exercícios</p>
                </div>
                <Button>Iniciar Treino</Button>
              </div>

              <div className="space-y-3">
                {mockTodayWorkout.exercises.map((exercise, index) => (
                  <Card key={index} className="p-4 bg-muted/30 border-border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} séries × {exercise.reps} repetições
                        </p>
                      </div>
                      {exercise.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
            <Card className="p-6 bg-card border-border mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">Resumo Diário</h3>
                <Badge variant="secondary">
                  {consumedCalories}/{totalCalories} kcal
                </Badge>
              </div>
              <Progress value={(consumedCalories / totalCalories) * 100} className="h-2" />
            </Card>

            <div className="space-y-3">
              {mockTodayMeals.map((meal, index) => (
                <Card key={index} className="p-4 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Apple className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{meal.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meal.time}
                          </span>
                          <span>{meal.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {meal.completed ? (
                        <Badge variant="default">Registrado</Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          Registrar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">Peso Inicial</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.startWeight} kg</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(mockStudent.startDate).toLocaleDateString("pt-BR")}
                </p>
              </Card>

              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">Peso Atual</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.currentWeight} kg</p>
                <p className="text-xs text-green-500 mt-1">
                  -{mockStats.startWeight - mockStats.currentWeight}kg (
                  {(((mockStats.startWeight - mockStats.currentWeight) / mockStats.startWeight) * 100).toFixed(1)}%)
                </p>
              </Card>

              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">Meta</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.goalWeight} kg</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Faltam {mockStats.currentWeight - mockStats.goalWeight}kg
                </p>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Evolução de Peso (6 semanas)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockProgressData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 86]} />
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
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Activity Summary */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resumo de Atividades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">Treinos Completos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">87%</p>
                    <p className="text-sm text-muted-foreground">Adesão à Dieta</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">42</p>
                    <p className="text-sm text-muted-foreground">Dias de Treino</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">85%</p>
                    <p className="text-sm text-muted-foreground">Progresso Geral</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
