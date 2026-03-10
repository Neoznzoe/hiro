// types/index.ts

export type ApplicationSource = 'indeed' | 'linkedin' | 'wttj' | 'spontaneous' | 'other'
export type ApplicationStatus = 'to_apply' | 'applied' | 'followup' | 'interview' | 'offer' | 'rejected' | 'archived'

export interface Application {
  id: string
  companyName: string
  position: string
  source: ApplicationSource
  offerUrl?: string
  status: ApplicationStatus
  appliedAt?: Date
  nextFollowupAt?: Date
  followupDelayDays: number
  contactName?: string
  contactEmail?: string
  salaryRange?: string
  notes?: string
  analysisData?: AnalysisResult
  createdAt: Date
  updatedAt: Date
}

// ─── Résultat complet de l'analyse Claude ────────────────────────────────────

export interface AnalysisResult {
  offer: OfferAnalysis
  company: CompanyAnalysis
  interview: InterviewIntel
  cv: CVAdaptation
  score: GlobalScore
}

export interface OfferAnalysis {
  title: string
  companyName: string
  location: string
  contractType: string
  salaryRange?: string
  stack: string[]
  hardSkills: string[]
  softSkills: string[]
  managementStyle: string
  companyTone: 'startup' | 'scaleup' | 'corporate' | 'pme' | 'public'
  redFlags: RedFlag[]
  qualityScore: number // 0-100
  summary: string
}

export interface RedFlag {
  severity: 'low' | 'medium' | 'high'
  label: string
  explanation: string
}

export interface CompanyAnalysis {
  name: string
  website?: string
  size?: string
  foundedYear?: number
  sector: string
  recentNews: NewsItem[]
  healthScore: number // 0-100
  glassdoorRating?: number
  warnings: string[]
  summary: string
}

export interface NewsItem {
  title: string
  date?: string
  type: 'funding' | 'layoff' | 'acquisition' | 'launch' | 'award' | 'other'
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface InterviewIntel {
  questionsToAsk: InterviewQuestion[]
  questionsToExpect: InterviewQuestion[]
  starSuggestions: STARSuggestion[]
  strengthsToHighlight: string[]
  blindspotsToPrep: string[]
}

export interface InterviewQuestion {
  question: string
  why: string // Pourquoi cette question est pertinente
  category: 'culture' | 'technical' | 'product' | 'team' | 'growth' | 'process'
}

export interface STARSuggestion {
  question: string
  situation: string
  task: string
  action: string
  result: string
}

export interface CVAdaptation {
  keywordsToAdd: string[]
  sectionsToRework: SectionRework[]
  overallMatch: number // 0-100
}

export interface SectionRework {
  section: string // Ex: "Expérience - Glénat"
  current?: string
  suggested: string
  reason: string
}

export interface GlobalScore {
  overall: number // 0-100
  relevance: number
  legitimacy: number
  attractiveness: number
  recommendation: 'apply' | 'apply_with_caution' | 'skip'
  recommendationReason: string
}
