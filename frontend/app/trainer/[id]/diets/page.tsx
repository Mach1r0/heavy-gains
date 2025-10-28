"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Apple, Search, Plus, Copy, Edit, Trash2, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data
const mockDiets = [
  {
    id: 1,
    name: "Dieta Hipertrofia 3000 kcal",
    calories: 3000,
    protein: 180,
    carbs: 375,
    fat: 83,
    meals: 6,
    students: 8,
    lastUsed: "2024-01-15",
    category: "Hipertrofia",
  },
  {
    id: 2,
    name: "Dieta Emagrecimento 1800 kcal",
    calories: 1800,
    protein: 135,
    carbs: 180,
    fat: 60,
    meals: 5,
    students: 12,
    lastUsed: "2024-01-14",
    category: "Emagrecimento",
  },
  {
    id: 3,
    name: "Dieta Manutenção 2500 kcal",
    calories: 2500,
    protein: 150,
    carbs: 312,
    fat: 69,
    meals: 5,
    students: 6,
    lastUsed: "2024-01-13",
    category: "Manutenção",
  },
  {
    id: 4,
    name: "Dieta Low Carb 2000 kcal",
    calories: 2000,
    protein: 150,
    carbs: 100,
    fat: 122,
    meals: 4,
    students: 5,
    lastUsed: "2024-01-12",
    category: "Low Carb",
  },
]

export default function DietsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDiets = mockDiets.filter((diet) => diet.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/trainer/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dietas</h1>
                <p className="text-sm text-muted-foreground">Gerencie seus planos alimentares</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/trainer/diets/new">
                <Plus className="h-4 w-4 mr-2" />
                Nova Dieta
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dietas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Diets Grid */}
        <div className="grid gap-4">
          {filteredDiets.map((diet) => (
            <Card key={diet.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-green-500" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{diet.name}</h3>
                      <Badge variant="secondary">{diet.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{diet.calories} kcal</span>
                      <span>P: {diet.protein}g</span>
                      <span>C: {diet.carbs}g</span>
                      <span>G: {diet.fat}g</span>
                      <span>{diet.meals} refeições</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {diet.students} alunos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Duplicar">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild title="Editar">
                    <Link href={`/trainer/diets/${diet.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" title="Excluir">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/trainer/diets/${diet.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
