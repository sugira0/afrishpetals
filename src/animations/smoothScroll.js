import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap.js'

let instance = null

/** The running Lenis instance (null when reduced motion is on or before start). */
export const getLenis = () => instance

/**
 * Lenis ⇄ ScrollTrigger bridge, created once for the whole app:
 *  - Lenis reports every scroll → ScrollTrigger.update
 *  - GSAP's ticker drives Lenis (a single rAF loop)
 *  - lagSmoothing(0) so the two never drift
 * Returns a destroy function. Disabled for reduced-motion users.
 */
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    syncTouch: false, // keep native momentum on touch devices
  })
  instance = lenis
  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  return () => {
    gsap.ticker.remove(tick)
    lenis.off('scroll', onScroll)
    lenis.destroy()
    instance = null
  }
}

/** Smooth-scroll to a selector/element; falls back to native scrolling. */
export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (instance) instance.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts })
  else el.scrollIntoView({ behavior: 'auto' })
}

/** Jump to the top instantly (route changes). */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}
