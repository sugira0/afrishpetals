/**
 * Pre-launch checklist.   npm run launch:check      (add --strict to exit 1 when anything is outstanding)
 *
 * Reads the real data files and tells you, in plain words, what is still placeholder
 * or missing. Nothing here changes any file.
 */
import { existsSync, readFileSync } from 'node:fs'
import { launch } from '../src/data/launch.js'
import { restaurant } from '../src/data/restaurant.js'
import { SITE } from '../src/data/seo.js'
import { tableBooking } from '../src/data/booking.js'

const strict = process.argv.includes('--strict')
const out = []
const todo = (msg) => out.push(['todo', msg])
const note = (msg) => out.push(['note', msg])
const good = (msg) => out.push(['ok', msg])

// ── content switches ──
const labels = {
  menu: 'Menu — real dishes and prices in src/data/menu.js (until then visitors see "Our menu is being finalised" + WhatsApp)',
  signatures: 'Signature dishes — real dishes in src/data/menu.js → signatures',
  testimonials: 'Guest reviews — real, approved quotes in src/data/restaurant.js → testimonials',
  stats: 'Story numbers — real, checkable figures in src/data/restaurant.js → stats',
  gallery: "Gallery — the restaurant's own photographs in src/data/images.js → gallery",
}
for (const [k, msg] of Object.entries(labels)) {
  launch[k] ? good(`${k} is published`) : todo(`NOT PUBLISHED (hidden on the live site): ${msg}`)
}

// ── menu source ──
import { readFileSync as _rf } from 'node:fs'
try {
  const m = JSON.parse(_rf('src/data/menu.raw.json', 'utf8'))
  note(`Menu imported from Doresto on ${m.importedAt} (${m.dishes.length} entries). Changed the menu there? Run  npm run menu:import  and redeploy.`)
  const typos = m.dishes.filter((d) => /tripple|baanana|creame|bouble|boillon|baverage/i.test(d.name + ' ' + d.section)).map((d) => d.name)
  if (typos.length) note(`Spelling to fix at the source on Doresto, then re-import: ${[...new Set(typos)].slice(0, 8).join(', ')}`)
} catch {
  todo('Menu data missing — run  npm run menu:import')
}

// ── facts ──
restaurant.hours ? good('Opening hours set') : todo('Opening hours — set restaurant.hours in src/data/restaurant.js (visitors are told to call/WhatsApp meanwhile)')
restaurant.story ? good('Founding story set') : todo('Founding story — set restaurant.story (two short generic lines are shown meanwhile)')
Object.values(restaurant.social).some(Boolean) ? good('Social links set') : note('No social links yet (Instagram / Facebook / TikTok / X) — optional')
restaurant.map.embedUrl ? good('Live map embed set') : note('Map is an illustration + working "Get directions" link. Optional: paste a Google Maps embed URL into restaurant.map.embedUrl')
tableBooking.timeSlots.length ? good('Table time slots set') : note('Reservation time is free-entry until real slots are added in src/data/booking.js')
if (/norssken/i.test(restaurant.address)) note('Address is spelled "Norssken" — the building is usually spelled "Norrsken". Please confirm.')
else if (/norrsken/i.test(restaurant.address)) good('Address uses the "Norrsken" spelling (matches how people actually search for it)')

// ── images ──
const images = readFileSync('src/data/images.js', 'utf8')
const stock = (images.match(/photo\('\d+-[0-9a-f]+'/g) || []).length
const own = (images.match(/local\('[\w.-]+'/g) || []).length
stock > 0
  ? todo(`PHOTOS: ${stock} images are still stock placeholders (not the restaurant's food/rooms), ${own} are yours. Replace them via src/data/images.js`)
  : good('All photos are the restaurant\'s own')

// ── files ──
for (const f of ['public/og-image.png', 'public/images/logo.png', 'public/images/logo-white.png', 'public/site.webmanifest', 'vercel.json', 'api/submit.js'])
  existsSync(f) ? good(`${f} present`) : todo(`Missing file: ${f}`)

// ── forms / email ──
let env = { ...process.env }
if (existsSync('.env')) for (const l of readFileSync('.env', 'utf8').split('\n')) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m && m[2]) env[m[1]] = m[2] }
env.RESEND_API_KEY
  ? good('RESEND_API_KEY found locally')
  : todo('FORMS: set RESEND_API_KEY (+ FORMS_TO_EMAIL, FORMS_FROM_EMAIL) in Vercel → Settings → Environment Variables, otherwise forms fall back to WhatsApp/email hand-off')

note(`Domain assumed: ${SITE.url} (change in src/data/seo.js if different)`)

// ── report ──
const icon = { ok: '  ✓', todo: '  ✗', note: '  ·' }
console.log('\nAFRISH PETALS — launch check\n')
for (const t of ['todo', 'note', 'ok']) {
  const rows = out.filter(([k]) => k === t)
  if (!rows.length) continue
  console.log({ todo: 'STILL TO DO', note: 'GOOD TO KNOW', ok: 'READY' }[t])
  rows.forEach(([, m]) => console.log(`${icon[t]} ${m}`))
  console.log()
}
const open = out.filter(([k]) => k === 'todo').length
console.log(open ? `${open} item(s) outstanding.` : 'Everything on the checklist is done.')
if (strict && open) process.exit(1)
