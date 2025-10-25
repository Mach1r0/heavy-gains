# Sistema de Autenticação e Proteção de Rotas

## 📦 O que está armazenado no localStorage

Quando o usuário faz login ou se registra, os seguintes dados são salvos:

```javascript
localStorage.setItem('access_token', '...') // Token JWT de acesso
localStorage.setItem('refresh_token', '...') // Token para renovar o access
localStorage.setItem('user', JSON.stringify({...})) // Dados do usuário
localStorage.setItem('user_type', 'student' | 'teacher') // Tipo do usuário
```

## 🔒 Como funciona a proteção

### 1. Hook useAuth (`/frontend/hooks/useAuth.ts`)

Verifica automaticamente:
- ✅ Se o usuário está logado
- ✅ Qual o tipo dele (student ou teacher)
- ✅ Se ele pode acessar a rota atual
- ✅ Redireciona para o lugar correto

**Uso nas páginas:**
```tsx
const { user, userType, isLoading } = useAuth()
```

### 2. Componente ProtectedRoute (`/frontend/components/ProtectedRoute.tsx`)

Envolve páginas que precisam de proteção específica.

**Uso:**
```tsx
<ProtectedRoute allowedTypes={['student']}>
  <MinhaPageDeEstudante />
</ProtectedRoute>
```

## 🎯 Fluxo de Autenticação

### Registro
1. Usuário preenche formulário em `/register`
2. Sistema chama `authApi.registerStudent()` ou `authApi.registerTeacher()`
3. Backend cria conta e retorna tokens
4. Frontend salva tokens no localStorage
5. **AUTO-LOGIN**: Usuário é redirecionado para seu dashboard

### Login
1. Usuário preenche formulário em `/login`
2. Sistema chama `authApi.login()`
3. Backend valida credenciais e retorna tokens
4. Frontend salva tokens no localStorage
5. Redireciona para dashboard correto

### Verificação de Acesso
1. Usuário tenta acessar `/student/dashboard`
2. `useAuth` verifica:
   - Está logado? → Se não, vai para `/login`
   - É student? → Se não, vai para `/trainer/dashboard`
   - Tudo ok? → Permite acesso

## 🚫 Bloqueios Implementados

### Student não pode:
- ❌ Acessar `/trainer/*`
- ❌ Ver área de teachers
- ✅ Só acessa `/student/*`

### Teacher não pode:
- ❌ Acessar `/student/*`
- ❌ Ver área de students
- ✅ Só acessa `/trainer/*`

### Usuário não logado não pode:
- ❌ Acessar `/student/*`
- ❌ Acessar `/trainer/*`
- ✅ Só acessa páginas públicas (`/`, `/login`, `/register`)

### Usuário já logado:
- ❌ Não pode acessar `/login` ou `/register`
- ✅ É redirecionado automaticamente para seu dashboard

## 📝 Páginas Protegidas

### ✅ Já protegidas:
- `/student/dashboard` - Usa `useAuth()`
- `/trainer/dashboard` - Usa `useAuth()`
- `/login` - Redireciona se já logado
- `/register` - Redireciona se já logado

### Para proteger novas páginas:

**Opção 1: Usar useAuth**
```tsx
'use client'
import { useAuth } from '@/hooks/useAuth'

export default function MinhaPage() {
  const { user, userType, isLoading } = useAuth()
  
  if (isLoading) {
    return <div>Carregando...</div>
  }
  
  return <div>Conteúdo protegido</div>
}
```

**Opção 2: Usar ProtectedRoute**
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function MinhaPage() {
  return (
    <ProtectedRoute allowedTypes={['student']}>
      <div>Só students veem isso</div>
    </ProtectedRoute>
  )
}
```

## 🔄 Refresh de Token

O sistema renova automaticamente o token quando expira:
- Cliente faz requisição
- Token expirou (401)
- Interceptor do Axios pega o erro
- Chama `/api/token/refresh/` com refresh_token
- Recebe novo access_token
- Reexecuta requisição original
- Se falhar → Logout automático

**Configurado em:** `/frontend/lib/api/client.ts`

## 🚪 Logout

Para fazer logout:
```tsx
import { authApi } from '@/lib/api/auth'

const handleLogout = () => {
  authApi.logout() // Remove tudo do localStorage
  router.push('/login')
}
```

## 🛠️ Funções Úteis

```tsx
// Verificar se está logado
authApi.isAuthenticated() // true ou false

// Pegar usuário atual
authApi.getCurrentUser() // { id, username, email, ... }

// Pegar tipo do usuário
authApi.getUserType() // 'student' | 'teacher' | null

// Pegar tokens
authApi.getAccessToken()
authApi.getRefreshToken()

// Fazer logout
authApi.logout()
```

## ⚠️ Importante

- ✅ Nunca confie apenas na verificação do frontend
- ✅ Backend também valida permissões (JWT + permissions)
- ✅ localStorage persiste entre sessões (até logout)
- ✅ Tokens expiram automaticamente (60min access, 7 dias refresh)
