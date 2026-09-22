import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap.js'
import { getImage } from '../../hooks/useImages.js'
import { Logo } from '../ui/Logo.jsx'
import './preloader.css'

const MIN_MS = 700 // long enough to feel like an entrance
const MAX_MS = 1100 // never make anyone wait longer than this

/** Resolves when web fonts and the hero's first plate are decoded (or the cap is hit). */
function waitForCriticalAssets() {
  // Fonts are self-hosted; load the faces the first screen uses before revealing it.
  const fonts = Promise.all([
    document.fonts.load('300 64px "Cormorant Garamond"'),
    document.fonts.load('italic 300 64px "Cormorant Garamond"'),
    document.fonts.load('400 16px "Hanken Grotesk"'),
  ]).catch(() => {})
  // only the home route needs the hero plate before reveal
  const hero = window.location.pathname === '/' ? getImage('hero.plate1') : null
  const plate = new Promise((resolve) => {
    if (!hero) return resolve()
    const img = new Image()
    img.sizes = window.innerWidth >= 1024 ? '45vw' : '90vw'
    img.srcset = hero.srcSet
    img.src = hero.src
    if (img.decode) img.decode().then(resolve, resolve)
    else img.onload = img.onerror = resolve
  })
  return Promise.all([fonts, plate])
}

/**
 * Short branded preloader. Progress is real (fonts + hero image) but capped:
 * it holds for at least MIN_MS so it reads as an entrance, and never longer
 * than MAX_MS. `onReveal` fires while the curtain is lifting so the hero
 * entrance overlaps the exit instead of waiting for it.
 */
export default function Preloader({ onReveal, onDone }) {
  const root = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = { p: 0 }
    const pct = root.current.querySelector('.pre__pct')
    const bar = root.current.querySelector('.pre__bar-fill')
    const paint = () => {
      pct.textContent = String(Math.round(state.p)).padStart(3, '0')
      bar.style.transform = `scaleX(${state.p / 100})`
    }

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from('.pre__mark', { opacity: 0, scale: 0.85, y: 10, duration: 1.2, ease: 'power3.out' })
        gsap.from('.pre__word .ch', { yPercent: 110, duration: 1, stagger: 0.035, ease: 'power4.out', delay: 0.15 })
        gsap.from('.pre__foot', { opacity: 0, duration: 0.8, delay: 0.3 })
      }

      // Ease toward 90% while assets load, then finish.
      const crawl = gsap.to(state, { p: 90, duration: MAX_MS / 1000, ease: 'power2.out', onUpdate: paint })
      const started = performance.now()

      const finish = () => {
        crawl.kill()
        gsap
          .timeline({ onComplete: onDone })
          .to(state, { p: 100, duration: 0.2, ease: 'power1.out', onUpdate: paint })
          .to('.pre__content', { opacity: 0, y: -24, duration: 0.4, ease: 'power2.in' }, '+=0')
          .add(() => onReveal(), '<0.1')
          .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'power4.inOut' }, '<0.1')
      }

      Promise.race([waitForCriticalAssets(), new Promise((r) => setTimeout(r, MAX_MS))]).then(() => {
        const wait = Math.max(0, MIN_MS - (performance.now() - started))
        gsap.delayedCall(reduce ? 0 : wait / 1000, finish)
      })
    }, root)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={root} className="pre" role="status" aria-label="Loading Afrish Petals">
      <div className="pre__content">
        <Logo className="pre__mark" priority />
        <p className="pre__word" aria-hidden="true">
          {[...'AFRISH PETALS'].map((c, i) => (
            <span className="ch-wrap" key={i}>
              <span className="ch">{c === ' ' ? ' ' : c}</span>
            </span>
          ))}
        </p>
      </div>
      <div className="pre__foot" aria-hidden="true">
        <span className="meta">Kigali · Rwanda</span>
        <span className="pre__bar"><span className="pre__bar-fill" /></span>
        <span className="pre__pct meta">000</span>
      </div>
    </div>
  )
}
