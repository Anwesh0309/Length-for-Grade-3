/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        teal: {
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        coral: {
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
        },
        purple: {
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
        },
        cream: '#FDF8F0',
        warmGray: '#F5F0E8',
        darkBg: '#1A1A2E',
        inkDark: '#1F2937',
        inkMid: '#4B5563',
        inkLight: '#9CA3AF',
      },
      fontFamily: {
        display: ['Nunito', 'Poppins', 'sans-serif'],
        body: ['Poppins', 'Nunito', 'sans-serif'],
      },
      fontSize: {
        'xs': ['13px', '1.5'],
        'sm': ['15px', '1.6'],
        'base': ['18px', '1.7'],
        'lg': ['20px', '1.6'],
        'xl': ['24px', '1.4'],
        '2xl': ['30px', '1.3'],
        '3xl': ['38px', '1.2'],
        '4xl': ['48px', '1.1'],
      },
      borderRadius: {
        'bubble': '1.5rem',
        'card': '1rem',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'float': '0 8px 40px rgba(0,0,0,0.12)',
        'glow': '0 0 24px rgba(245,158,11,0.4)',
        'glow-teal': '0 0 24px rgba(20,184,166,0.4)',
        'glow-purple': '0 0 24px rgba(168,85,247,0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'confetti': 'confettiFall 2.5s ease-in forwards',
        'slide-in': 'slideIn 0.4s ease-out',
        'star-burst': 'starBurst 0.6s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 32px rgba(245,158,11,0.7)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.3) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
