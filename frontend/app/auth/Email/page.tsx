import type React from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EmailStepProps {
  email: string
  setEmail: (email: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
}

export function EmailStep({ email, setEmail, onSubmit, isLoading }: EmailStepProps) {
  return (
    <Card className="border-2">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
        <CardDescription>Digite seu email para receber um código de redefinição</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
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
      </CardContent>
    </Card>
  )
}
