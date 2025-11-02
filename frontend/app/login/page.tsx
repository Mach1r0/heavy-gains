'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import { authApi } from "@/lib/api/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Conta criada com sucesso! Faça login para continuar.')
    }
  }, [searchParams])

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      const userType = authApi.getUserType()
      const user = authApi.getUserFromStorage()
      if (userType === 'student' && user) {
        router.push(`/student/${user.id}/dashboard`)
      } else if (userType === 'teacher' && user) {
        router.push(`/trainer/${user.id}/dashboard`)
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login(credentials)
      
      if (response.user.is_student) {
        router.push(`/student/${response.user.id}/dashboard`)
      } else if (response.user.is_teacher) {
        router.push(`/trainer/${response.user.id}/dashboard`)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.response?.data) {
        const errorData = err.response.data
        if (errorData.detail) {
          setError(errorData.detail)
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0])
        } else {
          setError('Usuário ou senha incorretos')
        }
      } else {
        setError('Erro ao conectar com o servidor')
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Heavy gains</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>Entre com seu usuário e senha para acessar sua conta</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="seu_usuario" 
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  )
}
