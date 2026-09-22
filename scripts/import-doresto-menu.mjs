/**
 * Imports the restaurant's menu from its public Doresto page into this project.
 *
 *   npm run menu:import
 *
 * What it does (exactly what a visitor does in a browser — no private API, no login):
 *   1. opens https://www.doresto.com/restaurant/afrish-petals in headless Chrome,
 *   2. scrolls until every dish has loaded (it knows the expected total from the category counts
 *      shown on the page and retries until it has them all),
 *   3. writes  src/data/menu.raw.json  — every dish with name, description, price and the menu section
 *      it is listed under.
 *
 * TEXT ONLY, on purpose: the dish photos on that platform are web images with third-party watermarks,
 * so they are NOT imported and must not be used on this site (copyright).
 * The website never calls Doresto at runtime; re-run this command to refresh the menu.
 * Needs: Chrome/Edge installed (CHROME_PATH env var to override) and the `puppeteer-core` dev dependency.
 */
import puppeteer from 'puppeteer-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const SOURCE = 'https://www.doresto.com/restaurant/afrish-petals'
const CHROME = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync)
if (!CHROME) throw new Error('Chrome not found — set CHROME_PATH')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', protocolTimeout: 180000, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
page.goto(SOURCE, { waitUntil: 'load', timeout: 0 }).catch(() => {})

// ── in-page helpers ──
const readItems = () =>
  page.evaluate(() => {
    const out = []
    let section = null
    for (const el of document.querySelectorAll('h3, div')) {
      if (el.tagName === 'H3' && el.className.includes('my-4')) { section = el.textContent.trim(); continue }
      const key = el.getAttribute('wire:key') || ''
      if (el.tagName !== 'DIV' || !key.startsWith('menu-item-')) continue
      const idMatch = el.innerHTML.match(/showItemDetail\((\d+)\)/)
      if (!idMatch) continue
      const nameEl = el.querySelector('.font-semibold.text-gray-900')
      const descEl = [...el.querySelectorAll('div')].find((d) => (d.getAttribute('wire:click') || '').startsWith('showItemDetail'))
      const prices = [...el.querySelectorAll('span.font-semibold')].map((s) => s.textContent.trim()).filter((t) => /RWF/.test(t))
      const img = el.querySelector('img.object-cover')
      const prep = el.textContent.match(/Preparation Time\s*:\s*([^\n]+?)(?:\s{2,}|RWF|Add|$)/)
      out.push({
        id: Number(idMatch[1]),
        section,
        name: nameEl ? nameEl.textContent.replace(/\s+/g, ' ').trim() : '',
        desc: descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '',
        prices,
        veg: !!el.querySelector('img[src$="/veg.svg"]'),
        img: img ? img.src : null,
        prep: prep ? prep[1].trim() : null,
      })
    }
    return out
  })

/** Scroll to the bottom until the count stops growing (or reaches `expected`). */
async function loadAll(expected = Infinity, patience = 4) {
  let last = -1
  for (let stable = 0; stable < patience; ) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await sleep(1800)
    const n = (await readItems()).length
    if (n >= expected) break
    stable = n === last ? stable + 1 : 0
    last = n
  }
  return readItems()
}

// wait for first render
for (let i = 0; i < 60; i++) { await sleep(1000); if ((await readItems().catch(() => [])).length) break }

// ── expected total, from the category counts shown on the page ──
const chips = await page.evaluate(() =>
  [...document.querySelectorAll('a')]
    .filter((a) => (a.getAttribute('wire:click') || '').startsWith('filterMenuItems('))
    .map((a) => ({
      label: (a.querySelector('h3')?.textContent || '').trim(),
      count: Number(((a.querySelector('p')?.textContent || '').match(/(\d+)/) || [])[1] || 0),
    }))
    .filter((c) => c.label && /item/i.test(c.label) === false),
)
const expected = chips.filter((c) => !/^show all$/i.test(c.label)).reduce((n, c) => n + c.count, 0)
console.log(`Page reports ${expected} dishes in ${chips.length - 1} categories`)

// ── load every dish (retry: the infinite scroll can stall) ──
let all = []
for (let attempt = 1; attempt <= 5 && all.length < expected; attempt++) {
  console.log(`Loading dishes… (attempt ${attempt})`)
  all = await loadAll(expected, 5 + attempt * 2)
  console.log(`  ${all.length}/${expected}`)
}
await browser.close()
if (all.length < expected) console.warn(`⚠ Only ${all.length} of ${expected} dishes loaded — re-run, or the menu will be incomplete.`)

const categoryOf = new Map() // (categories come from the section headings)

// ── 4. assemble ──
const money = (s) => Number((s.match(/([\d,]+(?:\.\d+)?)/) || [])[1]?.replace(/,/g, '')) || null
/** Card text is cut off by the platform ("…tomatoes, cocomb..."): drop the half word and end cleanly. */
function tidyDesc(d) {
  if (!/(\.\.\.|…)\s*$/.test(d)) return d.trim()
  const body = d.replace(/(\.\.\.|…)\s*$/, '').trim()
  const cut = Math.max(body.lastIndexOf(','), body.lastIndexOf(' and '))
  return (cut > 12 ? body.slice(0, cut) : body).replace(/[,\s]+$/, '') + '…'
}

const dishes = all.map((i) => ({
  id: i.id,
  name: i.name,
  desc: tidyDesc(i.desc),
  price: i.prices.length ? money(i.prices[0]) : null,
  prices: i.prices.map(money),
  veg: i.veg,
  section: i.section,
}))

await mkdir('src/data', { recursive: true })
await writeFile(
  'src/data/menu.raw.json',
  JSON.stringify({ source: SOURCE, importedAt: new Date().toISOString().slice(0, 10), expected, dishes }, null, 1),
)
console.log(`Saved src/data/menu.raw.json  (${dishes.length} dishes, ${dishes.filter((d) => d.price == null).length} without a price, ${dishes.filter((d) => d.desc.endsWith('…')).length} with a trimmed description)`)
