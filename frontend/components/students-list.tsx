"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { authApi } from "@/lib/api/auth"

interface Student {
  id: number
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    profile_picture?: string
  }
  age?: number
  weight?: number
  height?: number
  phone_number?: string
  has_measurements: boolean
  has_photos: boolean
}

export function StudentsList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: 1,
        user: {
          id: 1,
          username: "joao_silva",
          email: "joao@example.com",
          first_name: "João",
          last_name: "Silva",
        },
        age: 25,
        weight: 75,
        height: 1.75,
        has_measurements: true,
        has_photos: true,
      },
      {
        id: 2,
        user: {
          id: 2,
          username: "maria_santos",
          email: "maria@example.com",
          first_name: "Maria",
          last_name: "Santos",
        },
        age: 28,
        weight: 62,
        height: 1.65,
        has_measurements: false,
        has_photos: false,
      },
    ]

    setStudents(mockStudents)
    setLoading(false)
  }, [])

  const evaluatedStudents = students.filter((s) => s.has_measurements || s.has_photos)
  const notEvaluatedStudents = students.filter((s) => !s.has_measurements && !s.has_photos)

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-8">
      {/* Evaluated Students */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Avaliados</h2>
          <Badge variant="secondary">{evaluatedStudents.length}</Badge>
        </div>

        {evaluatedStudents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">Nenhum aluno avaliado ainda</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evaluatedStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </section>

      {/* Not Evaluated Students */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold">Não Avaliados</h2>
          <Badge variant="secondary">{notEvaluatedStudents.length}</Badge>
        </div>

        {notEvaluatedStudents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Todos os alunos foram avaliados
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notEvaluatedStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StudentCard({ student }: { student: Student }) {
  const fullName = `${student.user.first_name} ${student.user.last_name}`.trim() || student.user.username
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const pathname = usePathname()
  const segments = pathname ? pathname.split("/").filter(Boolean) : []
  const trainerIndex = segments.indexOf("trainer")
  const trainerId = trainerIndex >= 0 ? segments[trainerIndex + 1] ?? "" : ""
  const href = trainerId ? `/trainer/${trainerId}/students/${student.id}` : `/students/${student.id}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={student.user.profile_picture || "/placeholder.svg"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">@{student.user.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 text-sm">
          {student.age && <Badge variant="outline">{student.age} anos</Badge>}
          {student.weight && <Badge variant="outline">{student.weight} kg</Badge>}
        </div>

        <Button asChild className="w-full">
          <Link href={href}>Ver Detalhes</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
