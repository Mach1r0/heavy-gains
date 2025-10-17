"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Dumbbell, Apple, Search, Plus, MoreVertical, Calendar, Activity } from "lucide-react"
import Link from "next/link"

// Mock data - substituir com sua API
const mockStudents = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    avatar: "/male-athlete.png",
    status: "active",
    workoutsCompleted: 12,
    lastWorkout: "2024-01-15",
    progress: 85,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    avatar: "/female-athlete.png",
    status: "active",
    workoutsCompleted: 8,
    lastWorkout: "2024-01-14",
    progress: 72,
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    avatar: "/male-fitness.jpg",
    status: "inactive",
    workoutsCompleted: 3,
    lastWorkout: "2024-01-10",
    progress: 45,
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    avatar: "/female-fitness.jpg",
    status: "active",
    workoutsCompleted: 15,
    lastWorkout: "2024-01-15",
    progress: 92,
  },
]

const mockStats = {
  totalStudents: 24,
  activeStudents: 18,
  workoutsThisWeek: 156,
  avgProgress: 78,
}

export default function TrainerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Gerencie seus alunos e treinos</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Agenda
              </Button>
              <Avatar>
                <AvatarImage src="/athletic-trainer.png" />
                <AvatarFallback>PT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Alunos</p>
                <p className="text-3xl font-bold text-foreground mt-1">{mockStats.totalStudents}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                <p className="text-3xl font-bold text-foreground mt-1">{mockStats.activeStudents}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Treinos (Semana)</p>
                <p className="text-3xl font-bold text-foreground mt-1">{mockStats.workoutsThisWeek}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progresso Médio</p>
                <p className="text-3xl font-bold text-foreground mt-1">{mockStats.avgProgress}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="students">Alunos</TabsTrigger>
              <TabsTrigger value="workouts">Treinos</TabsTrigger>
              <TabsTrigger value="diets">Dietas</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/trainer/students/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Aluno
                </Link>
              </Button>
            </div>
          </div>

          <TabsContent value="students" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Students List */}
            <div className="grid gap-3">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{student.name}</h3>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>

                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{student.workoutsCompleted}</p>
                          <p className="text-xs text-muted-foreground">Treinos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{student.progress}%</p>
                          <p className="text-xs text-muted-foreground">Progresso</p>
                        </div>
                        <div className="text-center min-w-[100px]">
                          <p className="text-sm font-medium text-foreground">
                            {new Date(student.lastWorkout).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-xs text-muted-foreground">Último treino</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/trainer/students/${student.id}`}>Ver Detalhes</Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workouts">
            <Card className="p-8 bg-card border-border">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Gerenciar Treinos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie e gerencie planos de treino personalizados para seus alunos
                  </p>
                </div>
                <Button asChild>
                  <Link href="/trainer/workouts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Treino
                  </Link>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="diets">
            <Card className="p-8 bg-card border-border">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <Apple className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Gerenciar Dietas</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie planos alimentares adaptados às necessidades de cada aluno
                  </p>
                </div>
                <Button asChild>
                  <Link href="/trainer/diets/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Dieta
                  </Link>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
