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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

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
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Candidature introuvable.</p>
        <Button variant="ghost" asChild className="mt-4">
          <Link href="/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-3 -ml-3">
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Candidatures
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{app.companyName}</h1>
          <p className="text-muted-foreground">{app.position}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={app.status} onValueChange={(v) => handleStatusChange(v as ApplicationStatus)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <StatusBadge status={app.status} />
        </div>
      </div>

      {/* Info grid */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoField label="Source" value={<SourceBadge source={app.source} />} />
            {app.offerUrl && (
              <InfoField label="Offre" value={
                <a href={app.offerUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Voir l&apos;offre <ExternalLink className="h-3 w-3" />
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
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            className="min-h-[100px] resize-y"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Ajouter des notes sur cette candidature..."
          />
          <Button
            variant="secondary"
            onClick={handleSaveNotes}
            disabled={savingNotes}
          >
            {savingNotes ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </CardContent>
      </Card>

      {/* Analyse */}
      {app.analysisData && (
        <section>
          <h3 className="font-semibold text-sm mb-3 text-foreground">Rapport d&apos;analyse</h3>
          <AnalysisResultView analysis={app.analysisData} />
        </section>
      )}

      {/* Timeline */}
      {app.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Historique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {app.events.map(event => (
              <div key={event.id} className="flex items-start gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">
                    {format(new Date(event.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </span>
                  <span className="mx-2">—</span>
                  <span className="text-foreground">
                    {event.eventType === 'status_change' && event.payload
                      ? `Statut : ${event.payload.from || 'nouveau'} → ${event.payload.to}`
                      : event.eventType.replace('_', ' ')
                    }
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Delete */}
      <Separator />
      <div>
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-destructive">Supprimer cette candidature ?</span>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Confirmer
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        )}
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground block mb-0.5">{label}</span>
      {typeof value === 'string' ? <span className="text-sm font-medium text-foreground">{value}</span> : value}
    </div>
  )
}
