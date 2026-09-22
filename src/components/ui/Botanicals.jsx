import { useId, useMemo } from 'react'

/**
 * African botanical language, drawn procedurally so every leaf is a real vector
 * (crisp at any scale, no image weight). Three families:
 *   blade  – broad banana/strelitzia-style leaf with a curved midrib and veins
 *   fern   – frond with paired leaflets
 *   sprig  – line-art stem with alternating leaves (editorial accents)
 * plus <PetalMark/>, the brand rosette.
 *
 * Colours come from CSS custom properties so a leaf can be re-tinted from CSS:
 *   --leaf-a / --leaf-b   body gradient      --leaf-vein   vein & midrib stroke
 *   --leaf-line           outline-only stroke
 */

const bez = (t, p0, p1, p2, p3) =>
  (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3
const f = (n) => Math.round(n * 10) / 10

const BLADES = {
  blade: { len: 900, wid: 170, bend: 70, wl: 0.86, wr: 1.08, veins: 15 },
  wide: { len: 760, wid: 260, bend: -60, wl: 1.05, wr: 0.9, veins: 13 },
  slim: { len: 1000, wid: 110, bend: 30, wl: 1, wr: 0.92, veins: 20 },
}

function bladeGeometry(kind) {
  const { len, wid, bend, wl, wr, veins } = BLADES[kind]
  const mx = (t) => bez(t, 0, bend * 0.1, bend * 1.1, bend)
  const my = (t) => len * (1 - t)
  const w = (t) => wid * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.9)

  const steps = 56
  const left = []
  const right = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    left.push([mx(t) - w(t) * wl, my(t)])
    right.push([mx(t) + w(t) * wr, my(t)])
  }
  const poly = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ')
  const outline = `${poly(left)} ${right
    .slice()
    .reverse()
    .map((p) => `L${f(p[0])} ${f(p[1])}`)
    .join(' ')} Z`
  const halfRight = `${poly(right.map((p, i) => [p[0], p[1]]))} ${Array.from({ length: steps + 1 }, (_, i) => {
    const t = 1 - i / steps
    return `L${f(mx(t))} ${f(my(t))}`
  }).join(' ')} Z`
  const midrib = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29
    return `${i ? 'L' : 'M'}${f(mx(t))} ${f(my(t))}`
  }).join(' ')

  const veinPaths = []
  for (let i = 1; i < veins; i++) {
    const t = (i / veins) * 0.94 + 0.02
    const t2 = Math.min(t + 0.11, 0.97)
    const x0 = mx(t)
    const y0 = my(t)
    const ex = mx(t2)
    const ey = my(t2)
    const ww = w(t2)
    veinPaths.push(
      `M${f(x0)} ${f(y0)} Q${f(x0 - ww * wl * 0.55)} ${f(y0 - (y0 - ey) * 0.15)} ${f(ex - ww * wl * 0.94)} ${f(ey)}`,
      `M${f(x0)} ${f(y0)} Q${f(x0 + ww * wr * 0.55)} ${f(y0 - (y0 - ey) * 0.15)} ${f(ex + ww * wr * 0.94)} ${f(ey)}`,
    )
  }

  const pad = wid * 0.25
  const minX = Math.min(-wid * wl, bend - wid * wl) - pad
  const maxX = Math.max(wid * wr, bend + wid * wr) + pad
  return { viewBox: `${f(minX)} -8 ${f(maxX - minX)} ${len + 16}`, outline, halfRight, midrib, veins: veinPaths.join(' ') }
}

function fernGeometry() {
  const len = 1000
  const stemX = (t) => bez(t, 0, 50, 110, 60)
  const stemY = (t) => len * (1 - t)
  const stem = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29
    return `${i ? 'L' : 'M'}${f(stemX(t))} ${f(stemY(t))}`
  }).join(' ')
  const leaflets = []
  const n = 17
  for (let i = 1; i <= n; i++) {
    const t = 0.06 + (i / n) * 0.9
    const size = 210 * (1 - t * 0.78)
    const thick = size * 0.17
    const lens = `M0 0 Q${f(size / 2)} ${f(-thick)} ${f(size)} 0 Q${f(size / 2)} ${f(thick)} 0 0Z`
    const x = stemX(t)
    const y = stemY(t)
    const tilt = 42 + t * 12
    leaflets.push({ d: lens, tr: `translate(${f(x)} ${f(y)}) rotate(${-180 + tilt})` })
    leaflets.push({ d: lens, tr: `translate(${f(x)} ${f(y)}) rotate(${-tilt})` })
  }
  // terminal leaflet
  leaflets.push({
    d: `M0 0 Q14 -34 0 -110 Q-14 -34 0 0Z`,
    tr: `translate(${f(stemX(1))} ${f(stemY(1))})`,
  })
  return { viewBox: '-260 -20 620 1040', stem, leaflets }
}

const CACHE = {}
const geo = (v) => (CACHE[v] ??= v === 'fern' ? fernGeometry() : bladeGeometry(v))

export function Leaf({ variant = 'blade', outline = false, className = '', style, veins = true }) {
  const uid = useId().replace(/:/g, '')
  const g = useMemo(() => geo(variant), [variant])

  if (variant === 'fern') {
    return (
      <svg className={`botanical ${className}`} style={style} viewBox={g.viewBox} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`fg${uid}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--leaf-a, #0c3227)" />
            <stop offset="1" stopColor="var(--leaf-b, #164b3a)" />
          </linearGradient>
        </defs>
        <path d={g.stem} fill="none" stroke="var(--leaf-vein, rgba(224, 112, 31,.5))" strokeWidth="1.4" />
        {g.leaflets.map((l, i) => (
          <path
            key={i}
            d={l.d}
            transform={l.tr}
            fill={outline ? 'none' : `url(#fg${uid})`}
            stroke={outline ? 'var(--leaf-line, rgba(224, 112, 31,.35))' : 'var(--leaf-vein, rgba(224, 112, 31,.28))'}
            strokeWidth="0.9"
          />
        ))}
      </svg>
    )
  }

  return (
    <svg className={`botanical ${className}`} style={style} viewBox={g.viewBox} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`lg${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--leaf-a, #0a2a21)" />
          <stop offset="1" stopColor="var(--leaf-b, #175040)" />
        </linearGradient>
      </defs>
      <path
        d={g.outline}
        fill={outline ? 'none' : `url(#lg${uid})`}
        stroke={outline ? 'var(--leaf-line, rgba(224, 112, 31,.35))' : 'none'}
        strokeWidth="1"
      />
      {!outline && <path d={g.halfRight} fill="rgba(120,200,160,.07)" />}
      {veins && (
        <>
          <path d={g.veins} fill="none" stroke={outline ? 'var(--leaf-line, rgba(224, 112, 31,.28))' : 'var(--leaf-vein, rgba(224, 112, 31,.34))'} strokeWidth="0.9" />
          <path d={g.midrib} fill="none" stroke={outline ? 'var(--leaf-line, rgba(224, 112, 31,.4))' : 'var(--leaf-vein, rgba(224, 112, 31,.5))'} strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

/** Line-art sprig used as an editorial accent (stroke only, currentColor). */
export function Sprig({ className = '', style, leaves = 7 }) {
  const parts = useMemo(() => {
    const out = []
    for (let i = 0; i < leaves; i++) {
      const t = (i + 0.6) / (leaves + 0.4)
      const x = 100 + Math.sin(t * 3.4) * 18
      const y = 470 - t * 430
      const side = i % 2 === 0 ? 1 : -1
      const s = 70 - t * 34
      out.push({
        d: `M0 0 C${f(s * 0.3)} ${f(-s * 0.36)} ${f(s * 0.75)} ${f(-s * 0.3)} ${f(s)} 0 C${f(s * 0.75)} ${f(s * 0.3)} ${f(s * 0.3)} ${f(s * 0.36)} 0 0Z M0 0 L${f(s)} 0`,
        tr: `translate(${f(x)} ${f(y)}) rotate(${side === 1 ? -38 : -142}) `,
      })
    }
    return out
  }, [leaves])
  return (
    <svg className={`botanical ${className}`} style={style} viewBox="0 0 200 480" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false">
      <path d="M100 476 C 88 380, 122 250, 104 30" />
      {parts.map((p, i) => (
        <path key={i} d={p.d} transform={p.tr} />
      ))}
      <path d="M104 30 C 96 14 96 6 104 -2 C 112 6 112 14 104 30Z" />
    </svg>
  )
}

/** Brand rosette: two layers of petals around a point. */
export function PetalMark({ className = '', style, strokeWidth = 1.2 }) {
  const petals = useMemo(() => {
    const out = []
    const layer = (n, len, wid, rot) => {
      for (let i = 0; i < n; i++) {
        out.push({
          d: `M0 0 C${f(wid)} ${f(-len * 0.35)} ${f(wid * 0.7)} ${f(-len * 0.8)} 0 ${f(-len)} C${f(-wid * 0.7)} ${f(-len * 0.8)} ${f(-wid)} ${f(-len * 0.35)} 0 0Z`,
          r: (360 / n) * i + rot,
        })
      }
    }
    layer(8, 40, 15, 0)
    layer(8, 27, 10, 22.5)
    return out
  }, [])
  return (
    <svg className={className} style={style} viewBox="-50 -50 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true" focusable="false">
      {petals.map((p, i) => (
        <path key={i} d={p.d} transform={`rotate(${p.r})`} />
      ))}
      <circle r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Faint, oversized line-art foliage used as the hero's "botanical texture".
 * Purely decorative and static — moved as one layer by the scroll timeline.
 */
export function BotanicalTexture({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <Leaf variant="blade" outline veins className="tex tex--1" />
      <Leaf variant="wide" outline veins className="tex tex--2" />
      <Leaf variant="fern" outline className="tex tex--3" />
      <Leaf variant="slim" outline veins className="tex tex--4" />
    </div>
  )
}
