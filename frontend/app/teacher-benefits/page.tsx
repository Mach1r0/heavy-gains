import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, FileText, Camera, CheckCircle, ArrowLeft } from "lucide-react"

export default function TrainerBenefitsPage() {
  const benefits = [
    {
      icon: Users,
      title: "Gestão Completa de Alunos",
      description:
        "Organize todos os seus alunos em um só lugar. Visualize rapidamente quem foi avaliado e quem precisa de atenção.",
    },
    {
      icon: FileText,
      title: "Criação de Dietas Personalizadas",
      description:
        "Crie e gerencie planos alimentares detalhados com informações nutricionais completas para cada aluno.",
    },
    {
      icon: Calendar,
      title: "Planejamento de Treinos",
      description:
        "Monte treinos personalizados com exercícios, séries, repetições e tempo de descanso organizados por dia da semana.",
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento de Progresso",
      description: "Monitore a evolução dos seus alunos com medidas corporais detalhadas e indicadores de tendência.",
    },
    {
      icon: Camera,
      title: "Registro Fotográfico",
      description: "Mantenha um histórico visual do progresso dos alunos com fotos organizadas por data e tipo.",
    },
    {
      icon: CheckCircle,
      title: "Interface Intuitiva",
      description: "Plataforma fácil de usar com tema claro e escuro, permitindo trabalhar em qualquer ambiente.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Para Personal Trainers</h1>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para gerenciar seus alunos e impulsionar resultados
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
              <p className="mb-6 text-primary-foreground/90">
                Junte-se a centenas de personal trainers que já estão transformando a gestão dos seus alunos
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Criar Conta Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
