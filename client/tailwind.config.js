/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#07090e',
          900: '#0d1117',
          850: '#131822',
          800: '#1a2230',
          700: '#253245',
          600: '#34455e',
          500: '#485e7e',
          400: '#6882a8',
          300: '#9cb1ce',
          200: '#cbd7e8',
          100: '#e7eef7',
          50: '#f4f8fc',
        },
        coach: {
          accent: '#38bdf8', // calm sky blue
          warm: '#f59e0b',   // understated amber
          calm: '#10b981',   // gentle emerald
          purple: '#a855f7', // thoughtful violet
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
