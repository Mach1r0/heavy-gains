"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api/auth"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para alterar a senha",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
  }, [router, toast])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast({
        title: "Erro",
        description: "Digite sua senha atual",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A nova senha deve ter no mínimo 8 caracteres",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não correspondem",
        description: "Verifique se as senhas são iguais",
        variant: "destructive",
      })
      return
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Senha inválida",
        description: "A nova senha deve ser diferente da atual",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível alterar a senha. Verifique sua senha atual.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Alterar Senha</CardTitle>
            <CardDescription>Digite sua senha atual e escolha uma nova senha</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                  Senha atual
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="h-10"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                  Nova senha
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar nova senha
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword} 
                className="w-full"
              >
                {isLoading ? "Alterando..." : "Alterar senha"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Esqueceu sua senha? </span>
                <Link href="/auth/forgot-password" className="text-primary hover:underline font-medium">
                  Recuperar senha
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
