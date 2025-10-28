"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Video, Eye, Clock, Trash2, Edit, Plus } from "lucide-react"

// Mock data for uploaded videos
const mockUploadedVideos = [
  {
    id: 1,
    title: "Introdução ao Treino de Hipertrofia",
    description: "Aprenda os fundamentos do treino para ganho de massa muscular",
    thumbnail: "/placeholder.svg",
    duration: "15:30",
    views: 1234,
    category: "Teoria",
    uploadDate: "2024-01-15",
    status: "published",
  },
  {
    id: 2,
    title: "Técnica Correta: Supino Reto",
    description: "Execução perfeita do supino reto para máximo desenvolvimento do peitoral",
    thumbnail: "/placeholder.svg",
    duration: "12:45",
    views: 892,
    category: "Técnica",
    uploadDate: "2024-01-18",
    status: "published",
  },
  {
    id: 3,
    title: "Nutrição para Ganho de Massa",
    description: "Como montar sua dieta para maximizar os ganhos",
    thumbnail: "/placeholder.svg",
    duration: "20:15",
    views: 2103,
    category: "Nutrição",
    uploadDate: "2024-01-20",
    status: "published",
  },
]

const categories = ["Teoria", "Técnica", "Nutrição", "Treino Prático"]

export default function TrainerVideosPage() {
  const params = useParams()
  const trainerId = params.id as string
  const { user, isLoading } = useAuth()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "",
    videoFile: null as File | null,
  })

  const totalViews = mockUploadedVideos.reduce((sum, video) => sum + video.views, 0)
  const totalVideos = mockUploadedVideos.length

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
              <h1 className="text-3xl font-bold text-foreground">Gerenciar Vídeo Aulas</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Faça upload e gerencie seu conteúdo educacional
              </p>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Vídeo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload de Vídeo Aula</DialogTitle>
                  <DialogDescription>
                    Faça upload de um novo vídeo para seus alunos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Vídeo</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Técnica de Agachamento"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o conteúdo do vídeo..."
                      rows={4}
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={uploadData.category}
                      onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video">Arquivo de Vídeo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Clique para selecionar ou arraste o vídeo aqui
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formatos aceitos: MP4, AVI, MOV (Máx. 500MB)
                      </p>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadData({ ...uploadData, videoFile: e.target.files[0] })
                          }
                        }}
                      />
                    </div>
                    {uploadData.videoFile && (
                      <p className="text-sm text-green-500">
                        ✓ {uploadData.videoFile.name} selecionado
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    // Handle upload logic here
                    console.log("Uploading:", uploadData)
                    setIsUploadDialogOpen(false)
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalVideos}</p>
                  <p className="text-sm text-muted-foreground">Vídeos Publicados</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalViews}</p>
                  <p className="text-sm text-muted-foreground">Total de Visualizações</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockUploadedVideos.reduce((sum, v) => {
                      const [min, sec] = v.duration.split(':').map(Number)
                      return sum + min
                    }, 0)} min
                  </p>
                  <p className="text-sm text-muted-foreground">Tempo Total de Conteúdo</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Video List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Seus Vídeos</h2>
          
          {mockUploadedVideos.map((video) => (
            <Card key={video.id} className="p-4 bg-card border-border">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-48 h-28 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                    <Badge variant={video.status === "published" ? "default" : "secondary"}>
                      {video.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views} visualizações
                    </span>
                    <Badge variant="outline">{video.category}</Badge>
                    <span>
                      Publicado em {new Date(video.uploadDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mockUploadedVideos.length === 0 && (
          <Card className="p-12 bg-card border-border">
            <div className="text-center">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum vídeo publicado ainda
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece fazendo upload do seu primeiro vídeo aula
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Vídeo
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
