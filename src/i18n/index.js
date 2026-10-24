export const dict = {
  zh: {
    brand: 'ZHBOWiki',
    landing: {
      sub: 'Minecraft 服务端插件文档站。用心做好每一个插件，每一次服务。',
      cta: '开始探索'
    },
    nav: { contact: '联系我们', publish: '发布' },
    theme: { dark: '暗色', light: '亮色' },
    status: { stable: '稳定版', beta: '测试版' },
    plugins: {
      title: '插件仓库',
      search: '搜索插件、玩法或标签',
      filter: '筛选',
      server: '服务端',
      tags: '标签',
      sort: '排序',
      all: '全部',
      sortUpdated: '最近更新',
      sortDownloads: '下载最多',
      reset: '重置筛选',
      index: '插件名',
      count: '个插件',
      download: '下载',
      viewDetail: '查看详情',
      empty: '没有匹配的插件',
      emptyHint: '换个关键词，或清空筛选条件试试。'
    },
    detail: {
      back: '返回插件仓库',
      features: '功能特性',
      install: '安装步骤',
      commands: '指令',
      config: '配置示例',
      author: '作者',
      repo: 'GitHub 仓库',
      notFound: '插件不存在',
      notFoundHint: '该插件可能已下线，或链接有误。',
      backToList: '回到插件仓库',
      command: '指令',
      description: '说明',
      permission: '权限'
    }
  },
  en: {
    brand: 'ZHBOWiki',
    landing: {
      sub: 'Documentation for Minecraft server plugins. Every plugin, every service — done with care.',
      cta: 'Get Started'
    },
    nav: { contact: 'Contact', publish: 'Publish' },
    theme: { dark: 'Dark', light: 'Light' },
    status: { stable: 'Stable', beta: 'Beta' },
    plugins: {
      title: 'Plugin Library',
      search: 'Search plugins or tags',
      filter: 'Filter',
      server: 'Server',
      tags: 'Tags',
      sort: 'Sort',
      all: 'All',
      sortUpdated: 'Recently updated',
      sortDownloads: 'Most downloaded',
      reset: 'Reset filters',
      index: 'Plugins',
      count: 'plugins',
      download: 'Download',
      viewDetail: 'Details',
      empty: 'No plugins match',
      emptyHint: 'Try another keyword, or clear the filters.'
    },
    detail: {
      back: 'Back to library',
      features: 'Features',
      install: 'Installation',
      commands: 'Commands',
      config: 'Config example',
      author: 'Author',
      repo: 'GitHub repository',
      notFound: 'Plugin not found',
      notFoundHint: 'This plugin may be retired or the link is wrong.',
      backToList: 'Back to library',
      command: 'Command',
      description: 'Description',
      permission: 'Permission'
    }
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
