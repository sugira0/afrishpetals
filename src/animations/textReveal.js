import { gsap, ScrollTrigger } from './gsap.js'

/**
 * Line / word reveal for every `[data-split]` heading inside `scope`.
 * The markup (ui/Split.jsx) already wraps each line/word in an overflow-hidden
 * `.line` with a `.line-inner` child, so the text stays real, selectable and
 * screen-reader friendly — we only translate the inner spans.
 */
export function revealHeadings(scope, { start = 'top 88%' } = {}) {
  gsap.utils.toArray('[data-split]', scope).forEach((el) => {
    const inners = el.querySelectorAll('.line-inner')
    if (!inners.length) return
    const isWords = el.dataset.split === 'words'
    gsap.set(inners, { yPercent: 118 })
    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () =>
        gsap.to(inners, {
          yPercent: 0,
          duration: isWords ? 1 : 1.25,
          ease: 'power4.out',
          stagger: isWords ? 0.045 : 0.1,
        }),
    })
  })
}

/** Small fade-up for supporting copy / meta. Use sparingly. */
export function fadeUps(scope, selector = '[data-fade]') {
  gsap.utils.toArray(selector, scope).forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0)
    gsap.set(el, { opacity: 0, y: 26 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay }),
    })
  })
}
