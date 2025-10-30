"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Utensils } from "lucide-react"

interface Meal {
  id: number
  name: string
  time: string
  description?: string
  food_items: {
    name: string
    quantity: number
    unit: string
    calories: number
  }[]
  total_calories: number
}

interface DietDetailsData {
  id: number
  name: string
  goal: string
  meals: Meal[]
}

export function DietDetails({ dietId }: { dietId: number }) {
  const [diet, setDiet] = useState<DietDetailsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch diet details from API
    // Mock data for now
    const mockDiet: DietDetailsData = {
      id: dietId,
      name: "Dieta de Ganho de Massa",
      goal: "BUK",
      meals: [
        {
          id: 1,
          name: "Café da Manhã",
          time: "07:00",
          description: "Refeição pré-treino",
          food_items: [
            { name: "Aveia", quantity: 80, unit: "g", calories: 304 },
            { name: "Banana", quantity: 100, unit: "g", calories: 89 },
            { name: "Whey Protein", quantity: 30, unit: "g", calories: 120 },
          ],
          total_calories: 513,
        },
        {
          id: 2,
          name: "Almoço",
          time: "12:00",
          food_items: [
            { name: "Arroz Integral", quantity: 150, unit: "g", calories: 195 },
            { name: "Frango Grelhado", quantity: 200, unit: "g", calories: 330 },
            { name: "Brócolis", quantity: 100, unit: "g", calories: 34 },
          ],
          total_calories: 559,
        },
      ],
    }

    setDiet(mockDiet)
    setLoading(false)
  }, [dietId])

  if (loading) {
    return <div className="text-center py-8">Carregando detalhes...</div>
  }

  if (!diet) {
    return <div className="text-center py-8">Dieta não encontrada</div>
  }

  const totalDailyCalories = diet.meals.reduce((sum, meal) => sum + meal.total_calories, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{diet.name}</h3>
          <p className="text-muted-foreground">Total diário: {totalDailyCalories} kcal</p>
        </div>
      </div>

      <div className="space-y-4">
        {diet.meals.map((meal) => (
          <Card key={meal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{meal.name}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {meal.time}
                  </div>
                  <Badge variant="secondary">{meal.total_calories} kcal</Badge>
                </div>
              </div>
              {meal.description && <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meal.food_items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {item.quantity}
                        {item.unit}
                      </span>
                      <span className="font-medium">{item.calories} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
