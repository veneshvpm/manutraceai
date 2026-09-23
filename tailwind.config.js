/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bankdash: {
          bg: '#F5F7FA',        // Soft off-white main background
          card: '#FFFFFF',      // Pure white card background
          dark: '#343C6A',      // Primary heading / dark text
          darker: '#232323',
          muted: '#718EBF',     // Secondary slate text / inactive icons
          subtle: '#8BA3CB',    // Placeholder / subtle labels
          border: '#E6EFF5',    // Soft border divider
          hover: '#F4F7FE',     // Active / hover background tint
          blue: '#2D60FF',      // BankDash primary royal blue
          cyan: '#16DBCC',      // BankDash turquoise / cyan
          pink: '#FF82AC',      // BankDash magenta / pink
          yellow: '#FFBB38',    // BankDash soft amber / yellow
          orange: '#FEAA09',
          red: '#FE5C73',       // BankDash coral red
          green: '#10B981',     // Soft emerald
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#2D60FF',
          600: '#1849D6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'bankdash': '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
        'bankdash-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.08)',
        'bankdash-card': '0 4px 25px 0 rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
