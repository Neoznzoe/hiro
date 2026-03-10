'use client'

export function ScoreBar({ score, label, size = 'sm' }: { score: number; label?: string; size?: 'sm' | 'lg' }) {
  const level = score >= 70 ? 'high' : score >= 50 ? 'mid' : 'low'

  return (
    <div className={size === 'lg' ? 'space-y-1.5' : 'space-y-1'}>
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-muted)]">{label}</span>
          <span className="font-semibold">{score}</span>
        </div>
      )}
      <div className={`score-bar-track ${size === 'lg' ? 'h-2.5' : ''}`}>
        <div
          className="score-bar-fill"
          data-score={level}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  )
}

export function ScoreBig({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? 'var(--chateau-green-300)' : score >= 50 ? 'var(--zest-300)' : 'var(--tall-poppy-400)'

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold" style={{ color }}>{score}</span>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
    </div>
  )
}
