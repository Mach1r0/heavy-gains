import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Apple, LineChart, Camera, Calendar, Target, ArrowLeft } from "lucide-react"

export default function StudentBenefitsPage() {
  const benefits = [
    {
      icon: Dumbbell,
      title: "Treinos Personalizados",
      description:
        "Acesse seus treinos criados especialmente para você pelo seu personal trainer, com todos os detalhes de exercícios, séries e repetições.",
    },
    {
      icon: Apple,
      title: "Dieta Sob Medida",
      description:
        "Receba planos alimentares personalizados com todas as refeições e informações nutricionais necessárias para seus objetivos.",
    },
    {
      icon: LineChart,
      title: "Acompanhe Sua Evolução",
      description:
        "Visualize seu progresso através de medidas corporais detalhadas e gráficos de evolução ao longo do tempo.",
    },
    {
      icon: Camera,
      title: "Registro de Progresso",
      description: "Mantenha um histórico fotográfico da sua transformação e veja visualmente seus resultados.",
    },
    {
      icon: Calendar,
      title: "Organização Total",
      description: "Tenha todos os seus treinos e dietas organizados em um só lugar, acessível a qualquer momento.",
    },
    {
      icon: Target,
      title: "Foco nos Resultados",
      description:
        "Trabalhe em conjunto com seu personal trainer para alcançar seus objetivos de forma eficiente e sustentável.",
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
            <h1 className="text-4xl font-bold mb-4">Para Alunos</h1>
            <p className="text-xl text-muted-foreground">
              Sua jornada fitness organizada e acompanhada profissionalmente
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
              <h2 className="text-2xl font-bold mb-4">Comece sua transformação hoje</h2>
              <p className="mb-6 text-primary-foreground/90">
                Junte-se a milhares de alunos que já estão alcançando seus objetivos com acompanhamento profissional
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Começar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
