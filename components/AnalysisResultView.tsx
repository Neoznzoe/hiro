'use client'

import type { AnalysisResult } from '@/types'
import { ScoreBar, ScoreBig } from './ScoreBar'
import {
  Target, Building2, MessageSquare, FileText, TrendingUp,
  AlertTriangle, ChevronDown, Star, Shield, Eye, Zap, Sparkles
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export function AnalysisResultView({ analysis }: { analysis: AnalysisResult }) {
  const { offer, company, interview, cv, score, analysisMode } = analysis

  const modeConfig = analysisMode === 'quick'
    ? { label: 'Analyse rapide', icon: Zap, className: 'bg-zest-50 text-zest-300' }
    : { label: 'Analyse approfondie', icon: Sparkles, className: 'bg-blue-ribbon-50 text-blue-ribbon-500' }

  const recColor = score.recommendation === 'apply'
    ? 'bg-chateau-green-50 text-chateau-green-300 hover:bg-chateau-green-50'
    : score.recommendation === 'apply_with_caution'
      ? 'bg-zest-50 text-zest-300 hover:bg-zest-50'
      : 'bg-tall-poppy-50 text-tall-poppy-400 hover:bg-tall-poppy-50'

  const recLabel = score.recommendation === 'apply'
    ? 'Postuler'
    : score.recommendation === 'apply_with_caution'
      ? 'Postuler avec prudence'
      : 'Passer'

  const ModeIcon = modeConfig.icon

  return (
    <Accordion type="multiple" defaultValue={['score', 'offer']} className="space-y-2">
      {/* Score global */}
      <AccordionItem value="score" className="border rounded-lg bg-card px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2.5 font-semibold text-sm flex-1">
            <Target className="h-4 w-4" />
            Score global
            <Badge className={cn('ml-auto mr-2 font-medium', modeConfig.className)}>
              <ModeIcon className="h-3 w-3 mr-1" />
              {modeConfig.label}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="flex items-center gap-8 mb-4">
            <ScoreBig score={score.overall} label="Score global" />
            <div className="flex-1 space-y-2">
              <ScoreBar score={score.relevance} label="Pertinence" />
              <ScoreBar score={score.legitimacy} label="Legitimité" />
              <ScoreBar score={score.attractiveness} label="Attractivité" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={recColor}>{recLabel}</Badge>
            <span className="text-sm text-muted-foreground">{score.recommendationReason}</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Analyse de l'offre */}
      <AccordionItem value="offer" className="border rounded-lg bg-card px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2.5 font-semibold text-sm">
            <FileText className="h-4 w-4" />
            Analyse de l&apos;offre
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Info label="Poste" value={offer.title} />
            <Info label="Entreprise" value={offer.companyName} />
            <Info label="Localisation" value={offer.location} />
            <Info label="Contrat" value={offer.contractType} />
            {offer.salaryRange && <Info label="Salaire" value={offer.salaryRange} />}
            <Info label="Style de management" value={offer.managementStyle} />
            <Info label="Type de boîte" value={offer.companyTone} />
          </div>

          {offer.stack.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Stack technique</span>
              <div className="flex flex-wrap gap-1.5">
                {offer.stack.map(t => (
                  <Badge key={t} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {offer.hardSkills.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Hard skills</span>
              <div className="flex flex-wrap gap-1.5">
                {offer.hardSkills.map(s => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {offer.softSkills.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Soft skills</span>
              <div className="flex flex-wrap gap-1.5">
                {offer.softSkills.map(s => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {offer.redFlags.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3 w-3" /> Red flags
              </span>
              <div className="space-y-2">
                {offer.redFlags.map((rf, i) => (
                  <div key={i} className={cn(
                    'p-2.5 rounded-lg',
                    rf.severity === 'high' ? 'redflag-high' : rf.severity === 'medium' ? 'redflag-med' : 'redflag-low'
                  )}>
                    <div className="font-medium text-sm">{rf.label}</div>
                    <div className="text-xs opacity-80 mt-0.5">{rf.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ScoreBar score={offer.qualityScore} label="Qualité de l'offre" size="lg" />
          <p className="text-sm text-muted-foreground">{offer.summary}</p>
        </AccordionContent>
      </AccordionItem>

      {/* Analyse de la boîte */}
      <AccordionItem value="company" className="border rounded-lg bg-card px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2.5 font-semibold text-sm">
            <Building2 className="h-4 w-4" />
            Analyse de la boîte
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Info label="Nom" value={company.name} />
            {company.website && <Info label="Site" value={company.website} isLink />}
            {company.size && <Info label="Taille" value={company.size} />}
            {company.foundedYear && <Info label="Fondée" value={String(company.foundedYear)} />}
            <Info label="Secteur" value={company.sector} />
            {company.glassdoorRating && <Info label="Glassdoor" value={`${company.glassdoorRating}/5`} />}
          </div>

          <ScoreBar score={company.healthScore} label="Score de santé" size="lg" />

          {company.recentNews.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Actualités récentes</span>
              <div className="space-y-1.5">
                {company.recentNews.map((news, i) => {
                  const sentColor = news.sentiment === 'positive' ? 'text-chateau-green-300' : news.sentiment === 'negative' ? 'text-tall-poppy-400' : 'text-muted-foreground'
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={sentColor}>●</span>
                      <span className="text-foreground">{news.title}</span>
                      {news.date && <span className="text-xs text-muted-foreground">{news.date}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {company.warnings.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3 w-3" /> Alertes
              </span>
              <ul className="space-y-1 text-sm text-zest-300">
                {company.warnings.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
          )}

          <p className="text-sm text-muted-foreground">{company.summary}</p>
        </AccordionContent>
      </AccordionItem>

      {/* Intelligence entretien */}
      <AccordionItem value="interview" className="border rounded-lg bg-card px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2.5 font-semibold text-sm">
            <MessageSquare className="h-4 w-4" />
            Intelligence entretien
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5 text-foreground">
                <Star className="h-4 w-4" /> Questions à poser
              </h4>
              <div className="space-y-3">
                {interview.questionsToAsk.map((q, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-foreground">{i + 1}. {q.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.why}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5 text-foreground">
                <Shield className="h-4 w-4" /> Questions à préparer
              </h4>
              <div className="space-y-3">
                {interview.questionsToExpect.map((q, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-foreground">{i + 1}. {q.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {interview.starSuggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">Réponses STAR suggérées</h4>
              <Accordion type="single" collapsible className="space-y-2">
                {interview.starSuggestions.map((s, i) => (
                  <AccordionItem key={i} value={`star-${i}`} className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                      {s.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 space-y-1.5 text-xs text-muted-foreground">
                      <p><strong className="text-foreground">Situation :</strong> {s.situation}</p>
                      <p><strong className="text-foreground">Tâche :</strong> {s.task}</p>
                      <p><strong className="text-foreground">Action :</strong> {s.action}</p>
                      <p><strong className="text-foreground">Résultat :</strong> {s.result}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Points forts à mettre en avant
              </span>
              <div className="flex flex-wrap gap-1.5">
                {interview.strengthsToHighlight.map(s => (
                  <Badge key={s} className="bg-chateau-green-50 text-chateau-green-300 hover:bg-chateau-green-50">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1">
                <Eye className="h-3 w-3" /> Angles morts à préparer
              </span>
              <div className="flex flex-wrap gap-1.5">
                {interview.blindspotsToPrep.map(b => (
                  <Badge key={b} className="bg-zest-50 text-zest-300 hover:bg-zest-50">{b}</Badge>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Adaptation CV */}
      <AccordionItem value="cv" className="border rounded-lg bg-card px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2.5 font-semibold text-sm">
            <FileText className="h-4 w-4" />
            Adaptation CV
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ScoreBar score={cv.overallMatch} label="Match global CV / offre" size="lg" />

          {cv.keywordsToAdd.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Mots-clés ATS à intégrer</span>
              <div className="flex flex-wrap gap-1.5">
                {cv.keywordsToAdd.map(k => (
                  <Badge key={k} className="bg-primary/10 text-primary hover:bg-primary/10">{k}</Badge>
                ))}
              </div>
            </div>
          )}

          {cv.sectionsToRework.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs text-muted-foreground block">Sections à reformuler</span>
              {cv.sectionsToRework.map((s, i) => (
                <Card key={i}>
                  <CardContent className="p-3 space-y-1.5">
                    <div className="font-medium text-sm text-foreground">{s.section}</div>
                    {s.current && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Actuel : </span>
                        <span className="text-tall-poppy-300">{s.current}</span>
                      </div>
                    )}
                    <div className="text-xs">
                      <span className="text-muted-foreground">Suggéré : </span>
                      <span className="text-chateau-green-200">{s.suggested}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{s.reason}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function Info({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground block">{label}</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{value}</a>
      ) : (
        <span className="text-sm font-medium text-foreground">{value}</span>
      )}
    </div>
  )
}
