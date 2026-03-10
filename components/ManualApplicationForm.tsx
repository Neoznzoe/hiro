'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Props {
  onSuccess: () => void
  onClose: () => void
}

export function ManualApplicationForm({ onSuccess, onClose }: Props) {
  const [form, setForm] = useState({
    companyName: '',
    position: '',
    source: 'spontaneous',
    offerUrl: '',
    contactName: '',
    contactEmail: '',
    salaryRange: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.companyName || !form.position) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          offerUrl: form.offerUrl || undefined,
          contactName: form.contactName || undefined,
          contactEmail: form.contactEmail || undefined,
          salaryRange: form.salaryRange || undefined,
          notes: form.notes || undefined,
          status: 'to_apply',
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur serveur')
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une candidature</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Entreprise *</Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={e => update('companyName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Poste *</Label>
            <Input
              id="position"
              value={form.position}
              onChange={e => update('position', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={form.source} onValueChange={(v) => update('source', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spontaneous">Candidature spontanée</SelectItem>
                <SelectItem value="indeed">Indeed</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="wttj">Welcome to the Jungle</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerUrl">URL de l&apos;offre</Label>
            <Input
              id="offerUrl"
              type="url"
              value={form.offerUrl}
              onChange={e => update('offerUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact</Label>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={e => update('contactName', e.target.value)}
                placeholder="Nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={e => update('contactEmail', e.target.value)}
                placeholder="email@..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryRange">Fourchette salariale</Label>
            <Input
              id="salaryRange"
              value={form.salaryRange}
              onChange={e => update('salaryRange', e.target.value)}
              placeholder="42-50k€"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              className="min-h-[80px] resize-y"
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.companyName || !form.position}
              className="flex-1"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
