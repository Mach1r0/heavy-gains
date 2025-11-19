"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { authApi } from "@/lib/api/auth"

export default function NewProgramPage() {
  const params = useParams()
  const router = useRouter()
  const [name, setName] = useState("")
  const [goal, setGoal] = useState<string>("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      const user = authApi.getUserFromStorage()
      if (!user) return
      const teacherResp = await apiClient.get(`/trainer/teachers/?user=${user.id}`)
      const teacher = teacherResp.data?.[0]
      if (!teacher?.id) return
      await apiClient.post("/programs/", {
        name,
        description,
        goal: goal || "GEN",
        teacher: teacher.id,
      })
      router.back()
    } catch (e) {
      // noop
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/trainer/${params?.id}/workouts/new`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Novo Programa</h1>
                <p className="text-sm text-muted-foreground">Um programa agrupa vários treinos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trainer/${params?.id}/workouts/new`}>Cancelar</Link>
              </Button>
              <Button onClick={handleSave} disabled={saving || !name}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Programa"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card className="p-6 bg-card border-border mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="program-name">Nome do Programa</Label>
              <Input
                id="program-name"
                placeholder="Ex: ABC, Upper/Lower, PPL"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Objetivo</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STR">Força</SelectItem>
                    <SelectItem value="HYP">Hipertrofia</SelectItem>
                    <SelectItem value="END">Resistência</SelectItem>
                    <SelectItem value="WL">Emagrecimento</SelectItem>
                    <SelectItem value="GEN">Fitness Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-description">Descrição (opcional)</Label>
              <Textarea
                id="program-description"
                placeholder="Notas ou diretrizes gerais do programa..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
