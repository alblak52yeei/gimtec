/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основные цвета из дизайна
        primary: {
          50: '#F5F8FA',
          100: '#E6F0F7', 
          500: '#0078D2',
          600: '#004269',
          700: '#00395C',
          800: '#002033'
        },
        secondary: {
          100: '#F5F0B7',
          500: '#189F0B'
        },
        gray: {
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#7C828A',
          700: '#495057',
          800: '#343A40',
          900: '#212529'
        },
        // Цвета для графиков
        chart: {
          red: '#EC6666',
          blue: '#147AD6',
          cyan: '#79D2DE'
        }
      },
      fontSize: {
        'xs': ['10px', '13px'],
        'sm': ['12px', '18px'],
        'base': ['14px', '21px'],
        'lg': ['16px', '22px'],
        'xl': ['18px', '27px'],
        '2xl': ['22px', '30px']
      },
      borderRadius: {
        'DEFAULT': '4px',
        'lg': '12px',
        'full': '32px'
      },
      spacing: {
        '18': '72px',
        '88': '352px',
        '169': '675px'
      }
    },
  },
  plugins: [],
} 