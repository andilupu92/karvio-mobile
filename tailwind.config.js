/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx,mdx}',
    './src/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        icons: {
          100: '#1A1A1A', // Light mode primary icon color
          200: '#888888', // Light mode secondary icon color
          800: '#AAAAAA', // Dark mode secondary icon color
          900: '#FFFFFF', // Dark mode primary icon color
        },
        error: {
          0: '#fee2e2', 
          50: '#E53E3E',
        },
        success: {
          0: '#dcfce7',
          50: '#3cba70',
        },
        warning: {
          0: '#fef3c7',
          50: '#F59E0B',
        },
        info: {
          50: 'rgb(var(--color-info-50)/<alpha-value>)',
        },
        typography: {
          100: '#1A1A1A', // Light mode primary typography color
          200: '#888888', // Light mode secondary typography color
          800: '#AAAAAA', // Dark mode secondary typography color 
          900: '#FFFFFF', // Dark mode primary typography color
        },
        outline: {
          50: '#ffffff',
          100: '#e0e0e0',  // Light mode outline color
          900: '#2C2C2C',  // Dark mode outline color
        },
        background: {
          primary: {
            100: '#F2F2F7', // Light mode background color
            900: '#0D0D0D', // Dark mode background color
          },
          card: {
            100: '#FFFFFF', // Light mode card background color
            200: '#f8f8f8', // Light mode inactive card background color
            800: '#131313', // Dark mode inactive card background color
            900: '#1E1E1E', // Dark mode card background color
          },
          icon: {
            100: '#F0F0F0', // Light mode icon background color
            900: '#2C2C2C', // Dark mode icon background color
          },
          chart: {
              100: '#572564', // Light mode chart background color selected
              200: '#d9b8e0', // Light mode chart background color unselected
              300: '#D0DCE8', // Light mode chart background color selected background
              400: '#E2EAF0', // Light mode chart background color unselected background
          }
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
};
