import { gsap, ScrollTrigger } from './gsap.js'

const CLIP_FROM = {
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
}

/**
 * Masked image reveal for every `[data-reveal]` wrapper.
 *   wrapper (clip-path)  inset(0 100% 0 0) → inset(0)
 *   image   (scale)      1.15 → 1
 * `data-reveal` value picks the wipe direction (left | right | up | down).
 * The wrapper keeps its own border-radius / arch shape, clip-path is applied
 * on an inner layer so shaped masks (arches, circles) are preserved.
 */
export function revealImages(scope) {
  gsap.utils.toArray('[data-reveal]', scope).forEach((wrap) => {
    const dir = wrap.dataset.reveal || 'left'
    const img = wrap.querySelector('img')
    const inner = wrap.querySelector('.img-inner') || wrap
    gsap.set(inner, { clipPath: CLIP_FROM[dir] || CLIP_FROM.left })
    if (img) gsap.set(img, { scale: 1.18 })

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power4.inOut' },
    })
    tl.to(inner, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5 })
    if (img) tl.to(img, { scale: 1, duration: 1.9, ease: 'power3.out' }, 0)

    ScrollTrigger.create({
      trigger: wrap,
      start: 'top 86%',
      once: true,
      onEnter: () => tl.play(),
    })
  })
}

/**
 * One-shot clip-path entrance for use inside an intro timeline.
 * Returns nothing — add to a timeline with `tl.add(clipIn(...), at)`.
 */
export function clipIn(targets, { from = 'left', duration = 1.5, scaleImg = true } = {}) {
  const els = gsap.utils.toArray(targets)
  const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } })
  tl.fromTo(els, { clipPath: CLIP_FROM[from] }, { clipPath: 'inset(0% 0% 0% 0%)', duration }, 0)
  if (scaleImg) {
    const imgs = els.flatMap((el) => Array.from(el.querySelectorAll('img')))
    if (imgs.length) tl.fromTo(imgs, { scale: 1.25 }, { scale: 1, duration: duration + 0.5, ease: 'power3.out' }, 0)
  }
  return tl
}
