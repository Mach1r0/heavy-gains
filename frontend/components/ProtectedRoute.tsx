'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

interface ProtectedRouteProps {
  children: ReactNode
  allowedTypes: ('student' | 'teacher')[]
}

export function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    const checkAccess = () => {
      // Verifica se está autenticado
      if (!authApi.isAuthenticated()) {
        router.push('/login')
        return
      }

      // Verifica o tipo de usuário
      const userType = authApi.getUserType()
      
      if (!userType || !allowedTypes.includes(userType)) {
        // Usuário não tem permissão, redireciona para seu dashboard
        if (userType === 'student') {
          router.push('/student/dashboard')
        } else if (userType === 'teacher') {
          router.push('/trainer/dashboard')
        } else {
          router.push('/login')
        }
      }
    }

    checkAccess()
  }, [router, allowedTypes])

  return <>{children}</>
}
