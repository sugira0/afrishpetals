import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Never let a dropped frame cause GSAP to "catch up" — it fights Lenis.
gsap.ticker.lagSmoothing(0)

/** Media conditions shared by every scene (used with gsap.matchMedia). */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023.98px)',
}

export { gsap, ScrollTrigger }
