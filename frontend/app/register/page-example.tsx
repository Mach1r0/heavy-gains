'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, type RegisterStudentData, type RegisterTeacherData } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as 'student' | 'trainer' | null;

  const [userType, setUserType] = useState<'student' | 'trainer'>(initialType || 'student');
  const [studentData, setStudentData] = useState<RegisterStudentData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [teacherData, setTeacherData] = useState<RegisterTeacherData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    specialization: '',
    cref: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.registerStudent(studentData);
      router.push('/student/dashboard');
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.email?.[0] || 
                       'Erro ao registrar. Tente novamente.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.registerTeacher(teacherData);
      router.push('/trainer/dashboard');
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.email?.[0] || 
                       'Erro ao registrar. Tente novamente.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Escolha o tipo de conta que deseja criar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={userType} onValueChange={(v) => setUserType(v as 'student' | 'trainer')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="student">Aluno</TabsTrigger>
              <TabsTrigger value="trainer">Personal Trainer</TabsTrigger>
            </TabsList>

            {/* Registro de Aluno */}
            <TabsContent value="student">
              <form onSubmit={handleStudentRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-username">Username *</Label>
                  <Input
                    id="student-username"
                    type="text"
                    placeholder="seu_username"
                    value={studentData.username}
                    onChange={(e) => setStudentData({ ...studentData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-email">Email *</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-password">Senha *</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="••••••••"
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-first-name">Nome</Label>
                    <Input
                      id="student-first-name"
                      type="text"
                      placeholder="João"
                      value={studentData.first_name}
                      onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-last-name">Sobrenome</Label>
                    <Input
                      id="student-last-name"
                      type="text"
                      placeholder="Silva"
                      value={studentData.last_name}
                      onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registrando...' : 'Criar Conta de Aluno'}
                </Button>
              </form>
            </TabsContent>

            {/* Registro de Personal Trainer */}
            <TabsContent value="trainer">
              <form onSubmit={handleTeacherRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer-username">Username *</Label>
                  <Input
                    id="trainer-username"
                    type="text"
                    placeholder="seu_username"
                    value={teacherData.username}
                    onChange={(e) => setTeacherData({ ...teacherData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer-email">Email *</Label>
                  <Input
                    id="trainer-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={teacherData.email}
                    onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer-password">Senha *</Label>
                  <Input
                    id="trainer-password"
                    type="password"
                    placeholder="••••••••"
                    value={teacherData.password}
                    onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainer-first-name">Nome</Label>
                    <Input
                      id="trainer-first-name"
                      type="text"
                      placeholder="Carlos"
                      value={teacherData.first_name}
                      onChange={(e) => setTeacherData({ ...teacherData, first_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trainer-last-name">Sobrenome</Label>
                    <Input
                      id="trainer-last-name"
                      type="text"
                      placeholder="Mendes"
                      value={teacherData.last_name}
                      onChange={(e) => setTeacherData({ ...teacherData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialização</Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="Musculação, Funcional, etc"
                    value={teacherData.specialization}
                    onChange={(e) => setTeacherData({ ...teacherData, specialization: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cref">CREF</Label>
                  <Input
                    id="cref"
                    type="text"
                    placeholder="123456-G/SP"
                    value={teacherData.cref}
                    onChange={(e) => setTeacherData({ ...teacherData, cref: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registrando...' : 'Criar Conta de Personal'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
