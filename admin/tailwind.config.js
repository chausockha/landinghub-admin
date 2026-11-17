/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* ── Semantic Design Tokens (Single-Point Theme Control) ── */
        canvas:   'rgb(var(--canvas) / <alpha-value>)',
        surface:  'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        line:     'rgb(var(--line) / <alpha-value>)',
        ink: {
          DEFAULT:   'rgb(var(--ink) / <alpha-value>)',
          secondary: 'rgb(var(--ink-secondary) / <alpha-value>)',
          muted:     'rgb(var(--ink-muted) / <alpha-value>)',
        },
        brand: {
          DEFAULT:   'rgb(var(--brand) / <alpha-value>)',
          strong:    'rgb(var(--brand-strong) / <alpha-value>)',
          secondary: 'rgb(var(--brand-secondary) / <alpha-value>)',
          fg:        'rgb(var(--brand-fg) / <alpha-value>)',
        },

        /* Shadcn/Radix compatibility bridge */
        border:      'rgb(var(--line) / <alpha-value>)',
        input:       'rgb(var(--line) / <alpha-value>)',
        ring:        'rgb(var(--brand) / <alpha-value>)',
        background:  'rgb(var(--canvas) / <alpha-value>)',
        foreground:  'rgb(var(--ink) / <alpha-value>)',
        primary:     { DEFAULT: 'rgb(var(--brand) / <alpha-value>)', foreground: 'rgb(var(--brand-fg) / <alpha-value>)' },
        secondary:   { DEFAULT: 'rgb(var(--brand-secondary) / <alpha-value>)', foreground: 'rgb(var(--brand-fg) / <alpha-value>)' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted:       { DEFAULT: 'rgb(var(--surface-elevated) / <alpha-value>)', foreground: 'rgb(var(--ink-muted) / <alpha-value>)' },
        accent:      { DEFAULT: 'rgb(var(--brand) / <alpha-value>)', foreground: 'rgb(var(--brand-fg) / <alpha-value>)' },
        popover:     { DEFAULT: 'rgb(var(--surface-elevated) / <alpha-value>)', foreground: 'rgb(var(--ink) / <alpha-value>)' },
        card:        { DEFAULT: 'rgb(var(--surface) / <alpha-value>)', foreground: 'rgb(var(--ink) / <alpha-value>)' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '68': '17rem',
      },
    },
  },
  plugins: [],
}
