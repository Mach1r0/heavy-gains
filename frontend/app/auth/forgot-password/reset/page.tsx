"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Get email and code from sessionStorage
    const storedEmail = sessionStorage.getItem("reset_email")
    const storedCode = sessionStorage.getItem("reset_code")
    
    if (!storedEmail || !storedCode) {
      // If no email or code found, redirect back to email step
      router.push("/auth/forgot-password")
      return
    }
    
    setEmail(storedEmail)
    setCode(storedCode)
  }, [router])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 8 caracteres",
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

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call to reset password
      // await resetPassword(email, code, newPassword)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Clear sessionStorage
      sessionStorage.removeItem("reset_email")
      sessionStorage.removeItem("reset_code")

      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso",
      })

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível redefinir a senha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!email || !code) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {!success && (
          <Link
            href="/auth/forgot-password/verify"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        )}

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {success ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Lock className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl">
              {success ? "Senha redefinida!" : "Nova senha"}
            </CardTitle>
            <CardDescription>
              {success ? "Sua senha foi alterada com sucesso" : "Digite sua nova senha"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!success ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
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
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirmar senha
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
                  disabled={isLoading || !newPassword || !confirmPassword} 
                  className="w-full"
                >
                  {isLoading ? "Redefinindo..." : "Redefinir senha"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Seu acesso foi restaurado!</p>
                  <p className="text-muted-foreground text-sm">
                    Você pode fazer login com sua nova senha
                  </p>
                </div>
                <Link href="/login" className="block">
                  <Button className="w-full">Ir para login</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
