"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Users, Calendar, Target } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { getDietPlan } from "@/lib/api/diets"

const goalLabels = {
  BUK: "Bulking",
  CUT: "Cutting",
  MAINT: "Manutenção",
}

const goalColors = {
  BUK: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CUT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  MAINT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

export default function DietDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const dietId = params?.dietId as string
  const userId = params?.id as string
  const studentId = searchParams.get('student')
  
  const [loading, setLoading] = useState(true)
  const [diet, setDiet] = useState<any>(null)

  useEffect(() => {
    if (dietId) {
      fetchDiet()
    }
  }, [dietId])

  const fetchDiet = async () => {
    try {
      setLoading(true)
      const dietData = await getDietPlan(dietId)
      console.log('Diet data:', dietData)
      setDiet(dietData)
    } catch (error) {
      console.error('Error fetching diet:', error)
      alert('Erro ao carregar dieta')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Carregando dieta...</div>
      </div>
    )
  }

  if (!diet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Dieta não encontrada</div>
      </div>
    )
  }

  const totalCalories = diet.meals?.reduce((total: number, meal: any) => {
    const mealCalories = meal.food_items?.reduce((mealTotal: number, item: any) => {
      return mealTotal + (item.food_item?.calories || 0) * (item.quantity / 100)
    }, 0) || 0
    return total + mealCalories
  }, 0) || 0
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={studentId ? `/trainer/${userId}/students/${studentId}` : `/trainer/${userId}/diets`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{diet.name}</h1>
                  <Badge className={goalColors[diet.goal as keyof typeof goalColors]}>
                    {goalLabels[diet.goal as keyof typeof goalLabels]}
                  </Badge>
                  {diet.is_active && <Badge>Ativa</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {diet.student?.first_name} {diet.student?.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trainer/${userId}/diets/${dietId}/edit${studentId ? `?student=${studentId}` : ''}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Student Info */}
        <Link href={`/trainer/${userId}/students/${diet.student?.id}`}>
          <Card className="p-6 bg-card border-border mb-6 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Aluno (clique para ver perfil)</p>
                <p className="text-xl font-bold text-foreground">
                  {diet.student?.first_name} {diet.student?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">@{diet.student?.username}</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Diet Info */}
        <Card className="p-6 bg-card border-border mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Informações Gerais</h2>
          
          {diet.description && (
            <p className="text-muted-foreground mb-4">{diet.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {diet.target_calories || totalCalories.toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">kcal/dia</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {new Date(diet.start_date).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">Data de início</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{diet.meals?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Refeições</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Meals */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Refeições</h2>
          
          {diet.meals?.map((meal: any, index: number) => (
            <Card key={meal.id} className="p-4 bg-card border-border">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{meal.name}</h3>
                  <Badge variant="outline">{meal.time}</Badge>
                </div>
                {meal.description && (
                  <p className="text-sm text-muted-foreground">{meal.description}</p>
                )}
              </div>

              <div className="space-y-3">
                {meal.food_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.food_item?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}{item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {((item.food_item?.calories || 0) * (item.quantity / 100)).toFixed(0)} kcal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        P: {((item.food_item?.protein || 0) * (item.quantity / 100)).toFixed(1)}g • 
                        C: {((item.food_item?.carbs || 0) * (item.quantity / 100)).toFixed(1)}g • 
                        G: {((item.food_item?.fats || 0) * (item.quantity / 100)).toFixed(1)}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
