// components/ui/HiroLogo.tsx
// Composant logo Hiro — utilise les SVGs de la charte graphique

interface HiroLogoProps {
  variant?: 'dark' | 'light' | 'transparent-dark' | 'transparent-light'
  size?: number
  className?: string
}

// Inline SVG pour éviter les imports next/image inutiles
const paths = {
  left: {
    dark: '#E0E0F0',
    light: '#0C0C14',
    'transparent-dark': '#E0E0F0',
    'transparent-light': '#0C0C14',
  },
  arc: {
    dark: '#E0E0F0',
    light: '#0C0C14',
    'transparent-dark': '#E0E0F0',
    'transparent-light': '#0C0C14',
  },
  accent: '#6366F1',
  bg: {
    dark: '#09090D',
    light: '#EEEEF4',
    'transparent-dark': 'transparent',
    'transparent-light': 'transparent',
  }
}

export function HiroLogo({ variant = 'dark', size = 40, className }: HiroLogoProps) {
  const bg = paths.bg[variant]
  const mark = paths.left[variant]
  const hasBackground = variant === 'dark' || variant === 'light'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {hasBackground && (
        <path
          d={variant === 'dark'
            ? "M120 0H40C17.9086 0 0 17.9086 0 40V120C0 142.091 17.9086 160 40 160H120C142.091 160 160 142.091 160 120V40C160 17.9086 142.091 0 120 0Z"
            : "M120 0H40C17.9086 0 0 17.9086 0 40V120C0 142.091 17.9086 160 40 160H120C142.091 160 160 142.091 160 120V40C160 17.9086 142.091 0 120 0Z"
          }
          fill={bg}
        />
      )}
      {/* Barre gauche du H */}
      <path
        d="M64.3333 39.6667C64.3333 33.7756 59.5577 29 53.6667 29C47.7756 29 43 33.7756 43 39.6667V119.667C43 125.558 47.7756 130.333 53.6667 130.333C59.5577 130.333 64.3333 125.558 64.3333 119.667V39.6667Z"
        fill={mark}
      />
      {/* Arc du H */}
      <path
        d="M64.3335 79.6667C64.3335 50.3334 107 50.3334 107 79.6667"
        stroke={mark}
        strokeWidth="21.3333"
        strokeLinecap="round"
      />
      {/* Barre droite accent indigo */}
      <path
        d="M117.667 90.3334C117.667 84.4424 112.891 79.6667 107 79.6667C101.109 79.6667 96.3335 84.4424 96.3335 90.3334V119.667C96.3335 125.558 101.109 130.333 107 130.333C112.891 130.333 117.667 125.558 117.667 119.667V90.3334Z"
        fill={paths.accent}
      />
    </svg>
  )
}

// Wordmark complet "hiro" avec logo
export function HiroWordmark({ variant = 'dark', size = 32, className }: HiroLogoProps) {
  const textColor = variant === 'dark' || variant === 'transparent-dark' ? '#E0E0F0' : '#09090D'

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <HiroLogo variant={variant} size={size} />
      <span
        style={{
          fontSize: size * 0.6,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: textColor,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        hiro
      </span>
    </div>
  )
}
