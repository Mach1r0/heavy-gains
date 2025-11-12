"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Apple, TrendingUp, Calendar, Clock, CheckCircle2, Circle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getStudent, getStudentProgress, getActiveDietPlan, getTodayWorkoutSession, getWorkoutSessions } from "@/lib/api"

export default function StudentDashboard() {
  const params = useParams()
  const studentId = params.id as string
  const { user, userType, isLoading: authLoading } = useAuth()
  const [selectedTab, setSelectedTab] = useState("overview")
  
  // State for fetched data
  const [student, setStudent] = useState<any>(null)
  const [progressData, setProgressData] = useState<any[]>([])
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [activeDiet, setActiveDiet] = useState<any>(null)
  const [workoutSessions, setWorkoutSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        // Fetch student data, progress, diet, and workout info in parallel
        const [studentData, progressLogs, diet, todaySession, sessions] = await Promise.all([
          getStudent(studentId),
          getStudentProgress(studentId),
          getActiveDietPlan(studentId).catch(() => null),
          getTodayWorkoutSession(user.id).catch(() => null),
          getWorkoutSessions(user.id).catch(() => []),
        ])
        
        setStudent(studentData)
        setProgressData(progressLogs || [])
        setActiveDiet(diet)
        setTodayWorkout(todaySession)
        setWorkoutSessions(sessions || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user?.id) {
      fetchDashboardData()
    }
  }, [studentId, user?.id, authLoading])

  // Calculate stats from real data
  const workoutsThisWeek = workoutSessions.filter(session => {
    const sessionDate = new Date(session.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return sessionDate >= weekAgo && session.status === 'CMP'
  }).length

  const currentWeight = progressData[progressData.length - 1]?.current_weight || 0
  const startWeight = progressData[0]?.start_weight || progressData[0]?.current_weight || 0
  const goalWeight = progressData[progressData.length - 1]?.goal_weight || 0

  // Format progress data for chart (last 6 weeks)
  const chartData = progressData.slice(-6).map((log, index) => ({
    date: `Sem ${index + 1}`,
    weight: log.current_weight
  }))

  // Calculate total calories from active diet
  const totalCalories = activeDiet?.meals?.reduce((sum: number, meal: any) => {
    const mealCalories = meal.food_items?.reduce((mealSum: number, item: any) => 
      mealSum + (item.calories * item.quantity / 100), 0) || 0
    return sum + mealCalories
  }, 0) || 0

  const consumedCalories = 0 // TODO: Track meal completion

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {user?.first_name || 'Estudante'}!</h1>
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
                <AvatarImage src={user?.profile_picture || "/placeholder.svg"} />
                <AvatarFallback>{user?.first_name?.[0] || 'E'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">
                {workoutsThisWeek}/5
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Treinos esta semana</p>
            <Progress value={(workoutsThisWeek / 5) * 100} className="h-2" />
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Apple className="h-5 w-5 text-green-500" />
              </div>
              <Badge variant="secondary">
                {totalCalories > 0 ? Math.round((consumedCalories / totalCalories) * 100) : 0}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Adesão à dieta</p>
            <Progress value={totalCalories > 0 ? (consumedCalories / totalCalories) * 100 : 0} className="h-2" />
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <Badge variant="secondary">{currentWeight || 0} kg</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Peso atual</p>
            {startWeight > 0 && currentWeight > 0 && (
              <p className="text-xs text-green-500">
                -{(startWeight - currentWeight).toFixed(1)}kg desde o início
              </p>
            )}
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
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Treino de Hoje</h3>
                  <Badge variant={todayWorkout?.status === 'CMP' ? "default" : "secondary"}>
                    {todayWorkout?.status === 'CMP' ? "Completo" : "Pendente"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {todayWorkout ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{todayWorkout.workout?.name || 'Treino'}</p>
                          <p className="text-sm text-muted-foreground">{todayWorkout.exercise_logs?.length || 0} exercícios</p>
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <Link href={`/student/${studentId}/workout`}>Iniciar Treino</Link>
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum treino programado para hoje
                    </p>
                  )}
                </div>
              </Card>

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
                        {activeDiet?.meals?.length || 0} refeições
                      </p>
                      <Progress value={totalCalories > 0 ? (consumedCalories / totalCalories) * 100 : 0} className="h-2 mt-2" />
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <Link href={`/student/${studentId}/diet`}>Ver Dieta Completa</Link>
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Evolução de Peso</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#93c5fd" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    style={{ fill: "#93c5fd" }}
                  />
                  <YAxis 
                    stroke="#3b82f6" 
                    fontSize={12} 
                    domain={[79, 86]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}kg`}
                    style={{ fill: "#3b82f6" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: 600 }}
                    formatter={(value: number) => [`${value} kg`, "Peso"]}
                  />
                  <Area 
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#weightGradient)"
                    name="Peso (kg)"
                    dot={{
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      r: 4,
                      stroke: "hsl(var(--background))",
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: "hsl(var(--background))",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sem dados de progresso disponíveis
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="workout" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{todayWorkout?.workout?.name || 'Treino'}</h2>
                  <p className="text-sm text-muted-foreground">{todayWorkout?.exercise_logs?.length || 0} exercícios</p>
                </div>
                <Button>Iniciar Treino</Button>
              </div>

              <div className="space-y-3">
                {todayWorkout?.exercise_logs?.length > 0 ? todayWorkout.exercise_logs.map((exerciseLog: any, index: number) => (
                  <Card key={index} className="p-4 bg-muted/30 border-border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{exerciseLog.exercise?.name || 'Exercício'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exerciseLog.sets_completed || 0}/{exerciseLog.sets || 0} séries × {exerciseLog.reps || 0} repetições
                        </p>
                      </div>
                      {exerciseLog.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </Card>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum exercício disponível
                  </p>
                )}
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
              {activeDiet?.meals && activeDiet.meals.length > 0 ? activeDiet.meals.map((meal: any, index: number) => {
                const mealCalories = meal.food_items?.reduce((sum: number, item: any) => 
                  sum + (item.calories * item.quantity / 100), 0) || 0
                
                return (
                  <Card key={index} className="p-4 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Apple className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{meal.meal_type || 'Refeição'}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {meal.time || '--:--'}
                            </span>
                            <span>{Math.round(mealCalories)} kcal</span>
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
                )
              }) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma refeição cadastrada
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">Peso Inicial</p>
                <p className="text-3xl font-bold text-foreground">{startWeight} kg</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {progressData[0]?.date ? new Date(progressData[0].date).toLocaleDateString("pt-BR") : '--/--/----'}
                </p>
              </Card>

              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">Peso Atual</p>
                <p className="text-3xl font-bold text-foreground">{currentWeight} kg</p>
                {startWeight > 0 && currentWeight > 0 && startWeight !== currentWeight && (
                  <p className="text-xs text-green-500 mt-1">
                    -{(startWeight - currentWeight).toFixed(1)}kg (
                    {(((startWeight - currentWeight) / startWeight) * 100).toFixed(1)}%)
                  </p>
                )}
              </Card>

              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">Meta</p>
                <p className="text-3xl font-bold text-foreground">{goalWeight} kg</p>
                {goalWeight > 0 && currentWeight > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Faltam {Math.abs(currentWeight - goalWeight).toFixed(1)}kg
                  </p>
                )}
              </Card>
            </div>

            {/* Progress Chart */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Evolução de Peso (6 semanas)</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGradientProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#93c5fd" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    style={{ fill: "#93c5fd" }}
                  />
                  <YAxis 
                    stroke="#3b82f6" 
                    fontSize={12} 
                    domain={[79, 86]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}kg`}
                    style={{ fill: "#3b82f6" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: 600 }}
                    formatter={(value: number) => [`${value} kg`, "Peso"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#weightGradientProgress)"
                    name="Peso (kg)"
                    dot={{
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      r: 5,
                      stroke: "hsl(var(--background))",
                    }}
                    activeDot={{
                      r: 7,
                      strokeWidth: 2,
                      stroke: "hsl(var(--background))",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sem dados de progresso disponíveis
                </p>
              )}
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
                    <p className="text-2xl font-bold text-foreground">
                      {workoutSessions.filter(s => s.status === 'CMP').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Treinos Completos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {totalCalories > 0 ? Math.round((consumedCalories / totalCalories) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Adesão à Dieta</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {workoutSessions.length > 0 ? 
                        Math.ceil((new Date().getTime() - new Date(workoutSessions[0].date).getTime()) / (1000 * 60 * 60 * 24)) 
                        : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Dias de Treino</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {startWeight > 0 && goalWeight > 0 && currentWeight > 0 ? 
                        Math.round(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100)
                        : 0}%
                    </p>
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
