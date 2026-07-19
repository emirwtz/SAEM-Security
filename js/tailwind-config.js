tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0A0A14', panel: '#131322', line: '#242238' },
        paper:  { DEFAULT: '#F5F3FB', panel: '#FFFFFF', line: '#E3DFF3' },
        brand:  { 500: '#6C5CE7', 400: '#8B7CF5', 300: '#B7ACF9' },
        accent: { 400: '#C77DFF', 300: '#E0B8FF' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        displayAr: ['"Noto Kufi Arabic"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        bodyAr: ['"Noto Kufi Arabic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(108,92,231,0.55)',
      }
    }
  }
};