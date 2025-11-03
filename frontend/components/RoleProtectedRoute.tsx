'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

interface RoleProtectedRouteProps {
  children: ReactNode
  allowedRole: 'student' | 'teacher'
}

export function RoleProtectedRoute({ children, allowedRole }: RoleProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuthorization = () => {
      // Verifica se está autenticado
      const isAuthenticated = authApi.isAuthenticated()
      
      if (!isAuthenticated) {
        // Não está logado, redireciona para login
        router.push('/login')
        return
      }

      // Verifica o tipo de usuário
      const user = authApi.getUserFromStorage()
      const userType = authApi.getUserType()

      if (!user || !userType) {
        // Dados inconsistentes, força logout
        authApi.logout()
        router.push('/login')
        return
      }

      // Verifica se o usuário tem permissão para acessar
      if (userType !== allowedRole) {
        // Usuário tentando acessar área não autorizada
        console.warn(`User type ${userType} attempted to access ${allowedRole} area`)
        
        // Redireciona para o dashboard correto do usuário
        if (userType === 'student') {
          router.push(`/student/${user.id}/dashboard`)
        } else if (userType === 'teacher') {
          router.push(`/trainer/${user.id}/dashboard`)
        } else {
          // Tipo desconhecido, força logout
          authApi.logout()
          router.push('/login')
        }
        return
      }

      // Usuário autorizado
      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAuthorization()
  }, [router, pathname, allowedRole])

  // Mostra loading enquanto verifica autorização
  if (isChecking || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
