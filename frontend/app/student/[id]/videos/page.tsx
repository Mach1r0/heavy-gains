"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Eye, Search, BookOpen, CheckCircle2 } from "lucide-react"

const mockVideos = [
  {
    id: 1,
    title: "Introdução ao Treino de Hipertrofia",
    description: "Aprenda os fundamentos do treino para ganho de massa muscular",
    thumbnail: "/placeholder.svg",
    duration: "15:30",
    views: 1234,
    category: "Teoria",
    completed: true,
    uploadDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Técnica Correta: Supino Reto",
    description: "Execução perfeita do supino reto para máximo desenvolvimento do peitoral",
    thumbnail: "/placeholder.svg",
    duration: "12:45",
    views: 892,
    category: "Técnica",
    completed: true,
    uploadDate: "2024-01-18",
  },
  {
    id: 3,
    title: "Nutrição para Ganho de Massa",
    description: "Como montar sua dieta para maximizar os ganhos",
    thumbnail: "/placeholder.svg",
    duration: "20:15",
    views: 2103,
    category: "Nutrição",
    completed: false,
    uploadDate: "2024-01-20",
  },
  {
    id: 4,
    title: "Agachamento: Forma e Técnica",
    description: "Domine o rei dos exercícios com segurança e eficiência",
    thumbnail: "/placeholder.svg",
    duration: "18:20",
    views: 1567,
    category: "Técnica",
    completed: false,
    uploadDate: "2024-01-22",
  },
  {
    id: 5,
    title: "Descanso e Recuperação Muscular",
    description: "A importância do descanso no processo de hipertrofia",
    thumbnail: "/placeholder.svg",
    duration: "14:10",
    views: 765,
    category: "Teoria",
    completed: false,
    uploadDate: "2024-01-25",
  },
  {
    id: 6,
    title: "Treino de Costas: Remadas",
    description: "Diferentes variações de remadas e como executá-las",
    thumbnail: "/placeholder.svg",
    duration: "16:55",
    views: 1421,
    category: "Técnica",
    completed: false,
    uploadDate: "2024-01-28",
  },
]

const categories = ["Todos", "Teoria", "Técnica", "Nutrição"]

export default function StudentVideosPage() {
  const params = useParams()
  const studentId = params.id as string
  const { user, isLoading } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<typeof mockVideos[0] | null>(null)

  const filteredVideos = mockVideos.filter((video) => {
    const matchesCategory = selectedCategory === "Todos" || video.category === selectedCategory
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const completedCount = mockVideos.filter(v => v.completed).length
  const progressPercentage = (completedCount / mockVideos.length) * 100

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Vídeo Aulas</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Aprenda com conteúdo exclusivo do seu treinador
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{completedCount}/{mockVideos.length}</p>
                <p className="text-xs text-muted-foreground">Aulas Concluídas</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso do Curso</span>
              <span className="text-sm font-medium text-foreground">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeo aulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Player (if video selected) */}
        {selectedVideo && (
          <Card className="p-6 mb-6 bg-card border-border">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="h-16 w-16 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Reproduzindo: {selectedVideo.title}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{selectedVideo.title}</h2>
                <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedVideo.views} visualizações
                  </span>
                  <Badge>{selectedVideo.category}</Badge>
                </div>
              </div>
              {!selectedVideo.completed && (
                <Button>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Concluída
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <Card 
              key={video.id} 
              className="overflow-hidden bg-card border-border hover:border-primary transition-colors cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-12 w-12 text-primary" />
                </div>
                {video.completed && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Concluída
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                    {video.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>
                  <span>{new Date(video.uploadDate).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <Card className="p-12 bg-card border-border">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum vídeo encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou termo de busca
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
