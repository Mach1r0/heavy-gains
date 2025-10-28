"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Copy, Trash2, Users, Clock, Apple } from "lucide-react"
import Link from "next/link"

// Mock data
const mockDiet = {
  id: 1,
  name: "Dieta Hipertrofia 3000 kcal",
  category: "Hipertrofia",
  description: "Plano alimentar focado em ganho de massa muscular com distribuição balanceada de macronutrientes.",
  targetCalories: 3000,
  students: 8,
  lastUsed: "2024-01-15",
  meals: [
    {
      id: 1,
      name: "Café da Manhã",
      time: "07:00",
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
      foods: [
        { name: "Arroz Integral", quantity: "150", unit: "g", calories: 195, protein: 4.5, carbs: 40.5, fat: 1.5 },
        { name: "Frango Grelhado", quantity: "200", unit: "g", calories: 330, protein: 62, carbs: 0, fat: 7.2 },
        { name: "Feijão", quantity: "100", unit: "g", calories: 77, protein: 4.5, carbs: 14, fat: 0.5 },
        { name: "Brócolis", quantity: "100", unit: "g", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
        { name: "Salada", quantity: "100", unit: "g", calories: 20, protein: 1, carbs: 4, fat: 0.2 },
      ],
    },
    {
      id: 4,
      name: "Lanche da Tarde",
      time: "16:00",
      foods: [
        { name: "Batata Doce", quantity: "200", unit: "g", calories: 172, protein: 3.2, carbs: 40, fat: 0.2 },
        { name: "Ovo Cozido", quantity: "2", unit: "un", calories: 140, protein: 12, carbs: 1, fat: 10 },
      ],
    },
    {
      id: 5,
      name: "Jantar",
      time: "19:00",
      foods: [
        { name: "Arroz Integral", quantity: "100", unit: "g", calories: 130, protein: 3, carbs: 27, fat: 1 },
        { name: "Salmão Grelhado", quantity: "150", unit: "g", calories: 312, protein: 31.5, carbs: 0, fat: 20.3 },
        { name: "Aspargos", quantity: "100", unit: "g", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 },
        { name: "Salada", quantity: "100", unit: "g", calories: 20, protein: 1, carbs: 4, fat: 0.2 },
      ],
    },
    {
      id: 6,
      name: "Ceia",
      time: "22:00",
      foods: [
        { name: "Iogurte Grego", quantity: "200", unit: "g", calories: 130, protein: 20, carbs: 9, fat: 0.7 },
        { name: "Castanhas", quantity: "30", unit: "g", calories: 196, protein: 6, carbs: 4, fat: 19 },
      ],
    },
  ],
}

export default function DietDetailPage() {
  const totalCalories = mockDiet.meals.reduce(
    (acc, meal) => acc + meal.foods.reduce((sum, food) => sum + food.calories, 0),
    0,
  )
  const totalProtein = mockDiet.meals.reduce(
    (acc, meal) => acc + meal.foods.reduce((sum, food) => sum + food.protein, 0),
    0,
  )
  const totalCarbs = mockDiet.meals.reduce(
    (acc, meal) => acc + meal.foods.reduce((sum, food) => sum + food.carbs, 0),
    0,
  )
  const totalFat = mockDiet.meals.reduce((acc, meal) => acc + meal.foods.reduce((sum, food) => sum + food.fat, 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/trainer/diets">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{mockDiet.name}</h1>
                  <Badge>{mockDiet.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{mockDiet.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trainer/diets/${mockDiet.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Macros Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{Math.round(totalCalories)}</p>
              <p className="text-xs text-muted-foreground mt-1">Calorias Totais</p>
              <p className="text-xs text-green-500 mt-1">Meta: {mockDiet.targetCalories} kcal</p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{Math.round(totalProtein)}g</p>
              <p className="text-xs text-muted-foreground mt-1">Proteínas</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalProtein * 4 * 100) / totalCalories)}% das calorias
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{Math.round(totalCarbs)}g</p>
              <p className="text-xs text-muted-foreground mt-1">Carboidratos</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalCarbs * 4 * 100) / totalCalories)}% das calorias
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{Math.round(totalFat)}g</p>
              <p className="text-xs text-muted-foreground mt-1">Gorduras</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalFat * 9 * 100) / totalCalories)}% das calorias
              </p>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Apple className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockDiet.meals.length}</p>
                <p className="text-xs text-muted-foreground">Refeições</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockDiet.meals[0].time} - {mockDiet.meals[mockDiet.meals.length - 1].time}
                </p>
                <p className="text-xs text-muted-foreground">Horário</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockDiet.students}</p>
                <p className="text-xs text-muted-foreground">Alunos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Refeições</h2>
          {mockDiet.meals.map((meal) => {
            const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0)
            const mealProtein = meal.foods.reduce((sum, food) => sum + food.protein, 0)
            const mealCarbs = meal.foods.reduce((sum, food) => sum + food.carbs, 0)
            const mealFat = meal.foods.reduce((sum, food) => sum + food.fat, 0)

            return (
              <Card key={meal.id} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{Math.round(mealCalories)} kcal</p>
                    <p className="text-xs text-muted-foreground">
                      P: {Math.round(mealProtein)}g | C: {Math.round(mealCarbs)}g | G: {Math.round(mealFat)}g
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {meal.foods.map((food, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {food.name} - {food.quantity}
                          {food.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
