// Render a contact sheet of every shipped surface, so a round can be judged at
// a glance instead of one file at a time.
//
// It resolves puppeteer-core from the PRODUCT repo, so run it from there:
//
//   cd <product repo>
//   cp <this file> ./sheet.tmp.mjs
//   CHROMIUM_PATH=... node ./sheet.tmp.mjs <brandDir> [theme]
//   rm ./sheet.tmp.mjs
//
// Writes <brandDir>/contact-sheet<-theme>.png.
import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'

const BRAND = resolve(process.argv[2])
const THEME = process.argv[3] || 'default'
const suffix = THEME === 'default' ? '' : `-${THEME}`

const cfg = JSON.parse(readFileSync(join(BRAND, 'tools', 'surfaces.json'), 'utf8')).surfaces
const assets = join(BRAND, 'assets')
const have = new Set(readdirSync(assets))

const mime = e => (e === '.png' ? 'image/png' : 'image/jpeg')
const dataUri = f => `data:${mime(extname(f))};base64,` + readFileSync(join(assets, f)).toString('base64')

const cards = Object.entries(cfg).map(([name, s]) => {
  const file = `${name}${suffix}.${s.format}`
  if (!have.has(file)) return ''
  const ratio = (s.w / s.h).toFixed(2)
  return `<figure style="margin:0">
    <div style="background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:center;min-height:150px">
      <img src="${dataUri(file)}" style="max-width:100%;max-height:230px;display:block;box-shadow:0 1px 3px rgba(28,25,23,.18)">
    </div>
    <figcaption style="margin-top:10px">
      <div style="font:600 14px Inter;color:#1C1917">${name}</div>
      <div style="font:400 13px Inter;color:#57534E;margin-top:2px">${s.w}&times;${s.h} &middot; ${ratio}:1 &middot; ${s.format.toUpperCase()}</div>
      <div style="font:400 12px Inter;color:#A8A29E;margin-top:4px;line-height:1.4">${s.use}</div>
    </figcaption>
  </figure>`
}).filter(Boolean).join('')

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:1600px;background:#FAFAF9;padding:48px;font-family:Inter,system-ui}</style>
</head><body>
  <div style="font:800 30px Inter;letter-spacing:-.025em;color:#1C1917">Kaffee<span style="color:#D97706">listen</span> &mdash; brand surfaces</div>
  <div style="font:400 15px Inter;color:#57534E;margin-top:6px">${THEME} theme &middot; ${Object.keys(cfg).length} surfaces &middot; every file rebuilt from pixels only</div>
  <hr style="border:0;border-top:1px solid #E7E5E4;margin:28px 0 32px">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:34px 28px">${cards}</div>
</body></html>`

const b = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH, headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
})
const p = await b.newPage()
await p.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 1 })
await p.setContent(html, { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
const buf = await p.screenshot({ type: 'png', fullPage: true })
const out = join(BRAND, `contact-sheet${suffix}.png`)
writeFileSync(out, buf)
console.log(`${out}  ${(buf.length / 1024).toFixed(0)} KB`)
await b.close()
