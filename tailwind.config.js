/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#08080C',
          card: 'rgba(18, 18, 24, 0.85)',
          border: '#2A2A36',
          borderGlow: '#00F0FF33',
          cyan: '#00F0FF',
          magenta: '#FF007F',
          orange: '#FF6B00',
          green: '#00FF66',
          red: '#FF3B30',
          muted: '#8E8EA0',
          steel: '#525266'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
        'rain': 'rain 1.2s linear infinite',
        'equalizer': 'equalizer 0.8s infinite ease-in-out alternate'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.9, filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: 0.5, filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.2))' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        rain: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '20px 100px' }
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
