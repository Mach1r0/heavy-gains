"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, GripVertical, Trash2, Save, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { getDietPlan, updateDietPlan } from "@/lib/api/diets"
import { apiClient } from "@/lib/api/client"
import { getTeacherStudents } from "@/lib/api/teachers"

interface Meal {
  id: string | number
  name: string
  time: string
  description?: string
  foods: Food[]
}

interface Food {
  id: string | number
  name: string
  quantity: string
  unit: string
  calories: string
  protein: string
  carbs: string
  fat: string
}

export default function EditDietPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dietId = params?.dietId as string
  const userId = params?.id as string
  const studentIdFromUrl = searchParams.get('student')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dietName, setDietName] = useState("")
  const [goal, setGoal] = useState<"BUK" | "CUT" | "MAINT">("MAINT")
  const [targetCalories, setTargetCalories] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [meals, setMeals] = useState<Meal[]>([])
  const [studentId, setStudentId] = useState<number>(0)
  const [studentName, setStudentName] = useState<string>("")
  const [students, setStudents] = useState<any[]>([])
  const [isEditingStudent, setIsEditingStudent] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentSearchTerm, setStudentSearchTerm] = useState("")

  useEffect(() => {
    if (dietId) {
      fetchDiet()
    }
  }, [dietId])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true)
        const studentsList = await getTeacherStudents()
        setStudents(studentsList)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoadingStudents(false)
      }
    }
    fetchStudents()
  }, [])

  const fetchDiet = async () => {
    try {
      setLoading(true)
      const diet = await getDietPlan(dietId)
      
      console.log('Diet data from API:', diet)
      
      setDietName(diet.name)
      setGoal(diet.goal)
      setTargetCalories(diet.target_calories?.toString() || "")
      setDescription(diet.description || "")
      setStartDate(diet.start_date)
      setEndDate(diet.end_date)
      setStudentId(diet.student?.id || diet.student)
      setStudentName(diet.student_name || `${diet.student?.first_name || ''} ${diet.student?.last_name || ''}`.trim())
      
      console.log('Student ID:', diet.student?.id || diet.student)
      console.log('Meals:', diet.meals)
      
      // Transform meals data
      const transformedMeals = diet.meals?.map((meal: any) => {
        console.log('Processing meal:', meal)
        return {
          id: meal.id,
          name: meal.name,
          time: meal.time,
          description: meal.description || "",
          foods: meal.food_items?.map((item: any) => {
            console.log('Processing food item:', item)
            return {
              id: item.id,
              name: item.food_item?.name || item.name || "",
              quantity: item.quantity?.toString() || "",
              unit: item.unit || "g",
              calories: item.food_item?.calories?.toString() || item.calories?.toString() || "",
              protein: item.food_item?.protein?.toString() || item.protein?.toString() || "",
              carbs: item.food_item?.carbs?.toString() || item.carbs?.toString() || "",
              fat: item.food_item?.fats?.toString() || item.fats?.toString() || "",
            }
          }) || []
        }
      }) || []
      
      console.log('Transformed meals:', transformedMeals)
      setMeals(transformedMeals)
    } catch (error) {
      console.error('Error fetching diet:', error)
      alert('Erro ao carregar dieta: ' + (error as any)?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      console.log('Current meals state:', meals)
      
      const mealsData = meals.map((meal) => ({
        name: meal.name,
        time: meal.time,
        description: meal.description || "",
        foods: meal.foods.map((food) => ({
          name: food.name,
          quantity: parseFloat(food.quantity) || 0,
          unit: food.unit,
          calories: parseInt(food.calories) || 0,
          protein: parseFloat(food.protein) || 0,
          carbs: parseFloat(food.carbs) || 0,
          fat: parseFloat(food.fat) || 0,
        }))
      }))

      const dietData = {
        student_id: studentId,
        name: dietName,
        goal: goal,
        description: description,
        target_calories: targetCalories ? parseInt(targetCalories) : undefined,
        start_date: startDate,
        end_date: endDate,
        meals: mealsData
      }

      console.log('Sending diet data to API:', dietData)
      
      const response = await apiClient.put(`/diet/diet-plans/${dietId}/`, dietData)
      console.log('API response:', response.data)
      
      alert('Dieta atualizada com sucesso!')
      // Redirect back to student page if came from there, otherwise to diet detail
      if (studentIdFromUrl) {
        router.push(`/trainer/${userId}/students/${studentIdFromUrl}`)
      } else {
        router.push(`/trainer/${userId}/diets/${dietId}`)
      }
    } catch (error: any) {
      console.error('Error saving diet:', error)
      console.error('Error response:', error.response?.data)
      alert('Erro ao salvar dieta: ' + (error.response?.data?.detail || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleStudentChange = (newStudentUserId: string) => {
    const selectedStudent = students.find(s => s.student_user_id?.toString() === newStudentUserId)
    if (selectedStudent) {
      setStudentId(selectedStudent.student_id)
      setStudentName(selectedStudent.student_name)
      setIsEditingStudent(false)
      setStudentSearchTerm("")
    }
  }

  const filteredStudents = students.filter(student =>
    student.student_name?.toLowerCase().includes(studentSearchTerm.toLowerCase())
  )

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

  const removeMeal = (mealId: string | number) => {
    setMeals(meals.filter((m) => m.id !== mealId))
  }

  const updateMeal = (mealId: string | number, field: keyof Meal, value: string) => {
    setMeals(meals.map((m) => (m.id === mealId ? { ...m, [field]: value } : m)))
  }

  const addFood = (mealId: string | number) => {
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

  const removeFood = (mealId: string | number, foodId: string | number) => {
    setMeals(meals.map((m) => (m.id === mealId ? { ...m, foods: m.foods.filter((f) => f.id !== foodId) } : m)))
  }

  const updateFood = (mealId: string | number, foodId: string | number, field: keyof Food, value: string) => {
    setMeals(
      meals.map((m) =>
        m.id === mealId ? { ...m, foods: m.foods.map((f) => (f.id === foodId ? { ...f, [field]: value } : f)) } : m,
      ),
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Carregando dieta...</div>
      </div>
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
                <Link href={studentIdFromUrl ? `/trainer/${userId}/students/${studentIdFromUrl}` : `/trainer/${userId}/diets/${dietId}`}>
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
                <Link href={studentIdFromUrl ? `/trainer/${userId}/students/${studentIdFromUrl}` : `/trainer/${userId}/diets/${dietId}`}>Cancelar</Link>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
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
                <Label htmlFor="goal">Objetivo</Label>
                <Select value={goal} onValueChange={(value: any) => setGoal(value)}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Selecione um objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUK">Bulking</SelectItem>
                    <SelectItem value="CUT">Cutting</SelectItem>
                    <SelectItem value="MAINT">Manutenção</SelectItem>
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

        {/* Student Info */}
        {studentName && (
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Aluno</h2>
              {!isEditingStudent && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingStudent(true)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Trocar Aluno
                </Button>
              )}
            </div>
            {isEditingStudent ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Pesquisar aluno</Label>
                  <Input
                    placeholder="Digite o nome do aluno..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selecione o novo aluno</Label>
                  <Select 
                    value={studentId.toString()} 
                    onValueChange={handleStudentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingStudents ? (
                        <div className="p-2 text-sm text-muted-foreground">Carregando...</div>
                      ) : filteredStudents.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          {studentSearchTerm ? 'Nenhum aluno encontrado com esse nome' : 'Nenhum aluno encontrado'}
                        </div>
                      ) : (
                        filteredStudents.map((student) => (
                          <SelectItem 
                            key={student.student_id} 
                            value={student.student_user_id?.toString() || student.student_id?.toString()}
                          >
                            {student.student_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsEditingStudent(false)
                      setStudentSearchTerm("")
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{studentName}</p>
                  <p className="text-sm text-muted-foreground">Dieta criada para este aluno</p>
                </div>
              </div>
            )}
          </Card>
        )}

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
