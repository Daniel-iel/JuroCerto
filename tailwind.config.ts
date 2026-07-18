import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Tech Performance Colors
        'background-deep': 'var(--color-background-deep)',
        'background-base': 'var(--color-background-base)',
        'surface-base': 'var(--color-surface-base)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'surface-card': 'var(--color-surface-card)',
        
        primary: 'var(--color-primary)',
        'primary-bright': 'var(--color-primary-bright)',
        'on-primary': 'var(--color-on-primary)',
        
        secondary: 'var(--color-secondary)',
        'secondary-bright': 'var(--color-secondary-bright)',
        'secondary-light': 'var(--color-secondary-light)',
        'on-secondary': 'var(--color-on-secondary)',
        
        tertiary: 'var(--color-tertiary)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'on-dark': 'var(--color-on-dark)',
        
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        
        // Legacy support
        'brand-primary': 'var(--color-brand-primary)',
        'brand-secondary': 'var(--color-brand-secondary)',
        
        brand: {
          primary: 'var(--color-brand-primary)',
          'on-primary': 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton-loading': 'skeletonLoading 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        skeletonLoading: {
          '0%, 100%': { backgroundColor: 'rgba(226, 232, 240, 0.4)' },
          '50%': { backgroundColor: 'rgba(226, 232, 240, 0.2)' },
        },
      },
      spacing: {
        safe: 'max(env(safe-area-inset-bottom), 1rem)',
      },
      fontSize: {
        'xs-mobile': ['11px', { lineHeight: '16px' }],
        'sm-mobile': ['13px', { lineHeight: '18px' }],
      },
    },
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
} satisfies Config;
