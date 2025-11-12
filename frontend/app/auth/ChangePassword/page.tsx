"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ForgotPasswordStep = "email" | "code" | "reset" | "success"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false)
      setStep("code")
    }, 1000)
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (code.length !== 6) {
      setError("O código deve ter 6 dígitos")
      return
    }

    setIsLoading(true)

    // Simulate API call to verify code
    setTimeout(() => {
      setIsLoading(false)
      setStep("reset")
    }, 1000)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não correspondem")
      return
    }

    setIsLoading(true)

    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false)
      setStep("success")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {step !== "success" && (
          <Link
            href="/"
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
                {step === "success" ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : step === "reset" ? (
                  <Lock className="w-8 h-8 text-primary" />
                ) : (
                  <Mail className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>

            {step === "email" && (
              <>
                <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
                <CardDescription>Digite seu email para receber um código de redefinição</CardDescription>
              </>
            )}
            {step === "code" && (
              <>
                <CardTitle className="text-2xl">Verifique seu email</CardTitle>
                <CardDescription>Digitamos um código de 6 dígitos para {email}</CardDescription>
              </>
            )}
            {step === "reset" && (
              <>
                <CardTitle className="text-2xl">Nova senha</CardTitle>
                <CardDescription>Digite sua nova senha</CardDescription>
              </>
            )}
            {step === "success" && (
              <>
                <CardTitle className="text-2xl">Senha redefinida!</CardTitle>
                <CardDescription>Sua senha foi alterada com sucesso</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <Button type="submit" disabled={isLoading || !email} className="w-full">
                  {isLoading ? "Enviando..." : "Enviar código"}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Lembrou sua senha? </span>
                  <Link href="/" className="text-primary hover:underline font-medium">
                    Fazer login
                  </Link>
                </div>
              </form>
            )}

            {step === "code" && (
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
                  />
                  <p className="text-xs text-muted-foreground">Digite o código de 6 dígitos enviado para seu email</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={isLoading || code.length !== 6} className="w-full">
                  {isLoading ? "Verificando..." : "Verificar código"}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Não recebeu o código? </span>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="text-primary hover:underline font-medium"
                  >
                    Reenviar
                  </button>
                </div>
              </form>
            )}

            {step === "reset" && (
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

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={isLoading || !newPassword || !confirmPassword} className="w-full">
                  {isLoading ? "Redefinindo..." : "Redefinir senha"}
                </Button>
              </form>
            )}

            {step === "success" && (
              <div className="space-y-4 text-center">
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Seu acesso foi restaurado!</p>
                  <p className="text-muted-foreground text-sm">Você pode fazer login com sua nova senha</p>
                </div>
                <Link href="/" className="block">
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
