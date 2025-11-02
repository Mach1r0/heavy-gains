'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authApi.isAuthenticated()
      const currentUser = authApi.getUserFromStorage()
      const currentUserType = authApi.getUserType()

      if (!isAuthenticated && requireAuth) {
        // Não está logado e precisa estar - redireciona para login
        router.push('/login')
        return
      }

      if (isAuthenticated) {
        setUser(currentUser)
        setUserType(currentUserType)

        // Se está na página de login ou register e já está logado, redireciona para dashboard
        if (pathname === '/login' || pathname === '/register') {
          if (currentUserType === 'student' && currentUser) {
            router.push(`/student/${currentUser.id}/dashboard`)
          } else if (currentUserType === 'teacher' && currentUser) {
            router.push(`/trainer/${currentUser.id}/dashboard`)
          }
          return
        }

        // Verifica se está tentando acessar área errada
        if (pathname?.startsWith('/student/') && currentUserType !== 'student') {
          if (currentUser) {
            router.push(`/trainer/${currentUser.id}/dashboard`)
          }
          return
        }

        if (pathname?.startsWith('/trainer/') && currentUserType !== 'teacher') {
          if (currentUser) {
            router.push(`/student/${currentUser.id}/dashboard`)
          }
          return
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router, requireAuth])

  return { user, userType, isLoading }
}
