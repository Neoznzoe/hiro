'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Plus, AlertCircle, CheckCircle2, Circle } from 'lucide-react'
import { AnalysisResultView } from '@/components/AnalysisResultView'
import type { AnalysisResult } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

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
      <h1 className="text-2xl font-bold text-foreground">Analyser une offre</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL de l'offre</label>
              <Input
                type="url"
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Texte de l'offre</label>
              <Textarea
                className="min-h-[120px] resize-y"
                placeholder="Colle le texte de l'offre directement ici..."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || (!url && !rawText)}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Lancer l'analyse
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading steps */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <div key={step} className={`flex items-center gap-3 text-sm transition-opacity ${i <= stepIndex ? 'opacity-100' : 'opacity-30'}`}>
                  {i < stepIndex ? (
                    <CheckCircle2 className="h-5 w-5 text-chateau-green-300" />
                  ) : i === stepIndex ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <AnalysisResultView analysis={result.analysis} />

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-6"
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter à mes candidatures
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
