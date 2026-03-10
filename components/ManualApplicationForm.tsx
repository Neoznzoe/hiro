'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="hiro-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="font-semibold">Ajouter une candidature</h2>
          <button onClick={onClose} className="hiro-btn-ghost p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Entreprise *</label>
            <input className="hiro-input" value={form.companyName} onChange={e => update('companyName', e.target.value)} required />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Poste *</label>
            <input className="hiro-input" value={form.position} onChange={e => update('position', e.target.value)} required />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Source</label>
            <select className="hiro-input" value={form.source} onChange={e => update('source', e.target.value)}>
              <option value="spontaneous">Candidature spontanée</option>
              <option value="indeed">Indeed</option>
              <option value="linkedin">LinkedIn</option>
              <option value="wttj">Welcome to the Jungle</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">URL de l&apos;offre</label>
            <input className="hiro-input" type="url" value={form.offerUrl} onChange={e => update('offerUrl', e.target.value)} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Contact</label>
              <input className="hiro-input" value={form.contactName} onChange={e => update('contactName', e.target.value)} placeholder="Nom" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Email</label>
              <input className="hiro-input" type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} placeholder="email@..." />
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Fourchette salariale</label>
            <input className="hiro-input" value={form.salaryRange} onChange={e => update('salaryRange', e.target.value)} placeholder="42-50k€" />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Notes</label>
            <textarea className="hiro-input min-h-[80px] resize-y" value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>

          {error && <p className="text-sm text-tall-poppy-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="hiro-btn-secondary flex-1">Annuler</button>
            <button type="submit" disabled={loading || !form.companyName || !form.position} className="hiro-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
