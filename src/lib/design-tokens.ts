/**
 * RAWAJ Design System Tokens
 * Luxury perfumery - minimal, elegant, consistent
 */

export const designTokens = {
  colors: {
    light: {
      background: '#F6EDE6', // Light peach
      surface: '#FFFFFF',
      text: {
        primary: '#1A1A1A', // Near black
        secondary: '#4A4A4A',
        tertiary: '#6B6B6B',
      },
      border: '#E5E5E5',
      accent: {
        primary: '#8B7355', // Muted neutral
        secondary: '#A68B6F',
      },
    },
    dark: {
      background: '#0F172A', // Dark muted blue
      surface: '#1E293B',
      text: {
        primary: '#F8F8F8', // Off white
        secondary: '#D1D5DB',
        tertiary: '#9CA3AF',
      },
      border: '#334155',
      accent: {
        primary: '#8B7355', // Same neutral in dark mode
        secondary: '#A68B6F',
      },
    },
  },
  spacing: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: {
      serif: "'Playfair Display', serif",
      body: "'Cormorant Garamond', serif",
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  transitions: {
    fast: '150ms ease',
    base: '200ms ease',
    slow: '300ms ease',
  },
} as const

export type Theme = 'light' | 'dark'

export function getThemeColors(theme: Theme) {
  return designTokens.colors[theme]
}

