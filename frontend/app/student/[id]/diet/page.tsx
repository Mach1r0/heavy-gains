"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { getActiveDietPlan } from "@/lib/api"

interface FoodItem {
  id: number
  food_item: {
    id: number
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
  }
  quantity: number
  unit: string
}

interface Meal {
  id: number
  name: string
  time: string
  description?: string
  completed?: boolean
  food_items: FoodItem[]
}

interface DietPlan {
  id: number
  name: string
  goal: string
  meals: Meal[]
}

export default function DietPage() {
  const params = useParams()
  const studentId = params.id as string
  const { user, isLoading: authLoading } = useAuth()
  
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDietPlan = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const plan = await getActiveDietPlan(studentId)
        
        if (plan) {
          setDietPlan(plan)
          // Add completed status to meals (you can track this in localStorage or backend)
          const mealsWithStatus = plan.meals.map((meal: Meal) => ({
            ...meal,
            completed: false
          }))
          setMeals(mealsWithStatus)
        }
      } catch (error) {
        console.error('Error fetching diet plan:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user?.id) {
      fetchDietPlan()
    }
  }, [studentId, user?.id, authLoading])

  const toggleMealComplete = (mealId: number) => {
    setMeals(meals.map((meal) => (meal.id === mealId ? { ...meal, completed: !meal.completed } : meal)))
  }

  // Calculate macros from real data
  const calculateMealMacros = (meal: Meal) => {
    return meal.food_items.reduce((acc, item) => {
      const multiplier = item.quantity / 100 // Since values are per 100g
      return {
        calories: acc.calories + (item.food_item.calories * multiplier),
        protein: acc.protein + (item.food_item.protein * multiplier),
        carbs: acc.carbs + (item.food_item.carbs * multiplier),
        fats: acc.fats + (item.food_item.fats * multiplier),
      }
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 })
  }

  const totalCalories = meals.reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.calories
  }, 0)

  const consumedCalories = meals.filter(m => m.completed).reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.calories
  }, 0)

  const totalProtein = meals.reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.protein
  }, 0)

  const consumedProtein = meals.filter(m => m.completed).reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.protein
  }, 0)

  const totalCarbs = meals.reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.carbs
  }, 0)

  const consumedCarbs = meals.filter(m => m.completed).reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.carbs
  }, 0)

  const totalFat = meals.reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.fats
  }, 0)

  const consumedFat = meals.filter(m => m.completed).reduce((sum, meal) => {
    const macros = calculateMealMacros(meal)
    return sum + macros.fats
  }, 0)

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando dieta...</div>
      </div>
    )
  }

  if (!dietPlan || meals.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/student/${studentId}/dashboard`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Dieta</h1>
            </div>
          </div>
        </header>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Nenhum plano de dieta ativo encontrado</p>
            <p className="text-sm text-muted-foreground mt-2">Entre em contato com seu treinador</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/student/${studentId}/dashboard`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{dietPlan.name}</h1>
                <p className="text-sm text-muted-foreground">Seu plano alimentar de hoje</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Macros Summary */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Calorias</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(consumedCalories)}/{Math.round(totalCalories)}
              </p>
              <Progress value={(consumedCalories / totalCalories) * 100} className="h-2 mt-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Proteínas</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(consumedProtein)}/{Math.round(totalProtein)}g
              </p>
              <Progress value={(consumedProtein / totalProtein) * 100} className="h-2 mt-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Carboidratos</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(consumedCarbs)}/{Math.round(totalCarbs)}g
              </p>
              <Progress value={(consumedCarbs / totalCarbs) * 100} className="h-2 mt-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Gorduras</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(consumedFat)}/{Math.round(totalFat)}g
              </p>
              <Progress value={(consumedFat / totalFat) * 100} className="h-2 mt-2" />
            </div>
          </div>
        </Card>

        {/* Meals */}
        <div className="space-y-4">
          {meals.map((meal) => {
            const macros = calculateMealMacros(meal)

            return (
              <Card
                key={meal.id}
                className={`p-4 border-2 transition-colors ${
                  meal.completed ? "bg-green-500/5 border-green-500/50" : "bg-card border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleMealComplete(meal.id)} className="mt-1">
                      {meal.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{meal.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{meal.time}</span>
                        {meal.completed && <Badge variant="default">Registrado</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{Math.round(macros.calories)} kcal</p>
                    <p className="text-xs text-muted-foreground">
                      P: {Math.round(macros.protein)}g | C: {Math.round(macros.carbs)}g | G: {Math.round(macros.fats)}g
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pl-9">
                  {meal.food_items.map((item, index) => {
                    const itemCalories = (item.food_item.calories * item.quantity) / 100
                    const itemProtein = (item.food_item.protein * item.quantity) / 100
                    const itemCarbs = (item.food_item.carbs * item.quantity) / 100
                    const itemFats = (item.food_item.fats * item.quantity) / 100

                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                        <p className="font-medium text-foreground">
                          {item.food_item.name} - {item.quantity}{item.unit}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{Math.round(itemCalories)} kcal</span>
                          <span>P: {itemProtein.toFixed(1)}g</span>
                          <span>C: {itemCarbs.toFixed(1)}g</span>
                          <span>G: {itemFats.toFixed(1)}g</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
