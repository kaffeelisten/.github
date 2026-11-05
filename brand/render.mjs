// Rasterise the Kaffeelisten brand assets with the repo's own puppeteer-core +
// local Chrome — the same mechanism the product already uses for PDF rendering.
//
// It resolves puppeteer-core from the PRODUCT repo, so run it from there:
//
//   cd <product repo>
//   cp <this file> ./render-brand.tmp.mjs
//   CHROMIUM_PATH=... node ./render-brand.tmp.mjs <path to .github/brand>
//   rm ./render-brand.tmp.mjs
//
// CHROMIUM_PATH is in the workspace .env.local at the umbrella root.
//
// Colours come from the app's own token blocks in apps/web/src/index.css
// (:root for light, [data-mode='dark'] for dark). Nothing is invented here.
import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BRAND = process.argv[2]
const CHROME = process.env.CHROMIUM_PATH

const logo = readFileSync(join(BRAND, 'logo', 'logo.svg'), 'utf8')
const ill = readFileSync(join(BRAND, 'illustrations', 'tally-to-tablet.svg'), 'utf8')

const THEMES = {
  light: {
    bg: '#FAFAF9', surface2: '#F5F5F4', border: '#E7E5E4',
    fg: '#1C1917', fgMuted: '#57534E',
    accent: '#D97706', square: '#D97706',
  },
  dark: {
    bg: '#1C1917', surface2: '#33302E', border: '#44403C',
    fg: '#F5F5F4', fgMuted: '#A8A29E',
    accent: '#F59E0B', square: '#F59E0B',
  },
}

const shell = (body, w, h) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden}
  body{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
</style></head><body>${body}</body></html>`

const chips = ['Tablet statt Strichliste', 'Monatsbericht automatisch', 'Kein Login']

const social = t => `
<div style="position:relative;width:1280px;height:640px;background:${t.bg};overflow:hidden">
  <div style="position:absolute;right:56px;top:50%;transform:translateY(-50%);color:${t.accent};width:470px">
    ${ill.replace('<svg', '<svg style="width:470px;height:auto;display:block"')}
  </div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:12px;background:${t.accent}"></div>
  <div style="position:relative;padding:112px 0 0 104px;max-width:700px">
    <div style="display:flex;align-items:center;gap:28px">
      ${logo.replace('#D97706', t.square).replace('<svg', '<svg style="width:104px;height:104px;display:block"')}
      <div style="font-size:16px;font-weight:600;letter-spacing:.16em;color:${t.accent}">KAFFEELISTEN.DE</div>
    </div>
    <div style="margin-top:54px;font-size:84px;font-weight:700;letter-spacing:-.025em;color:${t.fg};line-height:1">Kaffeelisten</div>
    <div style="margin-top:26px;font-size:34px;font-weight:400;color:${t.fgMuted};line-height:1.35">Die Kaffeeliste &ndash; ohne Papier.</div>
    <div style="margin-top:42px;display:flex;gap:14px">
      ${chips.map(c => `<span style="font-size:17px;font-weight:500;color:${t.fgMuted};background:${t.surface2};border:1px solid ${t.border};border-radius:999px;padding:10px 20px;white-space:nowrap">${c}</span>`).join('')}
    </div>
  </div>
</div>`

const avatar = `<div style="width:512px;height:512px">${logo.replace('<svg', '<svg style="width:512px;height:512px;display:block"')}</div>`

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
})

async function shot(html, w, h, out) {
  const p = await browser.newPage()
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  await p.setContent(shell(html, w, h), { waitUntil: 'networkidle0' })
  await p.evaluate(() => document.fonts.ready)
  const buf = await p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: w, height: h } })
  writeFileSync(out, buf)
  console.log(`${out.split(/[\\/]/).slice(-2).join('/')}  ${w}x${h}  ${(buf.length / 1024).toFixed(0)} KB`)
  await p.close()
}

await shot(avatar, 512, 512, join(BRAND, 'logo', 'avatar-512.png'))
await shot(social(THEMES.light), 1280, 640, join(BRAND, 'social', 'social-preview.png'))
await shot(social(THEMES.dark), 1280, 640, join(BRAND, 'social', 'social-preview-dark.png'))
await browser.close()
