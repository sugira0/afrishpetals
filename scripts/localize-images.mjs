/**
 * Downloads every stock placeholder photo referenced in src/data/images.js into
 * public/images/stock/ as responsive WebP files, so the live site never depends on
 * a third-party image host.  Idempotent: skips files that already exist.
 *
 * Run:  node scripts/localize-images.mjs
 * (Once you have your own photography, use `local()` in images.js and delete /public/images/stock.)
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'

const WIDTHS = [480, 800, 1200, 1800]
const OUT = 'public/images/stock'

const src = await readFile('src/data/images.js', 'utf8')
const ids = [...new Set([...src.matchAll(/photo\('([0-9]+-[0-9a-f]+)'/g)].map((m) => m[1]))]
await mkdir(OUT, { recursive: true })

const exists = (p) => access(p).then(() => true, () => false)
const jobs = ids.flatMap((id) => WIDTHS.map((w) => ({ id, w })))
let done = 0
let failed = []

async function run({ id, w }) {
  const file = `${OUT}/${id}-${w}.webp`
  if (await exists(file)) return
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fm=webp&fit=crop&q=72&w=${w}`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await writeFile(file, Buffer.from(await res.arrayBuffer()))
      return
    } catch (e) {
      if (attempt === 3) failed.push(`${id}@${w}: ${e.message}`)
    }
  }
}

// small worker pool
const queue = [...jobs]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      await run(queue.shift())
      done++
      if (done % 20 === 0) console.log(`${done}/${jobs.length}`)
    }
  }),
)

await writeFile(
  `${OUT}/LICENSE.txt`,
  'Stock placeholder photographs from Unsplash (https://unsplash.com/license): free to use, including commercially.\n' +
    'They are NOT photographs of Afrish Petals. Replace them with the restaurant\'s own photography (see src/data/images.js)\n' +
    'and then delete this folder.\n',
)
console.log(`${ids.length} photos × ${WIDTHS.length} sizes → ${OUT}`)
if (failed.length) {
  console.error('FAILED:\n' + failed.join('\n'))
  process.exit(1)
}
