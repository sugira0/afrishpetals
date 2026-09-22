import { gsap, ScrollTrigger } from './gsap.js'

/**
 * COORDINATED PAGE ENTRANCE — one paused timeline per page, described as data.
 * Every inner page (Contact, Book, Events) uses this so the sequence has the
 * same rhythm as the home hero:
 *
 *   background fades → giant type rises → image clips in →
 *   metadata arrives from different directions → actions → botanicals settle
 *
 * cfg (all optional; each value is a selector or array of selectors, scoped to `root`):
 *   bg        elements that fade in first
 *   words     `.ch` letters (or any masked spans) that rise from below
 *   images    `.img-inner` / clip targets that wipe into view      { targets, from }
 *   meta      [{ targets, x, y }] — each group enters from its own direction
 *   actions   buttons / links revealed last
 *   botanicals leaves that scale + rotate into place
 *   lines     elements with `transform-origin` that grow with scaleX (gold rules)
 */
export function buildPageIntro(root, cfg = {}) {
  const q = (sel) => (sel ? gsap.utils.toArray(sel, root) : [])
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

  if (cfg.bg) tl.from(q(cfg.bg), { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)

  if (cfg.words) {
    tl.from(q(cfg.words), { yPercent: 115, duration: 1.4, stagger: 0.06, ease: 'power4.out' }, 0.25)
  }

  if (cfg.images) {
    const list = Array.isArray(cfg.images) ? cfg.images : [cfg.images]
    list.forEach((img, i) => {
      const cfgImg = typeof img === 'string' ? { targets: img } : img
      const els = q(cfgImg.targets)
      if (!els.length) return
      const CLIP = {
        left: 'inset(0% 100% 0% 0%)',
        right: 'inset(0% 0% 0% 100%)',
        up: 'inset(100% 0% 0% 0%)',
        down: 'inset(0% 0% 100% 0%)',
      }
      const at = cfgImg.at ?? 0.55 + i * 0.15
      tl.fromTo(els, { clipPath: CLIP[cfgImg.from || 'left'] }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' }, at)
      const imgs = els.flatMap((el) => Array.from(el.querySelectorAll('img')))
      if (imgs.length) tl.from(imgs, { scale: 1.25, duration: 2, ease: 'power3.out' }, at)
    })
  }

  ;(cfg.meta || []).forEach((m, i) => {
    tl.from(
      q(m.targets),
      { opacity: 0, x: m.x ?? 0, y: m.y ?? 0, duration: 1.1, stagger: 0.08 },
      m.at ?? 1 + i * 0.12,
    )
  })

  if (cfg.lines) tl.from(q(cfg.lines), { scaleX: 0, duration: 1.6, ease: 'power3.inOut', stagger: 0.12 }, 0.9)

  if (cfg.actions) tl.from(q(cfg.actions), { opacity: 0, y: 22, duration: 1, stagger: 0.12 }, 1.6)

  if (cfg.botanicals) {
    tl.from(q(cfg.botanicals), { opacity: 0, scale: 0.85, rotation: 10, duration: 2, stagger: 0.15, ease: 'power2.out' }, 1.0)
  }

  return tl
}

/**
 * Decorative line drawing: every `[data-draw]` SVG path/line/circle draws itself
 * as it enters the viewport (or scrubs with scroll when data-draw="scrub").
 */
export function drawLines(scope) {
  gsap.utils.toArray('[data-draw]', scope).forEach((el) => {
    if (!el.getTotalLength) return
    const len = el.getTotalLength()
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
    const scrub = el.dataset.draw === 'scrub'
    const delay = parseFloat(el.dataset.delay || 0)
    gsap.to(el, {
      strokeDashoffset: 0,
      duration: 2.2,
      delay,
      ease: 'power2.inOut',
      scrollTrigger: scrub
        ? { trigger: el, start: 'top 85%', end: 'bottom 40%', scrub: 1 }
        : { trigger: el, start: 'top 90%', once: true },
    })
  })
}

/** Refresh measurements after a page's content has settled (fonts, lazy images). */
export function refreshSoon() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}
