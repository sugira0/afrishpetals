import { gsap, ScrollTrigger } from './gsap.js'

/**
 * Depth layers: every `[data-speed]` element drifts at its own rate while its
 * section crosses the viewport. Speed is a signed multiplier — positive moves
 * with the reader (lags), negative races ahead.
 */
export function parallaxLayers(scope, { strength = 90 } = {}) {
  gsap.utils.toArray('[data-speed]', scope).forEach((el) => {
    const speed = parseFloat(el.dataset.speed)
    gsap.fromTo(
      el,
      { y: -speed * strength },
      {
        y: speed * strength,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('[data-parallax-scope]') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      },
    )
  })
}

/** Count a number up once when it scrolls into view. */
export function countUps(scope) {
  gsap.utils.toArray('[data-count]', scope).forEach((el) => {
    const end = parseFloat(el.dataset.count)
    const state = { v: 0 }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(state.v)),
        }),
    })
  })
}

/**
 * Sections flow into one another through a scroll-linked background tone:
 * as `trigger` crosses the viewport, `target`'s background-color eases between
 * two brand tones. Colour is the only property touched (paint-only, no layout).
 */
export function scrubBackground(target, trigger, from, to, { start = 'top 80%', end = 'top 20%' } = {}) {
  gsap.fromTo(
    target,
    { backgroundColor: from },
    {
      backgroundColor: to,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub: true },
    },
  )
}

/**
 * Inner-image parallax: the picture drifts inside its mask. The mask needs
 * overscan (`.has-parallax`, see styles/ui.css) so no edge is ever exposed.
 */
export function parallaxInner(scope, amount = 8) {
  gsap.utils.toArray('[data-parallax-inner]', scope).forEach((wrap) => {
    const target = wrap.querySelector('.img-inner') || wrap.querySelector('img')
    if (!target) return
    const a = parseFloat(wrap.dataset.parallaxInner) || amount
    gsap.fromTo(
      target,
      { yPercent: -a },
      {
        yPercent: a,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}


/**
 * Large words that drift sideways as their section crosses the viewport.
 * `data-drift` = signed distance in % of the element's own width.
 */
export function driftWords(scope) {
  gsap.utils.toArray('[data-drift]', scope).forEach((el) => {
    const d = parseFloat(el.dataset.drift)
    gsap.fromTo(
      el,
      { xPercent: -d },
      { xPercent: d, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } },
    )
  })
}
