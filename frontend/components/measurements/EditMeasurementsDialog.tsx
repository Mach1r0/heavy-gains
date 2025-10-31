"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Measurements {
  peso?: number
  altura?: number
  bicepsEsquerdo?: number
  bicepsDireito?: number
  coxaEsquerda?: number
  coxaDireita?: number
  panturrilhaEsquerda?: number
  panturrilhaDireita?: number
  cintura?: number
  quadril?: number
  peito?: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: { id: number; date: string; measurements: Measurements }
  onSave?: (id: number | undefined, measurements: Measurements) => void
}

export default function EditMeasurementsDialog({ open, onOpenChange, record, onSave }: Props) {
  const [form, setForm] = useState<Measurements>({})

  useEffect(() => {
    if (record) {
      setForm(record.measurements || {})
    } else {
      setForm({})
    }
  }, [record, open])

  function handleChange<K extends keyof Measurements>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value === "" ? undefined : Number(value) }))
  }

  function handleSave() {
    if (onSave) onSave(record?.id, form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Medidas</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input id="peso" type="number" defaultValue={form.peso ?? ""} onChange={(e) => handleChange("peso", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input id="altura" type="number" defaultValue={form.altura ?? ""} onChange={(e) => handleChange("altura", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biceps-esq">Bíceps Esquerdo (cm)</Label>
            <Input id="biceps-esq" type="number" defaultValue={form.bicepsEsquerdo ?? ""} onChange={(e) => handleChange("bicepsEsquerdo", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biceps-dir">Bíceps Direito (cm)</Label>
            <Input id="biceps-dir" type="number" defaultValue={form.bicepsDireito ?? ""} onChange={(e) => handleChange("bicepsDireito", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coxa-esq">Coxa Esquerda (cm)</Label>
            <Input id="coxa-esq" type="number" defaultValue={form.coxaEsquerda ?? ""} onChange={(e) => handleChange("coxaEsquerda", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coxa-dir">Coxa Direita (cm)</Label>
            <Input id="coxa-dir" type="number" defaultValue={form.coxaDireita ?? ""} onChange={(e) => handleChange("coxaDireita", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="panturrilha-esq">Panturrilha Esquerda (cm)</Label>
            <Input id="panturrilha-esq" type="number" defaultValue={form.panturrilhaEsquerda ?? ""} onChange={(e) => handleChange("panturrilhaEsquerda", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="panturrilha-dir">Panturrilha Direita (cm)</Label>
            <Input id="panturrilha-dir" type="number" defaultValue={form.panturrilhaDireita ?? ""} onChange={(e) => handleChange("panturrilhaDireita", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cintura">Cintura (cm)</Label>
            <Input id="cintura" type="number" defaultValue={form.cintura ?? ""} onChange={(e) => handleChange("cintura", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quadril">Quadril (cm)</Label>
            <Input id="quadril" type="number" defaultValue={form.quadril ?? ""} onChange={(e) => handleChange("quadril", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="peito">Peito (cm)</Label>
            <Input id="peito" type="number" defaultValue={form.peito ?? ""} onChange={(e) => handleChange("peito", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
