// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {

        // ─── Neutrals ────────────────────────────────────────
        // Dark surfaces, backgrounds, text on light
        'woodsmoke': {
          '50':  '#f0f0f2',
          '100': '#dadade',
          '200': '#9c9ca7',
          '300': '#82828f',
          '400': '#535363',
          '500': '#3e3e4b',
          '600': '#191920',
          '700': '#09090d', // = hiro dark bg, logo bg
        },

        // Light surfaces, backgrounds, text on dark
        'athens-gray': {
          '50':  '#eeeef4', // = hiro light bg, logo bg
          '100': '#e7e7ef',
          '200': '#babad3',
          '300': '#a0a0c3',
          '400': '#68689c',
          '500': '#4c4c83',
          '600': '#1b1b36',
          '700': '#0f0f22',
        },

        // Pure white surfaces, cards en light mode
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

        // ─── Brand accent ─────────────────────────────────────
        // Indigo — CTA, liens, barre droite du logo
        'blue-ribbon': {
          '50':  '#eff0fe',
          '100': '#d5d5fb',
          '200': '#8789f5',
          '300': '#6366f1', // = hiro accent principal
          '400': '#343bea',
          '500': '#1e26c8',
          '600': '#080c5e',
          '700': '#040642',
        },

        // Bleu-violet secondaire — surfaces accent muted, borders
        'link-water': {
          '50':  '#f0f0f8',
          '100': '#e0e0f0', // = hiro mark on dark
          '200': '#b8b8dd',
          '300': '#9e9ed1',
          '400': '#6565b1',
          '500': '#48489b',
          '600': '#191941',
          '700': '#0d0d2a',
        },

        // ─── Semantic ─────────────────────────────────────────
        // Rouge — rejet, red flag, relance en retard
        'tall-poppy': {
          '50':  '#fceded',
          '100': '#f9d6d4',
          '200': '#f38d87',
          '300': '#f1665c',
          '400': '#c0392b', // base rouge
          '500': '#9d2d21',
          '600': '#400d08',
          '700': '#270503',
        },

        // Amber — relance bientôt, red flag moyen, score intermédiaire
        'zest': {
          '50':  '#ffede6',
          '100': '#ffd5c3',
          '200': '#fb8a08',
          '300': '#d97706', // base amber
          '400': '#a05603',
          '500': '#7c4102',
          '600': '#321700',
          '700': '#1f0c00',
        },

        // Vert — offre reçue, entretien, score élevé, ok
        'chateau-green': {
          '50':  '#c5ffd0',
          '100': '#28fd77',
          '200': '#1bbe57',
          '300': '#16a34a', // base vert
          '400': '#0d7734',
          '500': '#085c27',
          '600': '#01240b',
          '700': '#011505',
        },

      },

      // ─── Semantic aliases (usage dans le code) ──────────────
      // Utiliser ces tokens plutôt que les couleurs brutes
      // Ex: bg-surface, text-muted, border-default...

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        DEFAULT: '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
      },

      boxShadow: {
        'hiro-sm': '0 1px 3px 0 rgba(9,9,13,0.08), 0 1px 2px -1px rgba(9,9,13,0.06)',
        'hiro-md': '0 4px 6px -1px rgba(9,9,13,0.10), 0 2px 4px -2px rgba(9,9,13,0.08)',
        'hiro-lg': '0 10px 15px -3px rgba(9,9,13,0.12), 0 4px 6px -4px rgba(9,9,13,0.08)',
        'hiro-xl': '0 20px 25px -5px rgba(9,9,13,0.14), 0 8px 10px -6px rgba(9,9,13,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
