/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          hover: '#1E293B',
          accent: '#3B82F6',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          text: '#F9FAFB',
          subtext: '#9CA3AF'
        },
        emergency: {
          red: '#DC2626',
          amber: '#D97706',
          green: '#059669',
          blue: '#2563EB',
          highDark: '#000000',
          highLight: '#FFFFFF',
          highYellow: '#FFE600'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-danger': 'glowDanger 2s ease-in-out infinite',
      },
      keyframes: {
        glowDanger: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
