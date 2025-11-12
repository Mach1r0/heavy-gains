import type React from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CodeStepProps {
  email: string
  code: string
  setCode: (code: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onResend: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
  error: string
}

export function CodeStep({ email, code, setCode, onSubmit, onResend, isLoading, error }: CodeStepProps) {
  return (
    <Card className="border-2">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Verifique seu email</CardTitle>
        <CardDescription>Digitamos um código de 6 dígitos para {email}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
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
              onClick={onResend}
              className="text-primary hover:underline font-medium"
            >
              Reenviar
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
