/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: '#0A0F1C',
          surface: '#121A2B',
          accent: '#00D4FF',
          purple: '#7C3AED',
          text: '#E5E7EB',
          muted: '#9CA3AF',
          border: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
