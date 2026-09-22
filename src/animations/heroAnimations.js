import { gsap, ScrollTrigger } from './gsap.js'

const q = (root, sel) => gsap.utils.toArray(sel, root)

/**
 * HERO ENTRANCE — a single paused master timeline, played by <Hero/> as soon
 * as the preloader lifts. Each layer owns exactly one transform channel so the
 * scroll choreography below never fights the intro:
 *
 *   .hero__plate      scroll   (yPercent / scale / rotation while scrolling)
 *   .hero__plate-pop  intro    (scale 0.8 → 1, rotation −6° → 0)
 *   .hero__leaf       scroll
 *   .hero__leaf-in    intro    (enter from a different direction each)
 *   .hero__word       scroll   (drift apart)
 *   .ch               intro    (letters rise from their mask)
 */
export function buildHeroIntro(root) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

  tl.from(q(root, '[data-hero="bg"]'), { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
    .from(q(root, '[data-hero="texture"]'), { opacity: 0, scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0)
    .from(q(root, '[data-hero="label"]'), { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.35)
    // AFRISH first …
    .from(q(root, '.hero__word--a .ch, .hero__word--a-front .ch'), { yPercent: 115, duration: 1.4, stagger: 0.07, ease: 'power4.out' }, 0.5)
    // … PETALS follows, slightly later, letters arriving from the right edge
    .from(
      q(root, '.hero__word--b .ch, .hero__word--b-front .ch'),
      { yPercent: 115, duration: 1.5, stagger: { each: 0.06, from: 'end' }, ease: 'power4.out' },
      0.78,
    )
    .from(q(root, '.hero__ring'), { opacity: 0, scale: 0.86, duration: 1.8, ease: 'power2.out' }, 0.8)
    .from(
      q(root, '.hero__plate-pop'),
      { opacity: 0, scale: 0.8, rotation: -7, duration: 1.7, ease: 'power3.out' },
      0.8,
    )
    .from(q(root, '.hero__slide.is-active img'), { scale: 1.3, duration: 2.2, ease: 'power2.out' }, 0.8)
    // Botanicals enter from different directions
    .from(q(root, '.hero__leaf--a .hero__leaf-in'), { xPercent: 45, yPercent: -30, rotation: 24, opacity: 0, duration: 1.9 }, 1.0)
    .from(q(root, '.hero__leaf--b .hero__leaf-in'), { xPercent: -50, yPercent: 40, rotation: -22, opacity: 0, duration: 1.9 }, 1.1)
    .from(q(root, '.hero__leaf--c .hero__leaf-in'), { xPercent: -30, yPercent: 60, rotation: -30, opacity: 0, duration: 1.7 }, 1.25)
    .from(q(root, '.hero__leaf--d .hero__leaf-in'), { xPercent: 40, yPercent: 50, rotation: 16, opacity: 0, duration: 1.8 }, 1.15)
    .from(q(root, '.hero__petal'), { scale: 0, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'back.out(1.6)' }, 1.5)
    .from(q(root, '.hero__badge'), { opacity: 0, scale: 0.7, rotation: -40, duration: 1.4 }, 1.4)
    // Metadata, then the call to action last
    .from(q(root, '[data-hero="meta"]'), { opacity: 0, y: 16, duration: 0.9, stagger: 0.09 }, 1.5)
    .from(q(root, '[data-hero="cta"]'), { opacity: 0, y: 22, duration: 1, stagger: 0.12 }, 1.85)

  return tl
}

/**
 * HERO SCROLL CHOREOGRAPHY — one scrubbed timeline bound to the hero's own
 * scroll distance. Different layers move at different rates, so depth reads as
 * depth rather than as random motion.
 */
export function buildHeroScroll(root, { desktop }) {
  const k = desktop ? 1 : 0.55 // gentler on phones
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  })

  tl.to(q(root, '.hero__word--a, .hero__word--a-front'), { xPercent: -16 * k, yPercent: -6 * k }, 0)
    .to(q(root, '.hero__word--b, .hero__word--b-front'), { xPercent: 16 * k, yPercent: 8 * k }, 0)
    .to(q(root, '.hero__plate'), { yPercent: -16 * k, scale: 1 + 0.1 * k, rotation: 7 * k }, 0)
    .to(q(root, '.hero__ring'), { rotation: 40 }, 0)
    .to(q(root, '.hero__leaf--a'), { yPercent: -28 * k, xPercent: 10 * k, rotation: 10 }, 0)
    .to(q(root, '.hero__leaf--b'), { yPercent: -60 * k, xPercent: -8 * k, rotation: -12 }, 0)
    .to(q(root, '.hero__leaf--c'), { yPercent: -110 * k, xPercent: 6 * k, rotation: 8 }, 0)
    .to(q(root, '.hero__leaf--d'), { yPercent: -45 * k, xPercent: -6 * k }, 0)
    .to(q(root, '[data-hero="texture"]'), { yPercent: 12 }, 0)
    .to(q(root, '[data-hero="shift"]'), { opacity: 1 }, 0)
    // Content dissolves in the first half of the scroll; the imagery lingers.
    .to(q(root, '[data-hero="fade"]'), { opacity: 0, y: -30 * k, ease: 'power1.in' }, 0)

  return tl
}

/**
 * HERO CYCLER — the "01 / 04" cover. Each dish reveals through an expanding
 * circle (clip-path, GPU-friendly) while the outgoing plate scales up slightly.
 * Autoplay pauses when the hero is off-screen or the tab is hidden.
 */
export function createHeroCycler(root, { interval = 6 } = {}) {
  const slides = q(root, '.hero__slide')
  const captions = q(root, '.hero__caption-item')
  const count = q(root, '[data-hero-count]')[0]
  const bar = q(root, '.hero__progress-bar')[0]
  const total = slides.length
  let index = 0
  let busy = false
  let timer = null
  let barTween = null

  const pad = (n) => String(n).padStart(2, '0')

  gsap.set(slides, { zIndex: 0 })
  gsap.set(slides[0], { zIndex: 1 })
  gsap.set(captions, { yPercent: 105 })
  gsap.set(captions[0], { yPercent: 0 })

  const armBar = () => {
    if (!bar) return
    barTween?.kill()
    gsap.set(bar, { scaleX: 0 })
    barTween = gsap.to(bar, { scaleX: 1, duration: interval, ease: 'none' })
  }

  const goTo = (next) => {
    if (busy || next === index) return
    busy = true
    const from = slides[index]
    const to = slides[next]
    const capFrom = captions[index]
    const capTo = captions[next]
    const dir = next > index || (index === total - 1 && next === 0) ? 1 : -1

    gsap.set(to, { zIndex: 2, clipPath: 'circle(0% at 50% 50%)' })
    gsap.set(to.querySelector('img'), { scale: 1.4, rotation: 6 * dir })
    from.classList.remove('is-active')
    to.classList.add('is-active')

    gsap
      .timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(from, { zIndex: 0 })
          gsap.set(to, { zIndex: 1, clearProps: 'clipPath' })
          busy = false
        },
      })
      .to(to, { clipPath: 'circle(72% at 50% 50%)', duration: 1.3 }, 0)
      .to(to.querySelector('img'), { scale: 1, rotation: 0, duration: 1.7, ease: 'power3.out' }, 0)
      .to(from.querySelector('img'), { scale: 1.15, duration: 1.5 }, 0)
      .to(capFrom, { yPercent: -105, duration: 0.7, ease: 'power3.in' }, 0)
      .fromTo(capTo, { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.45)

    index = next
    if (count) count.textContent = pad(index + 1)
    armBar()
  }

  const next = () => goTo((index + 1) % total)
  const prev = () => goTo((index - 1 + total) % total)

  const stop = () => {
    timer?.kill()
    barTween?.pause()
  }
  const start = () => {
    timer?.kill()
    timer = gsap.delayedCall(interval, function loop() {
      next()
      timer = gsap.delayedCall(interval, loop)
    })
    if (barTween) barTween.resume()
    else armBar()
  }

  const io = ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? start() : stop()),
  })
  const onVis = () => (document.hidden ? stop() : io.isActive && start())
  document.addEventListener('visibilitychange', onVis)

  return {
    next: () => {
      stop()
      next()
      start()
    },
    prev: () => {
      stop()
      prev()
      start()
    },
    start,
    stop,
    destroy: () => {
      stop()
      io.kill()
      document.removeEventListener('visibilitychange', onVis)
    },
  }
}
