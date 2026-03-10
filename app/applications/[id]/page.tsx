'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Loader2, ExternalLink, Save } from 'lucide-react'
import { StatusBadge, SourceBadge } from '@/components/StatusBadge'
import { AnalysisResultView } from '@/components/AnalysisResultView'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ApplicationStatus, AnalysisResult } from '@/types'

interface AppDetail {
  id: string
  companyName: string
  position: string
  source: string
  offerUrl: string | null
  status: ApplicationStatus
  appliedAt: string | null
  nextFollowupAt: string | null
  followupDelayDays: number
  contactName: string | null
  contactEmail: string | null
  salaryRange: string | null
  notes: string | null
  analysisData: AnalysisResult | null
  createdAt: string
  updatedAt: string
  events: Array<{
    id: string
    eventType: string
    payload: Record<string, string> | null
    createdAt: string
  }>
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'to_apply', label: 'A postuler' },
  { value: 'applied', label: 'Postulé' },
  { value: 'followup', label: 'Relance' },
  { value: 'interview', label: 'Entretien' },
  { value: 'offer', label: 'Offre' },
  { value: 'rejected', label: 'Refus' },
  { value: 'archived', label: 'Archivé' },
]

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [app, setApp] = useState<AppDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then(r => r.json())
      .then(data => {
        setApp(data)
        setNotes(data.notes || '')
        setLoading(false)
      })
  }, [id])

  async function handleStatusChange(newStatus: ApplicationStatus) {
    if (!app || newStatus === app.status) return
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    const updated = await res.json()
    setApp(updated)
  }

  async function handleSaveNotes() {
    setSavingNotes(true)
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    setSavingNotes(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    router.push('/applications')
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="p-8">
        <p className="text-[var(--text-muted)]">Candidature introuvable.</p>
        <Link href="/applications" className="hiro-btn-ghost mt-4 inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/applications" className="hiro-btn-ghost inline-flex items-center gap-1 mb-3 -ml-3">
            <ArrowLeft size={14} /> Candidatures
          </Link>
          <h1 className="text-2xl font-bold">{app.companyName}</h1>
          <p className="text-[var(--text-muted)]">{app.position}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={app.status}
            onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
            className="hiro-input w-auto"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <StatusBadge status={app.status} />
        </div>
      </div>

      {/* Info grid */}
      <div className="hiro-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoField label="Source" value={<SourceBadge source={app.source} />} />
          {app.offerUrl && (
            <InfoField label="Offre" value={
              <a href={app.offerUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
                Voir l&apos;offre <ExternalLink size={12} />
              </a>
            } />
          )}
          {app.contactName && <InfoField label="Contact" value={app.contactName} />}
          {app.contactEmail && <InfoField label="Email" value={app.contactEmail} />}
          {app.salaryRange && <InfoField label="Salaire" value={app.salaryRange} />}
          <InfoField label="Créée le" value={format(new Date(app.createdAt), 'dd MMM yyyy', { locale: fr })} />
          {app.appliedAt && <InfoField label="Postulé le" value={format(new Date(app.appliedAt), 'dd MMM yyyy', { locale: fr })} />}
          {app.nextFollowupAt && <InfoField label="Prochaine relance" value={format(new Date(app.nextFollowupAt), 'dd MMM yyyy', { locale: fr })} />}
        </div>
      </div>

      {/* Notes */}
      <div className="hiro-card p-5 space-y-3">
        <h3 className="font-semibold text-sm">Notes</h3>
        <textarea
          className="hiro-input min-h-[100px] resize-y"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Ajouter des notes sur cette candidature..."
        />
        <button
          onClick={handleSaveNotes}
          disabled={savingNotes}
          className="hiro-btn-secondary flex items-center gap-2"
        >
          {savingNotes ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Sauvegarder
        </button>
      </div>

      {/* Analyse */}
      {app.analysisData && (
        <section>
          <h3 className="font-semibold text-sm mb-3">Rapport d&apos;analyse</h3>
          <AnalysisResultView analysis={app.analysisData} />
        </section>
      )}

      {/* Timeline */}
      {app.events.length > 0 && (
        <section className="hiro-card p-5">
          <h3 className="font-semibold text-sm mb-4">Historique</h3>
          <div className="space-y-3">
            {app.events.map(event => (
              <div key={event.id} className="flex items-start gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-[var(--text-muted)]">
                    {format(new Date(event.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </span>
                  <span className="mx-2">&#8212;</span>
                  <span>
                    {event.eventType === 'status_change' && event.payload
                      ? `Statut : ${event.payload.from || 'nouveau'} → ${event.payload.to}`
                      : event.eventType.replace('_', ' ')
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Delete */}
      <div className="border-t border-[var(--border)] pt-4">
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-tall-poppy-400">Supprimer cette candidature ?</span>
            <button onClick={handleDelete} disabled={deleting} className="hiro-btn-danger flex items-center gap-2">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Confirmer
            </button>
            <button onClick={() => setConfirmDelete(false)} className="hiro-btn-ghost">Annuler</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="hiro-btn-ghost text-[var(--text-subtle)] flex items-center gap-2">
            <Trash2 size={14} />
            Supprimer
          </button>
        )}
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs text-[var(--text-muted)] block mb-0.5">{label}</span>
      {typeof value === 'string' ? <span className="text-sm font-medium">{value}</span> : value}
    </div>
  )
}
