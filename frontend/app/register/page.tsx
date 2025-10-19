"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell } from "lucide-react"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "student"
  const [userType, setUserType] = useState<"trainer" | "student">(defaultType as "trainer" | "student")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Heavy gains</span>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
            <CardDescription>Escolha o tipo de conta e preencha seus dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Tabs */}
            <Tabs value={userType} onValueChange={(v) => setUserType(v as "trainer" | "student")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trainer">Personal</TabsTrigger>
                <TabsTrigger value="student">Aluno</TabsTrigger>
              </TabsList>

              <TabsContent value="trainer" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer-name">Nome completo</Label>
                  <Input id="trainer-name" placeholder="João Silva" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainer-email">Email</Label>
                  <Input id="trainer-email" type="email" placeholder="joao@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainer-cref">CREF</Label>
                  <Input id="trainer-cref" placeholder="000000-G/SP" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainer-password">Senha</Label>
                  <Input id="trainer-password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainer-confirm">Confirmar senha</Label>
                  <Input id="trainer-confirm" type="password" placeholder="••••••••" required />
                </div>
              </TabsContent>

              <TabsContent value="student" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Nome completo</Label>
                  <Input id="student-name" placeholder="Maria Santos" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input id="student-email" type="email" placeholder="maria@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Senha</Label>
                  <Input id="student-password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-confirm">Confirmar senha</Label>
                  <Input id="student-confirm" type="password" placeholder="••••••••" required />
                </div>
              </TabsContent>
            </Tabs>

            <Button className="w-full" size="lg">
              Criar conta
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  )
}
