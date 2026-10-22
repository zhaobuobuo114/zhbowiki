export const dict = {
  zh: {
    brand: 'ZHBOWiki',
    landing: {
      sub: 'Minecraft 服务端插件文档站。用心做好每一个插件，每一次服务。',
      cta: '开始探索'
    },
    theme: { dark: '暗色', light: '亮色' }
  },
  en: {
    brand: 'ZHBOWiki',
    landing: {
      sub: 'Documentation for Minecraft server plugins. Every plugin, every service — done with care.',
      cta: 'Get Started'
    },
    theme: { dark: 'Dark', light: 'Light' }
  }
}

const fallback = 'zh'

export function makeT(lang) {
  return (key) => {
    const walk = (obj, parts) =>
      parts.reduce((acc, p) => (acc == null ? acc : acc[p]), obj)
    const value = walk(dict[lang] || dict[fallback], key.split('.'))
    if (value !== undefined) return value
    return walk(dict[fallback], key.split('.')) ?? key
  }
}

export function pick(value, lang) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[lang] || value[fallback] || value.en || ''
}
