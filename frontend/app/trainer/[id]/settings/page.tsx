"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { authApi } from "@/lib/api/auth"
import { getTeacherByUserId, updateTeacher } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/dist/client/link"

interface TeacherData {
  id: number
  user_data: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    profile_picture?: string
  }
  bio?: string
  specialties?: string
  phone_number?: string
  CREF?: string
}

export default function TrainerSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
  
  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [cref, setCref] = useState("")
  const [bio, setBio] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      setLoading(true)
      const user = authApi.getUserFromStorage()
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado",
          variant: "destructive",
        })
        return
      }

      const teacher = await getTeacherByUserId(user.id)
      setTeacherData(teacher)
      
      // Populate form fields
      setFirstName(teacher.user_data.first_name || "")
      setLastName(teacher.user_data.last_name || "")
      setEmail(teacher.user_data.email || "")
      setPhone(teacher.phone_number || "")
      setCref(teacher.CREF || "")
      setBio(teacher.bio || "")
    } catch (error) {
      console.error('Error fetching teacher data:', error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar suas informações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      
      if (!teacherData) return

      await updateTeacher(teacherData.id, {
        phone_number: phone,
        CREF: cref,
        bio: bio,
        specialties: teacherData.specialties,
      })

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
      })
      
      // Refresh data
      await fetchTeacherData()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Erro ao salvar",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        toast({
          title: "Erro",
          description: "Preencha a nova senha e confirmação",
          variant: "destructive",
        })
        return
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        })
        return
      }

      // TODO: Implement password change endpoint
      toast({
        title: "Em desenvolvimento",
        description: "Funcionalidade de alteração de senha em breve",
      })
    } catch (error) {
      console.error('Error changing password:', error)
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e informações profissionais</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil Profissional</CardTitle>
            <CardDescription>Atualize suas informações profissionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cref">CREF</Label>
              <Input 
                id="cref" 
                value={cref}
                onChange={(e) => setCref(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como deseja receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Novos alunos</Label>
                <p className="text-sm text-muted-foreground">Receba notificações quando novos alunos se cadastrarem</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Treinos concluídos</Label>
                <p className="text-sm text-muted-foreground">Notificações quando alunos completarem treinos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mensagens de alunos</Label>
                <p className="text-sm text-muted-foreground">Notificações de novas mensagens</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Quer alterar sua senha?</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/change-password">
              <Button variant="outline" className="w-full">
                Alterar senha
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
