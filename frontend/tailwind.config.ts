import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // DRC Flag colors: Sky Blue, Yellow, Red
        'drc-blue': '#007FFF',
        'drc-blue-light': '#3399FF',
        'drc-blue-dark': '#0055CC',
        'drc-yellow': '#FCD116',
        'drc-yellow-dark': '#E6B800',
        'drc-red': '#CE1126',
        // Keep green aliases pointing to blue for backward compat
        'drc-green': '#007FFF',
        'drc-green-light': '#3399FF',
        'drc-green-dark': '#0055CC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(11,18,32,0.04), 0 1px 1px rgba(11,18,32,0.03)',
        soft: '0 4px 12px -2px rgba(11,18,32,0.08), 0 2px 6px -2px rgba(11,18,32,0.05)',
        'soft-lg': '0 12px 28px -6px rgba(11,18,32,0.12), 0 6px 12px -6px rgba(11,18,32,0.08)',
        'soft-xl': '0 24px 48px -12px rgba(11,18,32,0.18), 0 12px 24px -12px rgba(11,18,32,0.10)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-drc': 'linear-gradient(135deg, #007FFF 0%, #0055CC 50%, #003399 100%)',
        // Actual DRC flag: sky blue bg with red diagonal stripe bordered by yellow
        'gradient-flag': 'linear-gradient(90deg, #007FFF 33%, #FCD116 33%, #FCD116 66%, #CE1126 66%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-slow': 'pulse 3s infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
