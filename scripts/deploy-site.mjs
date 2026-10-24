/* 把 dist-site 部署到用户站点仓库（根域名）
   用法：
   $env:GH_TOKEN = "你的 token"; npm run deploy:site
   可选：$env:GH_REPO = "owner/repo"（默认 zhaobuobuo114/zhaobuobuo114.github.io）
   token 只用于本次 push 的 URL，不会写入 .git/config 或仓库文件 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const token = process.env.GH_TOKEN
const repo = process.env.GH_REPO || 'zhaobuobuo114/zhaobuobuo114.github.io'
const dir = path.resolve('dist-site')

if (!token) {
  console.error('[deploy] 缺少 GH_TOKEN 环境变量')
  process.exit(1)
}

if (!fs.existsSync(path.join(dir, 'index.html'))) {
  console.error('[deploy] dist-site 不存在，请先运行 npm run build:site')
  process.exit(1)
}

const run = (args) =>
  execFileSync('git', args, {
    cwd: dir,
    stdio: 'inherit',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
  })

if (!fs.existsSync(path.join(dir, '.git'))) {
  run(['init', '-b', 'main'])
  run(['config', 'user.email', 'deploy@zhbowiki.local'])
  run(['config', 'user.name', 'ZHBOWiki Deploy'])
  run(['config', 'http.sslBackend', 'schannel'])
}

run(['add', '-A'])

try {
  run(['commit', '-m', `deploy ${new Date().toISOString()}`])
} catch {
  console.log('[deploy] 没有新变更，继续推送')
}

run([
  'push',
  '--force',
  `https://x-access-token:${token}@github.com/${repo}.git`,
  'main:main'
])

console.log(`[deploy] 已推送到 https://github.com/${repo}`)
console.log('[deploy] 站点：https://zhaobuobuo114.github.io/')
