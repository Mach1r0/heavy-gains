"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Ruler, Camera, Plus, Edit2, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data
const mockMeasurements = [
  {
    id: 1,
    date: "2024-01-15",
    measurements: {
      peso: 82,
      altura: 178,
      bicepsEsquerdo: 38,
      bicepsDireito: 38,
      coxaEsquerda: 58,
      coxaDireita: 58,
      panturrilhaEsquerda: 38,
      panturrilhaDireita: 38,
      cintura: 85,
      quadril: 98,
      peito: 105,
    },
  },
  {
    id: 2,
    date: "2024-01-08",
    measurements: {
      peso: 83,
      altura: 178,
      bicepsEsquerdo: 37.5,
      bicepsDireito: 37.5,
      coxaEsquerda: 57.5,
      coxaDireita: 57.5,
      panturrilhaEsquerda: 37.5,
      panturrilhaDireita: 37.5,
      cintura: 86,
      quadril: 99,
      peito: 104,
    },
  },
]

const mockPhotos = [
  {
    id: 1,
    date: "2024-01-15",
    photos: [
      { url: "/male-fitness.jpg", type: "frente", notes: "Progresso visível no abdômen" },
      { url: "/male-athlete.png", type: "lado", notes: "Postura melhorada" },
      { url: "/athletic-trainer.png", type: "costas", notes: "Definição nas costas" },
    ],
    trainerFeedback: "Excelente progresso! Continue com o treino atual.",
  },
  {
    id: 2,
    date: "2024-01-01",
    photos: [
      { url: "/male-fitness.jpg", type: "frente", notes: "Foto inicial" },
      { url: "/male-athlete.png", type: "lado", notes: "Foto inicial" },
      { url: "/athletic-trainer.png", type: "costas", notes: "Foto inicial" },
    ],
    trainerFeedback: null,
  },
]

export default function MeasurementsPage() {
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false)
  const [isAddingPhoto, setIsAddingPhoto] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Medidas e Fotos</h1>
              <p className="text-sm text-muted-foreground">Acompanhe sua evolução física</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="measurements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="measurements">Medidas</TabsTrigger>
            <TabsTrigger value="photos">Fotos de Progresso</TabsTrigger>
          </TabsList>

          <TabsContent value="measurements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Histórico de Medidas</h2>
              <Dialog open={isAddingMeasurement} onOpenChange={setIsAddingMeasurement}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Medidas
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novas Medidas</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input id="peso" type="number" placeholder="82" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="altura">Altura (cm)</Label>
                      <Input id="altura" type="number" placeholder="178" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biceps-esq">Bíceps Esquerdo (cm)</Label>
                      <Input id="biceps-esq" type="number" placeholder="38" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biceps-dir">Bíceps Direito (cm)</Label>
                      <Input id="biceps-dir" type="number" placeholder="38" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coxa-esq">Coxa Esquerda (cm)</Label>
                      <Input id="coxa-esq" type="number" placeholder="58" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coxa-dir">Coxa Direita (cm)</Label>
                      <Input id="coxa-dir" type="number" placeholder="58" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panturrilha-esq">Panturrilha Esquerda (cm)</Label>
                      <Input id="panturrilha-esq" type="number" placeholder="38" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panturrilha-dir">Panturrilha Direita (cm)</Label>
                      <Input id="panturrilha-dir" type="number" placeholder="38" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cintura">Cintura (cm)</Label>
                      <Input id="cintura" type="number" placeholder="85" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quadril">Quadril (cm)</Label>
                      <Input id="quadril" type="number" placeholder="98" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peito">Peito (cm)</Label>
                      <Input id="peito" type="number" placeholder="105" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingMeasurement(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsAddingMeasurement(false)}>Salvar Medidas</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockMeasurements.map((record) => (
                <Card key={record.id} className="p-6 bg-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Ruler className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Medidas de {new Date(record.date).toLocaleDateString("pt-BR")}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Peso</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.peso} kg</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Altura</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.altura} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Bíceps Esq.</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.bicepsEsquerdo} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Bíceps Dir.</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.bicepsDireito} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Coxa Esq.</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.coxaEsquerda} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Coxa Dir.</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.coxaDireita} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Panturrilha Esq.</p>
                      <p className="text-lg font-semibold text-foreground">
                        {record.measurements.panturrilhaEsquerda} cm
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Panturrilha Dir.</p>
                      <p className="text-lg font-semibold text-foreground">
                        {record.measurements.panturrilhaDireita} cm
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Cintura</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.cintura} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Quadril</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.quadril} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Peito</p>
                      <p className="text-lg font-semibold text-foreground">{record.measurements.peito} cm</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Fotos de Progresso</h2>
              <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
                <DialogTrigger asChild>
                  <Button>
                    <Camera className="h-4 w-4 mr-2" />
                    Adicionar Fotos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Fotos de Progresso</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Data das Fotos</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Foto Frontal</Label>
                      <Input type="file" accept="image/*" />
                      <Input placeholder="Observações sobre a foto frontal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Foto Lateral</Label>
                      <Input type="file" accept="image/*" />
                      <Input placeholder="Observações sobre a foto lateral" />
                    </div>
                    <div className="space-y-2">
                      <Label>Foto de Costas</Label>
                      <Input type="file" accept="image/*" />
                      <Input placeholder="Observações sobre a foto de costas" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingPhoto(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsAddingPhoto(false)}>Salvar Fotos</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-6">
              {mockPhotos.map((record) => (
                <Card key={record.id} className="p-6 bg-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Fotos de {new Date(record.date).toLocaleDateString("pt-BR")}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={record.trainerFeedback ? "default" : "secondary"}>
                      {record.trainerFeedback ? "Avaliado" : "Aguardando avaliação"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {record.photos.map((photo, index) => (
                      <div key={index} className="space-y-2">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                          <img
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.type}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">{photo.type}</p>
                          <p className="text-xs text-muted-foreground">{photo.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {record.trainerFeedback && (
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-foreground mb-1">Feedback do Treinador:</p>
                      <p className="text-sm text-muted-foreground">{record.trainerFeedback}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
