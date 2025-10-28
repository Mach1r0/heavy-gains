"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"

interface Food {
  name: string
  quantity: string
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Meal {
  id: number
  name: string
  time: string
  completed: boolean
  foods: Food[]
}

const mockDiet = {
  name: "Dieta Hipertrofia 3000 kcal",
  targetCalories: 3000,
  meals: [
    {
      id: 1,
      name: "Café da Manhã",
      time: "07:00",
      completed: true,
      foods: [
        { name: "Aveia", quantity: "80", unit: "g", calories: 304, protein: 10.7, carbs: 54.8, fat: 5.4 },
        { name: "Banana", quantity: "1", unit: "un", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { name: "Whey Protein", quantity: "30", unit: "g", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
        { name: "Pasta de Amendoim", quantity: "20", unit: "g", calories: 120, protein: 5, carbs: 4, fat: 10 },
      ],
    },
    {
      id: 2,
      name: "Lanche da Manhã",
      time: "10:00",
      completed: true,
      foods: [
        { name: "Pão Integral", quantity: "2", unit: "fatias", calories: 140, protein: 6, carbs: 26, fat: 2 },
        { name: "Peito de Peru", quantity: "50", unit: "g", calories: 55, protein: 11, carbs: 1, fat: 1 },
        { name: "Queijo Cottage", quantity: "50", unit: "g", calories: 49, protein: 6, carbs: 2, fat: 2 },
      ],
    },
    {
      id: 3,
      name: "Almoço",
      time: "13:00",
      completed: false,
      foods: [
        { name: "Arroz Integral", quantity: "150", unit: "g", calories: 195, protein: 4.5, carbs: 40.5, fat: 1.5 },
        { name: "Frango Grelhado", quantity: "200", unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
        { name: "Feijão", quantity: "100", unit: "g", calories: 77, protein: 4.5, carbs: 14, fat: 0.5 },
        { name: "Brócolis", quantity: "100", unit: "g", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
      ],
    },
    {
      id: 4,
      name: "Lanche da Tarde",
      time: "16:00",
      completed: false,
      foods: [
        { name: "Batata Doce", quantity: "200", unit: "g", calories: 172, protein: 3.2, carbs: 40, fat: 0.2 },
        { name: "Ovo Cozido", quantity: "2", unit: "un", calories: 140, protein: 12, carbs: 1, fat: 10 },
      ],
    },
    {
      id: 5,
      name: "Jantar",
      time: "19:00",
      completed: false,
      foods: [
        { name: "Arroz Integral", quantity: "100", unit: "g", calories: 130, protein: 3, carbs: 27, fat: 1 },
        { name: "Salmão Grelhado", quantity: "150", unit: "g", calories: 312, protein: 31.5, carbs: 0, fat: 20.3 },
        { name: "Aspargos", quantity: "100", unit: "g", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 },
      ],
    },
    {
      id: 6,
      name: "Ceia",
      time: "22:00",
      completed: false,
      foods: [
        { name: "Iogurte Grego", quantity: "200", unit: "g", calories: 130, protein: 20, carbs: 9, fat: 0.7 },
        { name: "Castanhas", quantity: "30", unit: "g", calories: 196, protein: 6, carbs: 4, fat: 19 },
      ],
    },
  ],
}

export default function DietPage() {
  const [meals, setMeals] = useState<Meal[]>(mockDiet.meals)

  const toggleMealComplete = (mealId: number) => {
    setMeals(meals.map((meal) => (meal.id === mealId ? { ...meal, completed: !meal.completed } : meal)))
  }

  const totalCalories = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.calories, 0), 0)
  const consumedCalories = meals
    .filter((m) => m.completed)
    .reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.calories, 0), 0)

  const totalProtein = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.protein, 0), 0)
  const consumedProtein = meals
    .filter((m) => m.completed)
    .reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.protein, 0), 0)

  const totalCarbs = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.carbs, 0), 0)
  const consumedCarbs = meals
    .filter((m) => m.completed)
    .reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.carbs, 0), 0)

  const totalFat = meals.reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.fat, 0), 0)
  const consumedFat = meals
    .filter((m) => m.completed)
    .reduce((sum, meal) => sum + meal.foods.reduce((s, food) => s + food.fat, 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/student/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{mockDiet.name}</h1>
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
            const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0)
            const mealProtein = meal.foods.reduce((sum, food) => sum + food.protein, 0)
            const mealCarbs = meal.foods.reduce((sum, food) => sum + food.carbs, 0)
            const mealFat = meal.foods.reduce((sum, food) => sum + food.fat, 0)

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
                    <p className="text-lg font-bold text-foreground">{Math.round(mealCalories)} kcal</p>
                    <p className="text-xs text-muted-foreground">
                      P: {Math.round(mealProtein)}g | C: {Math.round(mealCarbs)}g | G: {Math.round(mealFat)}g
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pl-9">
                  {meal.foods.map((food, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                      <p className="font-medium text-foreground">
                        {food.name} - {food.quantity}
                        {food.unit}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{Math.round(food.calories)} kcal</span>
                        <span>P: {food.protein}g</span>
                        <span>C: {food.carbs}g</span>
                        <span>G: {food.fat}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
