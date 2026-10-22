import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  /* GitHub Pages 项目站点用 `npm run build:pages`（--base=/zhbowiki/ 输出到 docs/）；
     本地 `npm run build` 仍是根路径，预览不受影响 */
  server: { port: 5199, host: '127.0.0.1' }
})
