import { plugins } from './data/plugins.js'

/* 需要生成真实静态入口的路由
   每个路由会在构建产物里得到一个独立的 index.html，
   直接访问时返回 200，不再依赖 404 回退。
   新增顶级页面时在这里登记；新增插件会自动生成详情页入口。 */
export const STATIC_ROUTES = [
  'plugins',
  ...plugins.map((p) => `plugins/${p.slug}`)
]
