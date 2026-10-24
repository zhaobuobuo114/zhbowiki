/* 为每个路由生成真实静态入口
   用法：node scripts/gen-pages.mjs <outDir>
   - plugins/index.html          → /plugins 直接返回 200
   - plugins/<slug>/index.html   → 详情页直接返回 200
   - 404.html                    → 未知路径仍可启动 SPA
   - .nojekyll                   → 跳过 Jekyll */
import fs from 'node:fs'
import path from 'node:path'
import { STATIC_ROUTES } from '../src/siteMap.js'

const outDir = process.argv[2] || 'docs'
const indexPath = path.join(outDir, 'index.html')

if (!fs.existsSync(indexPath)) {
  console.error(`[pages] 找不到 ${indexPath}，请先执行 vite build`)
  process.exit(1)
}

const html = fs.readFileSync(indexPath, 'utf8')

for (const route of STATIC_ROUTES) {
  const dir = path.join(outDir, route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

fs.copyFileSync(indexPath, path.join(outDir, '404.html'))
fs.writeFileSync(path.join(outDir, '.nojekyll'), '')

console.log(
  `[pages] ${STATIC_ROUTES.length} 个路由入口 + 404.html + .nojekyll → ${outDir}`
)
