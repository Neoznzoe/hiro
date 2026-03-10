'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number // 0-100
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBar({ score, label, size = 'sm' }: ScoreBarProps) {
  const scoreLevel = score < 50 ? 'low' : score < 70 ? 'mid' : 'high'
  const colorClass = scoreLevel === 'high'
    ? '[&>div]:bg-chateau-green-300'
    : scoreLevel === 'mid'
      ? '[&>div]:bg-zest-300'
      : '[&>div]:bg-tall-poppy-400'

  return (
    <div className={size === 'lg' ? 'space-y-1.5' : 'space-y-1'}>
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold text-foreground">{score}</span>
        </div>
      )}
      <Progress
        value={Math.min(100, Math.max(0, score))}
        className={cn(
          size === 'lg' ? 'h-2.5' : 'h-1.5',
          colorClass
        )}
      />
    </div>
  )
}

interface ScoreBigProps {
  score: number // 0-100
  label: string
}

export function ScoreBig({ score, label }: ScoreBigProps) {
  const scoreLevel = score < 50 ? 'low' : score < 70 ? 'mid' : 'high'
  const colorClass = scoreLevel === 'high'
    ? 'text-chateau-green-300'
    : scoreLevel === 'mid'
      ? 'text-zest-300'
      : 'text-tall-poppy-400'
  const bgClass = scoreLevel === 'high'
    ? 'bg-chateau-green-50'
    : scoreLevel === 'mid'
      ? 'bg-zest-50'
      : 'bg-tall-poppy-50'

  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl p-4 min-w-[80px]', bgClass)}>
      <span className={cn('text-3xl font-bold', colorClass)}>{score}</span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )
}
