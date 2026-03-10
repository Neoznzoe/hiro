import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
        },
        // Hiro brand colors
        'woodsmoke': {
          '50':  '#f0f0f2',
          '100': '#dadade',
          '200': '#9c9ca7',
          '300': '#82828f',
          '400': '#535363',
          '500': '#3e3e4b',
          '600': '#191920',
          '700': '#09090d',
        },
        'athens-gray': {
          '50':  '#eeeef4',
          '100': '#e7e7ef',
          '200': '#babad3',
          '300': '#a0a0c3',
          '400': '#68689c',
          '500': '#4c4c83',
          '600': '#1b1b36',
          '700': '#0f0f22',
        },
        'alabaster': {
          '50':  '#fafafa',
          '100': '#f3f3f3',
          '200': '#c5c5c5',
          '300': '#aaaaaa',
          '400': '#727272',
          '500': '#555555',
          '600': '#1e1e1e',
          '700': '#111111',
        },
        'blue-ribbon': {
          '50':  '#eff0fe',
          '100': '#d5d5fb',
          '200': '#8789f5',
          '300': '#6366f1',
          '400': '#343bea',
          '500': '#1e26c8',
          '600': '#080c5e',
          '700': '#040642',
        },
        'link-water': {
          '50':  '#f0f0f8',
          '100': '#e0e0f0',
          '200': '#b8b8dd',
          '300': '#9e9ed1',
          '400': '#6565b1',
          '500': '#48489b',
          '600': '#191941',
          '700': '#0d0d2a',
        },
        'tall-poppy': {
          '50':  '#fceded',
          '100': '#f9d6d4',
          '200': '#f38d87',
          '300': '#f1665c',
          '400': '#c0392b',
          '500': '#9d2d21',
          '600': '#400d08',
          '700': '#270503',
        },
        'zest': {
          '50':  '#ffede6',
          '100': '#ffd5c3',
          '200': '#fb8a08',
          '300': '#d97706',
          '400': '#a05603',
          '500': '#7c4102',
          '600': '#321700',
          '700': '#1f0c00',
        },
        'chateau-green': {
          '50':  '#c5ffd0',
          '100': '#28fd77',
          '200': '#1bbe57',
          '300': '#16a34a',
          '400': '#0d7734',
          '500': '#085c27',
          '600': '#01240b',
          '700': '#011505',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        'hiro-sm': '0 1px 3px 0 rgba(9,9,13,0.08), 0 1px 2px -1px rgba(9,9,13,0.06)',
        'hiro-md': '0 4px 6px -1px rgba(9,9,13,0.10), 0 2px 4px -2px rgba(9,9,13,0.08)',
        'hiro-lg': '0 10px 15px -3px rgba(9,9,13,0.12), 0 4px 6px -4px rgba(9,9,13,0.08)',
        'hiro-xl': '0 20px 25px -5px rgba(9,9,13,0.14), 0 8px 10px -6px rgba(9,9,13,0.10)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
