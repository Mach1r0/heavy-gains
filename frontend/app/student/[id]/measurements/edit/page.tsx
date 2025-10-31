import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function EditPage() {
  return (
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
                  </div>
                </DialogContent>
  )
}
