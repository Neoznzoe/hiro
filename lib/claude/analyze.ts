// lib/claude/analyze.ts
// Orchestration de l'analyse complète via Claude API

import Anthropic from '@anthropic-ai/sdk'
import type { AnalysisResult } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analyzeOffer(
  offerContent: string,
  companyContent: string,
  userCv?: string
): Promise<AnalysisResult> {
  const systemPrompt = `Tu es un expert en recrutement et stratégie de carrière, spécialisé dans le marché français du travail.
Tu analyses des offres d'emploi et fournis des insights actionnables pour maximiser les chances du candidat.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après.`

  const userPrompt = buildAnalysisPrompt(offerContent, companyContent, userCv)

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    return JSON.parse(text) as AnalysisResult
  } catch {
    throw new Error(`Impossible de parser la réponse Claude: ${text.slice(0, 200)}`)
  }
}

function buildAnalysisPrompt(offer: string, company: string, cv?: string): string {
  return `Analyse cette offre d'emploi et fournis un JSON complet selon le schéma suivant.

---
OFFRE D'EMPLOI :
${offer}

---
INFORMATIONS SUR LA BOÎTE :
${company}

${cv ? `---\nCV DU CANDIDAT :\n${cv}\n` : ''}

---
Retourne un JSON avec EXACTEMENT cette structure :

{
  "offer": {
    "title": "Intitulé exact du poste",
    "companyName": "Nom de la boîte",
    "location": "Ville / Remote / Hybride",
    "contractType": "CDI | CDD | Freelance | Alternance | Stage",
    "salaryRange": "ex: 42-50k€ ou null",
    "stack": ["tech1", "tech2"],
    "hardSkills": ["skill1", "skill2"],
    "softSkills": ["skill1", "skill2"],
    "managementStyle": "Description courte du style de management implicite",
    "companyTone": "startup | scaleup | corporate | pme | public",
    "redFlags": [
      {
        "severity": "low | medium | high",
        "label": "Titre court du red flag",
        "explanation": "Explication en 1-2 phrases"
      }
    ],
    "qualityScore": 0-100,
    "summary": "Résumé de l'offre en 2-3 phrases"
  },
  "company": {
    "name": "Nom",
    "website": "URL ou null",
    "size": "ex: 50-200 employés",
    "foundedYear": 2015,
    "sector": "Secteur d'activité",
    "recentNews": [
      {
        "title": "Titre de l'actu",
        "date": "YYYY-MM ou null",
        "type": "funding | layoff | acquisition | launch | award | other",
        "sentiment": "positive | neutral | negative"
      }
    ],
    "healthScore": 0-100,
    "glassdoorRating": 4.2,
    "warnings": ["warning1", "warning2"],
    "summary": "Résumé de la boîte en 2-3 phrases"
  },
  "interview": {
    "questionsToAsk": [
      {
        "question": "Question à poser au recruteur",
        "why": "Pourquoi cette question est stratégique",
        "category": "culture | technical | product | team | growth | process"
      }
    ],
    "questionsToExpect": [
      {
        "question": "Question probable en entretien",
        "why": "Pourquoi ils vont poser ça",
        "category": "culture | technical | product | team | growth | process"
      }
    ],
    "starSuggestions": [
      {
        "question": "Question d'entretien comportemental",
        "situation": "Contexte suggéré",
        "task": "Mission à expliquer",
        "action": "Actions clés à mentionner",
        "result": "Résultat mesurable à mettre en avant"
      }
    ],
    "strengthsToHighlight": ["Point fort 1 à mentionner"],
    "blindspotsToPrep": ["Angle mort 1 à préparer"]
  },
  "cv": {
    "keywordsToAdd": ["mot-clé1", "mot-clé2"],
    "sectionsToRework": [
      {
        "section": "Nom de la section du CV",
        "current": "Formulation actuelle si connue",
        "suggested": "Nouvelle formulation suggérée",
        "reason": "Pourquoi ce changement"
      }
    ],
    "overallMatch": 0-100
  },
  "score": {
    "overall": 0-100,
    "relevance": 0-100,
    "legitimacy": 0-100,
    "attractiveness": 0-100,
    "recommendation": "apply | apply_with_caution | skip",
    "recommendationReason": "Explication de la recommandation en 1-2 phrases"
  }
}

Sois précis, pragmatique, et orienté résultat. Si une information manque, indique null, ne l'invente pas.`
}

// ─── Template de relance ──────────────────────────────────────────────────────

export async function generateFollowupEmail(params: {
  companyName: string
  position: string
  appliedAt: Date
  contactName?: string
  userCv?: string
  notes?: string
}): Promise<{ subject: string; body: string }> {
  const daysSince = Math.floor((Date.now() - params.appliedAt.getTime()) / 86400000)

  const prompt = `Tu es un candidat qui relance sa candidature de façon professionnelle et naturelle.

Boîte : ${params.companyName}
Poste : ${params.position}
Candidature envoyée il y a : ${daysSince} jours
${params.contactName ? `Contact : ${params.contactName}` : ''}
${params.notes ? `Notes contextuelles : ${params.notes}` : ''}

Génère un email de relance professionnel, bref (3-4 phrases max), naturel, pas trop formel.
Évite les formules banales comme "Je me permets de revenir vers vous".
Réponds UNIQUEMENT en JSON : { "subject": "...", "body": "..." }`

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text)
}
