/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F7F2',
        forest: {
          50: '#F0F6F3',
          100: '#DFEDE6',
          200: '#C0DBCF',
          300: '#95C2AF',
          400: '#5EA286',
          500: '#3D8569',
          600: '#2B6B53',
          700: '#225542',
          800: '#174B38', // Brand Primary
          900: '#133E2F',
          950: '#0A231A',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6ECE7',
          200: '#D1DDD3',
          300: '#B2C6B6',
          400: '#8FA995',
          500: '#6E8B75',
          600: '#55705C',
          700: '#435848',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#333734',
          900: '#1A1D1A', // Dark Charcoal Typography
        },
        cream: {
          50: '#FAF6EE',
          100: '#F4ECE0',
          200: '#ECE2D0',
        },
        teal: {
          950: '#073746',
          900: '#0C2B35',
          850: '#103744',
          800: '#144555',
        },
        navy: {
          950: '#0B1D33',
          900: '#11253E',
          800: '#1B3556',
        },
        coral: {
          50: '#FFF2F0',
          100: '#FFE5E0',
          400: '#FF7D6D',
          500: '#FF624F',
          600: '#EB4F3C',
        },
        peach: {
          50: '#FFF8F4',
          100: '#FFE5D4',
          200: '#FED4BD',
          300: '#F8B693',
        },
      },
      borderRadius: {
        'fintech': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        card: '0 4px 12px 0 rgba(23, 75, 56, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        elevated: '0 10px 25px -3px rgba(23, 75, 56, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
