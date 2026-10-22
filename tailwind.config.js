/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--c-bg)',
        panel: 'var(--c-panel)',
        ink: 'var(--c-text)',
        muted: 'var(--c-muted)',
        neon: 'var(--c-cyan)',
        violet: 'var(--c-purple)',
        gold: 'var(--c-gold)',
        jade: 'var(--c-green)',
        line: 'var(--c-border)'
      },
      fontFamily: {
        display: [
          'Inter',
          '-apple-system',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace']
      },
      boxShadow: {
        neon: '0 0 24px rgba(0, 240, 255, 0.35)',
        'neon-lg': '0 0 60px rgba(0, 240, 255, 0.45)'
      },
      backgroundImage: {
        'grid-line':
          'linear-gradient(to right, var(--c-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--c-grid) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
}
