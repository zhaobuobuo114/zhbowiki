import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const [, , url, out, wait = '2000', width = '1400', height = '900', evalCode = ''] =
  process.argv

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  pipe: true,
  args: [
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--font-render-hinting=none',
    '--no-first-run',
    '--disable-extensions',
    `--user-data-dir=D:/wbtemp/pptr-${Date.now()}`
  ]
})

const page = await browser.newPage()
await page.setViewport({ width: Number(width), height: Number(height), deviceScaleFactor: 1 })

page.on('pageerror', (e) => console.log('PAGEERROR:', e.message))
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE:', m.text())
})

await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise((r) => setTimeout(r, Number(wait)))

if (evalCode) {
  try {
    await page.evaluate(evalCode)
    await new Promise((r) => setTimeout(r, 800))
  } catch (e) {
    console.log('EVAL ERROR:', e.message)
  }
}

fs.mkdirSync(out.replace(/[\\/][^\\/]+$/, ''), { recursive: true })
await page.screenshot({ path: out })
await browser.close()
console.log('saved', out)
