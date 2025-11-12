"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface TrainerStudentFormProps {
  trainerId: string
  mode: "create" | "edit"
  initialData?: {
    id: string
    name: string
    email: string
    phone: string
    age: number
    weight: number
    height: number
  }
}

export function TrainerStudentForm({ trainerId, mode, initialData }: TrainerStudentFormProps) {
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    age: initialData?.age || "",
    weight: initialData?.weight || "",
    height: initialData?.height || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement API call to create/update student
    console.log("[v0] Submitting student data:", formData)

    // Show success modal and redirect
    if (mode === "create") {
      setShowSuccessModal(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/trainer/${trainerId}/students`)
      }, 2000)
    } else {
      router.push(`/trainer/${trainerId}/students/${initialData?.id}`)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="28"
                min="1"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                placeholder="75.5"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                placeholder="1.75"
                min="0.5"
                max="3"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Criar Aluno" : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Aluno cadastrado com sucesso
            </DialogTitle>
            <DialogDescription className="text-center">
              O aluno foi adicionado à sua lista. Redirecionando...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
