'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Plus, AlertCircle } from 'lucide-react'
import { AnalysisResultView } from '@/components/AnalysisResultView'
import type { AnalysisResult } from '@/types'

const STEPS = [
  'Scraping de l\'offre...',
  'Analyse de la boîte...',
  'Intelligence entretien...',
  'Adaptation CV...',
  'Finalisation...',
]

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [rawText, setRawText] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState<{ analysis: AnalysisResult; offerContent: string } | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % STEPS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [loading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url && !rawText) return

    setLoading(true)
    setError('')
    setResult(null)
    setStepIndex(0)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url || undefined, rawText: rawText || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)

    // Détecte la source depuis l'URL
    let source = 'other'
    if (url) {
      if (url.includes('indeed')) source = 'indeed'
      else if (url.includes('linkedin')) source = 'linkedin'
      else if (url.includes('welcometothejungle')) source = 'wttj'
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: result.analysis.offer.companyName,
          position: result.analysis.offer.title,
          source,
          offerUrl: url || undefined,
          status: 'to_apply',
          salaryRange: result.analysis.offer.salaryRange || undefined,
          analysisData: result.analysis,
        }),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde')
      router.push('/applications')
    } catch {
      setError('Impossible de sauvegarder la candidature')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Analyser une offre</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            className="hiro-input"
            placeholder="Colle l'URL de l'offre..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-3">
          <hr className="hiro-divider flex-1" />
          <span className="text-xs text-[var(--text-subtle)]">ou</span>
          <hr className="hiro-divider flex-1" />
        </div>

        <div>
          <textarea
            className="hiro-input min-h-[120px] resize-y"
            placeholder="...ou colle le texte de l'offre directement"
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!url && !rawText)}
          className="hiro-btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {loading ? 'Analyse en cours...' : 'Lancer l\'analyse'}
        </button>
      </form>

      {/* Loading steps */}
      {loading && (
        <div className="hiro-card p-6">
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={step} className={`flex items-center gap-3 text-sm transition-opacity ${i <= stepIndex ? 'opacity-100' : 'opacity-30'}`}>
                {i < stepIndex ? (
                  <span className="w-5 h-5 rounded-full bg-chateau-green-300 flex items-center justify-center text-white text-xs">&#10003;</span>
                ) : i === stepIndex ? (
                  <Loader2 size={18} className="animate-spin text-[var(--accent)]" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-[var(--border)]" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="hiro-card p-4 border-[var(--tall-poppy-300)] flex items-center gap-3">
          <AlertCircle size={18} className="text-tall-poppy-400 flex-shrink-0" />
          <p className="text-sm text-tall-poppy-300">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <AnalysisResultView analysis={result.analysis} />

          <button
            onClick={handleSave}
            disabled={saving}
            className="hiro-btn-primary flex items-center gap-2 w-full justify-center py-3"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? 'Sauvegarde...' : 'Ajouter à mes candidatures'}
          </button>
        </div>
      )}
    </div>
  )
}
