"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Weight, Ruler, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { getStudentProgress, getWorkoutSessions } from "@/lib/api"

export default function ProgressPage() {
  const params = useParams()
  const studentId = params.id as string
  const { user, isLoading: authLoading } = useAuth()
  
  const [progressData, setProgressData] = useState<any[]>([])
  const [workoutSessions, setWorkoutSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        const [progress, sessions] = await Promise.all([
          getStudentProgress(studentId),
          getWorkoutSessions(user.id)
        ])
        
        setProgressData(progress || [])
        setWorkoutSessions(sessions || [])
      } catch (error) {
        console.error('Error fetching progress data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user?.id) {
      fetchProgressData()
    }
  }, [studentId, user?.id, authLoading])

  // Transform progress data for charts
  const weightData = progressData.slice(-6).map((log, index) => ({
    date: new Date(log.date).toLocaleDateString('pt-BR', { month: 'short' }),
    weight: log.current_weight
  }))

  // Calculate workout frequency by week (last 4 weeks)
  const workoutData = Array.from({ length: 4 }, (_, weekIndex) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (7 * (3 - weekIndex)))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    
    const workoutsInWeek = workoutSessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekStart && sessionDate < weekEnd && session.status === 'CMP'
    }).length
    
    return {
      week: `Sem ${weekIndex + 1}`,
      workouts: workoutsInWeek
    }
  })

  // Mock measurements data (you can add a backend endpoint for this)
  const measurementsData = [
    { part: "Peito", value: 105 },
    { part: "Cintura", value: 85 },
    { part: "Quadril", value: 98 },
    { part: "Braço", value: 38 },
    { part: "Coxa", value: 58 },
  ]

  // Calculate stats
  const currentWeight = progressData[progressData.length - 1]?.current_weight || 0
  const startWeight = progressData[0]?.start_weight || progressData[0]?.current_weight || 0
  const weightLoss = startWeight - currentWeight
  const currentBMI = progressData[progressData.length - 1]?.imc || 0
  const totalWorkouts = workoutSessions.filter(s => s.status === 'CMP').length
  const lastMonthWorkouts = workoutSessions.filter(s => {
    const sessionDate = new Date(s.date)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return sessionDate >= monthAgo && s.status === 'CMP'
  }).length

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando progresso...</div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Progresso</h1>
        <p className="text-muted-foreground">Acompanhe sua evolução e conquistas</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight.toFixed(1)} kg</div>
            {weightLoss > 0 && (
              <p className="flex items-center text-xs text-accent">
                <TrendingDown className="mr-1 h-3 w-3" />
                -{weightLoss.toFixed(1)}kg desde o início
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IMC</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBMI > 0 ? currentBMI.toFixed(1) : '--'}</div>
            <p className="text-xs text-muted-foreground">
              {currentBMI >= 18.5 && currentBMI < 25 ? 'Peso normal' : 
               currentBMI < 18.5 ? 'Abaixo do peso' : 
               currentBMI >= 25 && currentBMI < 30 ? 'Sobrepeso' : 'Obesidade'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos/Mês</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastMonthWorkouts}</div>
            <p className="flex items-center text-xs text-primary">
              <TrendingUp className="mr-1 h-3 w-3" />
              {totalWorkouts} treinos completos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weight">Peso</TabsTrigger>
          <TabsTrigger value="measurements">Medidas</TabsTrigger>
          <TabsTrigger value="workouts">Frequência</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Peso</CardTitle>
              <CardDescription>Seu progresso nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Sem dados de peso disponíveis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medidas Corporais</CardTitle>
              <CardDescription>Medidas atuais em centímetros</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={measurementsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="part" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequência de Treinos</CardTitle>
              <CardDescription>Treinos realizados por semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Recentes</CardTitle>
          <CardDescription>Suas últimas atualizações de progresso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.length > 0 ? progressData.slice(-4).reverse().map((log, i) => {
              const previousLog = i < progressData.length - 1 ? progressData[progressData.length - i - 2] : null
              const weightChange = previousLog ? (log.current_weight - previousLog.current_weight).toFixed(1) : '0'
              
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Weight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Peso</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{log.current_weight.toFixed(1)} kg</p>
                    <p className="text-sm text-muted-foreground">
                      {parseFloat(weightChange) !== 0 ? `${parseFloat(weightChange) > 0 ? '+' : ''}${weightChange} kg` : 'Primeiro registro'}
                    </p>
                  </div>
                </div>
              )
            }) : (
              <p className="text-center text-muted-foreground py-4">Nenhum registro encontrado</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
