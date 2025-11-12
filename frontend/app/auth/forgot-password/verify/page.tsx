"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function VerifyCodePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("reset_email")
    if (!storedEmail) {
      // If no email found, redirect back to email step
      router.push("/auth/forgot-password")
      return
    }
    setEmail(storedEmail)
  }, [router])

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length !== 6) {
      toast({
        title: "Código inválido",
        description: "O código deve ter 6 dígitos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call to verify code
      // await verifyResetCode(email, code)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store code in sessionStorage for password reset
      sessionStorage.setItem("reset_code", code)

      toast({
        title: "Código verificado!",
        description: "Agora você pode redefinir sua senha",
      })

      // Navigate to password reset page
      router.push("/auth/forgot-password/reset")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Código inválido ou expirado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call to resend code
      // await sendPasswordResetEmail(email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Código reenviado!",
        description: "Verifique sua caixa de entrada",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o código. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verifique seu email</CardTitle>
            <CardDescription>
              Enviamos um código de 6 dígitos para <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-foreground">
                  Código de verificação
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="h-10 text-center text-lg tracking-widest"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">Digite o código de 6 dígitos enviado para seu email</p>
              </div>

              <Button type="submit" disabled={isLoading || code.length !== 6} className="w-full">
                {isLoading ? "Verificando..." : "Verificar código"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não recebeu o código? </span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                  Reenviar
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
