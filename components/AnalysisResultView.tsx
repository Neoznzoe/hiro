'use client'

import type { AnalysisResult } from '@/types'
import { ScoreBar, ScoreBig } from './ScoreBar'
import {
  Target, Building2, MessageSquare, FileText, TrendingUp,
  AlertTriangle, ChevronDown, Star, Shield, Eye
} from 'lucide-react'

export function AnalysisResultView({ analysis }: { analysis: AnalysisResult }) {
  const { offer, company, interview, cv, score } = analysis

  const recColor = score.recommendation === 'apply'
    ? 'bg-chateau-green-50 text-chateau-green-300'
    : score.recommendation === 'apply_with_caution'
      ? 'bg-zest-50 text-zest-300'
      : 'bg-tall-poppy-50 text-tall-poppy-400'

  const recLabel = score.recommendation === 'apply'
    ? 'Postuler'
    : score.recommendation === 'apply_with_caution'
      ? 'Postuler avec prudence'
      : 'Passer'

  return (
    <div className="space-y-4">
      {/* Score global */}
      <Section icon={<Target size={18} />} title="Score global" defaultOpen>
        <div className="flex items-center gap-8 mb-4">
          <ScoreBig score={score.overall} label="Score global" />
          <div className="flex-1 space-y-2">
            <ScoreBar score={score.relevance} label="Pertinence" />
            <ScoreBar score={score.legitimacy} label="Legitimité" />
            <ScoreBar score={score.attractiveness} label="Attractivité" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`hiro-badge ${recColor}`}>{recLabel}</span>
          <span className="text-sm text-[var(--text-muted)]">{score.recommendationReason}</span>
        </div>
      </Section>

      {/* Analyse de l'offre */}
      <Section icon={<FileText size={18} />} title="Analyse de l'offre" defaultOpen>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Info label="Poste" value={offer.title} />
          <Info label="Entreprise" value={offer.companyName} />
          <Info label="Localisation" value={offer.location} />
          <Info label="Contrat" value={offer.contractType} />
          {offer.salaryRange && <Info label="Salaire" value={offer.salaryRange} />}
          <Info label="Style de management" value={offer.managementStyle} />
          <Info label="Type de boîte" value={offer.companyTone} />
        </div>

        {offer.stack.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-[var(--text-muted)] block mb-1">Stack technique</span>
            <div className="flex flex-wrap gap-1.5">
              {offer.stack.map(t => <span key={t} className="hiro-badge bg-[var(--accent-subtle)] text-[var(--accent)]">{t}</span>)}
            </div>
          </div>
        )}

        {offer.hardSkills.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-[var(--text-muted)] block mb-1">Hard skills</span>
            <div className="flex flex-wrap gap-1.5">
              {offer.hardSkills.map(s => <span key={s} className="hiro-badge bg-[var(--bg-muted)] text-[var(--text)]">{s}</span>)}
            </div>
          </div>
        )}

        {offer.softSkills.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-[var(--text-muted)] block mb-1">Soft skills</span>
            <div className="flex flex-wrap gap-1.5">
              {offer.softSkills.map(s => <span key={s} className="hiro-badge bg-[var(--bg-muted)] text-[var(--text-muted)]">{s}</span>)}
            </div>
          </div>
        )}

        {offer.redFlags.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-2">
              <AlertTriangle size={14} /> Red flags
            </span>
            <div className="space-y-2">
              {offer.redFlags.map((rf, i) => (
                <div key={i} className={`redflag-${rf.severity === 'medium' ? 'med' : rf.severity} p-2.5 rounded-lg`}>
                  <div className="font-medium text-sm">{rf.label}</div>
                  <div className="text-xs opacity-80 mt-0.5">{rf.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ScoreBar score={offer.qualityScore} label="Qualité de l'offre" size="lg" />
        <p className="text-sm text-[var(--text-muted)] mt-3">{offer.summary}</p>
      </Section>

      {/* Analyse de la boîte */}
      <Section icon={<Building2 size={18} />} title="Analyse de la boîte">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Info label="Nom" value={company.name} />
          {company.website && <Info label="Site" value={company.website} isLink />}
          {company.size && <Info label="Taille" value={company.size} />}
          {company.foundedYear && <Info label="Fondée" value={String(company.foundedYear)} />}
          <Info label="Secteur" value={company.sector} />
          {company.glassdoorRating && <Info label="Glassdoor" value={`${company.glassdoorRating}/5`} />}
        </div>

        <ScoreBar score={company.healthScore} label="Score de santé" size="lg" />

        {company.recentNews.length > 0 && (
          <div className="mt-4">
            <span className="text-xs text-[var(--text-muted)] block mb-2">Actualités récentes</span>
            <div className="space-y-1.5">
              {company.recentNews.map((news, i) => {
                const sentColor = news.sentiment === 'positive' ? 'text-chateau-green-300' : news.sentiment === 'negative' ? 'text-tall-poppy-400' : 'text-[var(--text-muted)]'
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={sentColor}>&#9679;</span>
                    <span>{news.title}</span>
                    {news.date && <span className="text-xs text-[var(--text-subtle)]">{news.date}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {company.warnings.length > 0 && (
          <div className="mt-4">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-2">
              <AlertTriangle size={14} /> Alertes
            </span>
            <ul className="space-y-1 text-sm text-[var(--zest-300)]">
              {company.warnings.map((w, i) => <li key={i}>&#8226; {w}</li>)}
            </ul>
          </div>
        )}

        <p className="text-sm text-[var(--text-muted)] mt-3">{company.summary}</p>
      </Section>

      {/* Intelligence entretien */}
      <Section icon={<MessageSquare size={18} />} title="Intelligence entretien">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
              <Star size={14} /> Questions à poser
            </h4>
            <div className="space-y-3">
              {interview.questionsToAsk.map((q, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{q.why}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
              <Shield size={14} /> Questions à préparer
            </h4>
            <div className="space-y-3">
              {interview.questionsToExpect.map((q, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{q.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {interview.starSuggestions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3">Réponses STAR suggérées</h4>
            <div className="space-y-3">
              {interview.starSuggestions.map((s, i) => (
                <details key={i} className="hiro-card p-3">
                  <summary className="text-sm font-medium cursor-pointer">{s.question}</summary>
                  <div className="mt-2 space-y-1.5 text-xs text-[var(--text-muted)]">
                    <p><strong className="text-[var(--text)]">Situation :</strong> {s.situation}</p>
                    <p><strong className="text-[var(--text)]">Tâche :</strong> {s.task}</p>
                    <p><strong className="text-[var(--text)]">Action :</strong> {s.action}</p>
                    <p><strong className="text-[var(--text)]">Résultat :</strong> {s.result}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-xs text-[var(--text-muted)] block mb-1.5 flex items-center gap-1">
              <TrendingUp size={12} /> Points forts à mettre en avant
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interview.strengthsToHighlight.map(s => (
                <span key={s} className="hiro-badge bg-chateau-green-50 text-chateau-green-300">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-[var(--text-muted)] block mb-1.5 flex items-center gap-1">
              <Eye size={12} /> Angles morts à préparer
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interview.blindspotsToPrep.map(b => (
                <span key={b} className="hiro-badge bg-zest-50 text-zest-300">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Adaptation CV */}
      <Section icon={<FileText size={18} />} title="Adaptation CV">
        <ScoreBar score={cv.overallMatch} label="Match global CV / offre" size="lg" />

        {cv.keywordsToAdd.length > 0 && (
          <div className="mt-4">
            <span className="text-xs text-[var(--text-muted)] block mb-1.5">Mots-clés ATS à intégrer</span>
            <div className="flex flex-wrap gap-1.5">
              {cv.keywordsToAdd.map(k => (
                <span key={k} className="hiro-badge bg-[var(--accent-subtle)] text-[var(--accent)]">{k}</span>
              ))}
            </div>
          </div>
        )}

        {cv.sectionsToRework.length > 0 && (
          <div className="mt-4 space-y-3">
            <span className="text-xs text-[var(--text-muted)] block">Sections à reformuler</span>
            {cv.sectionsToRework.map((s, i) => (
              <div key={i} className="hiro-card p-3 space-y-1.5">
                <div className="font-medium text-sm">{s.section}</div>
                {s.current && (
                  <div className="text-xs">
                    <span className="text-[var(--text-subtle)]">Actuel : </span>
                    <span className="text-[var(--tall-poppy-300)]">{s.current}</span>
                  </div>
                )}
                <div className="text-xs">
                  <span className="text-[var(--text-subtle)]">Suggéré : </span>
                  <span className="text-chateau-green-200">{s.suggested}</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">{s.reason}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

// Section dépliable
function Section({ icon, title, children, defaultOpen }: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="hiro-card overflow-hidden">
      <summary className="flex items-center gap-2.5 p-4 cursor-pointer font-semibold text-sm hover:bg-[var(--bg-subtle)] transition-colors">
        {icon}
        {title}
        <ChevronDown size={14} className="ml-auto opacity-40" />
      </summary>
      <div className="p-4 pt-0">{children}</div>
    </details>
  )
}

function Info({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <span className="text-xs text-[var(--text-muted)] block">{label}</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:underline">{value}</a>
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  )
}
