import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, TrendingUp, Users, Apple, Activity, Target, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-chart-3/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Dumbbell className="h-7 w-7 text-primary transition-transform group-hover:rotate-180 duration-500" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
            </div>
            <span className="text-2xl font-black text-primary">
                Heavy Gains
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:scale-105 transition-transform">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25">
                Começar Grátis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm opacity-0 animate-[fadeIn_0.8s_ease_forwards]">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Transforme vidas através do fitness</span>
          </div>

          <div className="space-y-6 opacity-0 animate-[fadeIn_0.8s_ease_forwards]">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-balance leading-tight">
              <span className="text-primary">
                Treinos & Dietas
              </span>
              <br />
              <span className="text-muted-foreground text-5xl md:text-6xl lg:text-7xl">
                em um só lugar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance font-light">
              A plataforma definitiva para <span className="text-primary font-semibold">personal trainers</span> gerenciarem 
              seus alunos e <span className="text-primary font-semibold">maximizarem resultados</span> 💪
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeIn_0.8s_ease_forwards_0.2s]">
            <Link href="/teacher-benefits">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                <Users className="h-5 w-5 mr-2" />
                Sou Personal Trainer
              </Button>
            </Link>
            <Link href="/student-benefits">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-2 hover:scale-105 transition-all hover:bg-primary/10 hover:border-primary">
                <Target className="h-5 w-5 mr-2" />
                Sou Aluno
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 opacity-0 animate-[fadeIn_0.8s_ease_forwards_0.3s]">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Profissionais</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">10k+</div>
              <div className="text-sm text-muted-foreground">Alunos Ativos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-chart-3">95%</div>
              <div className="text-sm text-muted-foreground">Satisfação</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 opacity-0 animate-[fadeIn_0.8s_ease_forwards_0.4s]">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 space-y-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Dumbbell className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="font-bold text-xl">Treinos Personalizados</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crie planos de treino únicos e adaptados para cada objetivo
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 space-y-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Apple className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="font-bold text-xl">Dietas Inteligentes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Planeje refeições balanceadas com cálculo automático de macros
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 space-y-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="font-bold text-xl">Progresso Real</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Analytics detalhados com gráficos e métricas de evolução
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 space-y-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="font-bold text-xl">Tempo Real</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Acompanhe treinos e feedback instantâneo dos alunos
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-8 opacity-0 animate-[fadeIn_0.8s_ease_forwards_0.5s]">
            <Shield className="h-4 w-4 text-primary" />
            <span>Seus dados estão seguros e protegidos</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Heavy Gains</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Heavy Gains. Transformando corpos e mentes.
          </p>
        </div>
      </footer>
    </div>
  )
}
