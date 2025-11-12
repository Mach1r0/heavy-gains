"use client"

import { NavHeader } from "@/components/nav-header"
import { TrainerStudentForm } from "@/components/trainer-student-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function NewTrainerStudentPage() {
  const params = useParams()
  const trainerId = params.id as string

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main className="container mx-auto px-4 py-8">
        <Link
          href={`/trainer/${trainerId}/students`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para alunos
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Novo Aluno</h1>
          <p className="text-muted-foreground mt-2">Adicione um novo aluno à sua lista</p>
        </div>

        <TrainerStudentForm trainerId={trainerId} mode="create" />
      </main>
    </div>
  )
}
