"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, GripVertical, Trash2, Save } from "lucide-react"
import Link from "next/link"

interface Meal {
  id: string
  name: string
  time: string
  foods: Food[]
}

interface Food {
  id: string
  name: string
  quantity: string
  unit: string
  calories: string
  protein: string
  carbs: string
  fat: string
}

// Mock data
const mockDiet = {
  id: 1,
  name: "Dieta Hipertrofia 3000 kcal",
  category: "hipertrofia",
  targetCalories: "3000",
  description: "Plano alimentar focado em ganho de massa muscular com distribuição balanceada de macronutrientes.",
  meals: [
    {
      id: "1",
      name: "Café da Manhã",
      time: "07:00",
      foods: [
        {
          id: "1",
          name: "Aveia",
          quantity: "80",
          unit: "g",
          calories: "304",
          protein: "10.7",
          carbs: "54.8",
          fat: "5.4",
        },
        {
          id: "2",
          name: "Banana",
          quantity: "1",
          unit: "un",
          calories: "105",
          protein: "1.3",
          carbs: "27",
          fat: "0.4",
        },
      ],
    },
  ],
}

export default function EditDietPage() {
  const [dietName, setDietName] = useState(mockDiet.name)
  const [category, setCategory] = useState(mockDiet.category)
  const [targetCalories, setTargetCalories] = useState(mockDiet.targetCalories)
  const [description, setDescription] = useState(mockDiet.description)
  const [meals, setMeals] = useState<Meal[]>(mockDiet.meals)

  const addMeal = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: "",
      time: "",
      foods: [
        { id: Date.now().toString(), name: "", quantity: "", unit: "g", calories: "", protein: "", carbs: "", fat: "" },
      ],
    }
    setMeals([...meals, newMeal])
  }

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter((m) => m.id !== mealId))
  }

  const updateMeal = (mealId: string, field: keyof Meal, value: string) => {
    setMeals(meals.map((m) => (m.id === mealId ? { ...m, [field]: value } : m)))
  }

  const addFood = (mealId: string) => {
    setMeals(
      meals.map((m) =>
        m.id === mealId
          ? {
              ...m,
              foods: [
                ...m.foods,
                {
                  id: Date.now().toString(),
                  name: "",
                  quantity: "",
                  unit: "g",
                  calories: "",
                  protein: "",
                  carbs: "",
                  fat: "",
                },
              ],
            }
          : m,
      ),
    )
  }

  const removeFood = (mealId: string, foodId: string) => {
    setMeals(meals.map((m) => (m.id === mealId ? { ...m, foods: m.foods.filter((f) => f.id !== foodId) } : m)))
  }

  const updateFood = (mealId: string, foodId: string, field: keyof Food, value: string) => {
    setMeals(
      meals.map((m) =>
        m.id === mealId ? { ...m, foods: m.foods.map((f) => (f.id === foodId ? { ...f, [field]: value } : f)) } : m,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/diets/${mockDiet.id}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Dieta</h1>
                <p className="text-sm text-muted-foreground">Atualize as informações da dieta</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trainer/diets/${mockDiet.id}`}>Cancelar</Link>
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Diet Info */}
        <Card className="p-6 bg-card border-border mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Informações da Dieta</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Dieta</Label>
              <Input
                id="name"
                placeholder="Ex: Dieta Hipertrofia 3000 kcal"
                value={dietName}
                onChange={(e) => setDietName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                    <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="lowcarb">Low Carb</SelectItem>
                    <SelectItem value="vegetariana">Vegetariana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Meta de Calorias (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="2500"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Adicione observações sobre a dieta..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Meals - Same structure as new page */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Refeições</h2>
            <Button onClick={addMeal} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Refeição
            </Button>
          </div>

          {meals.map((meal, mealIndex) => (
            <Card key={meal.id} className="p-4 bg-card border-border">
              <div className="flex items-start gap-3">
                <div className="mt-6 cursor-move">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Refeição {mealIndex + 1}</Label>
                    {meals.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeMeal(meal.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`meal-name-${meal.id}`}>Nome da Refeição</Label>
                      <Input
                        id={`meal-name-${meal.id}`}
                        placeholder="Ex: Café da Manhã"
                        value={meal.name}
                        onChange={(e) => updateMeal(meal.id, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`meal-time-${meal.id}`}>Horário</Label>
                      <Input
                        id={`meal-time-${meal.id}`}
                        type="time"
                        value={meal.time}
                        onChange={(e) => updateMeal(meal.id, "time", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Alimentos</Label>
                      <Button onClick={() => addFood(meal.id)} variant="ghost" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Alimento
                      </Button>
                    </div>

                    {meal.foods.map((food, foodIndex) => (
                      <div key={food.id} className="space-y-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Alimento {foodIndex + 1}</span>
                          {meal.foods.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeFood(meal.id, food.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor={`food-name-${food.id}`} className="text-xs">
                              Nome
                            </Label>
                            <Input
                              id={`food-name-${food.id}`}
                              placeholder="Ex: Aveia"
                              value={food.name}
                              onChange={(e) => updateFood(meal.id, food.id, "name", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor={`food-quantity-${food.id}`} className="text-xs">
                                Qtd
                              </Label>
                              <Input
                                id={`food-quantity-${food.id}`}
                                type="number"
                                placeholder="100"
                                value={food.quantity}
                                onChange={(e) => updateFood(meal.id, food.id, "quantity", e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`food-unit-${food.id}`} className="text-xs">
                                Unidade
                              </Label>
                              <Select
                                value={food.unit}
                                onValueChange={(value) => updateFood(meal.id, food.id, "unit", value)}
                              >
                                <SelectTrigger id={`food-unit-${food.id}`} className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                  <SelectItem value="un">un</SelectItem>
                                  <SelectItem value="col">col</SelectItem>
                                  <SelectItem value="xic">xíc</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor={`food-calories-${food.id}`} className="text-xs">
                              Calorias
                            </Label>
                            <Input
                              id={`food-calories-${food.id}`}
                              type="number"
                              placeholder="150"
                              value={food.calories}
                              onChange={(e) => updateFood(meal.id, food.id, "calories", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`food-protein-${food.id}`} className="text-xs">
                              Prot (g)
                            </Label>
                            <Input
                              id={`food-protein-${food.id}`}
                              type="number"
                              placeholder="5"
                              value={food.protein}
                              onChange={(e) => updateFood(meal.id, food.id, "protein", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`food-carbs-${food.id}`} className="text-xs">
                              Carb (g)
                            </Label>
                            <Input
                              id={`food-carbs-${food.id}`}
                              type="number"
                              placeholder="25"
                              value={food.carbs}
                              onChange={(e) => updateFood(meal.id, food.id, "carbs", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`food-fat-${food.id}`} className="text-xs">
                              Gord (g)
                            </Label>
                            <Input
                              id={`food-fat-${food.id}`}
                              type="number"
                              placeholder="3"
                              value={food.fat}
                              onChange={(e) => updateFood(meal.id, food.id, "fat", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={addMeal} variant="outline" className="w-full bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Refeição
        </Button>
      </div>
    </div>
  )
}
