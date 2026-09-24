import { useEffect, useId, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useGsap } from '../../hooks/useGsap.js'
import { buildHeroIntro, buildHeroScroll, createHeroCycler } from '../../animations/heroAnimations.js'
import { heroDishes } from '../../data/hero.js'
import { restaurant } from '../../data/restaurant.js'
import { SHOW_NOTES } from '../../data/launch.js'
import { Img } from '../ui/Img.jsx'
import { Leaf, PetalMark, BotanicalTexture } from '../ui/Botanicals.jsx'
import { Logo } from '../ui/Logo.jsx'
import { Button } from '../ui/Button.jsx'
import './hero.css'

/** One letter per masked cell so letters can rise individually. Decorative — the <h1> carries the name. */
const Word = ({ text, className }) => (
  <span className={`hero__word ${className}`} aria-hidden="true">
    {[...text].map((c, i) => (
      <span className="ch-wrap" key={i}>
        <span className="ch">{c}</span>
      </span>
    ))}
  </span>
)

const pad = (n) => String(n).padStart(2, '0')

export default function Hero({ ready }) {
  const root = useRef(null)
  const intro = useRef(null)
  const cycler = useRef(null)
  const badgeId = useId().replace(/:/g, '')

  useGsap(root, ({ desktop }) => {
    const el = root.current
    const tl = buildHeroIntro(el)
    intro.current = tl
    buildHeroScroll(el, { desktop })
    cycler.current = createHeroCycler(el)
    cycler.current.stop() // starts once the entrance has finished
    tl.eventCallback('onComplete', () => cycler.current?.start())
    return () => {
      cycler.current?.destroy()
      cycler.current = null
      intro.current = null
    }
  }, [])

  // The preloader tells us when the curtain lifts.
  useEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])

  return (
    <section id="home" ref={root} className="hero" aria-label="Afrish Petals — welcome">
      {/* ── Atmosphere ── */}
      <div className="hero__bg" data-hero="bg" aria-hidden="true">
        <video
          className="hero__video"
          src="/video/hero.mp4"
          poster="/images/real/catering-buffet-1200.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
        <div className="hero__video-shade" />
        <div className="hero__shift" data-hero="shift" />
        <div className="hero__texture" data-hero="texture">
          <BotanicalTexture className="hero__texture-inner" />
        </div>
        <div className="hero__vignette" />
      </div>

      <div className="hero__stage">
        {/* ── Back botanicals ── */}
        <div className="hero__leaf hero__leaf--a" aria-hidden="true">
          <div className="hero__leaf-in"><div className="hero__leaf-sway"><Leaf variant="blade" /></div></div>
        </div>
        <div className="hero__leaf hero__leaf--b" aria-hidden="true">
          <div className="hero__leaf-in"><div className="hero__leaf-sway"><Leaf variant="wide" /></div></div>
        </div>
        <div className="hero__leaf hero__leaf--d" aria-hidden="true">
          <div className="hero__leaf-in"><div className="hero__leaf-sway"><Leaf variant="slim" /></div></div>
        </div>

        {/* ── Typography ── */}
        <h1 className="hero__title" aria-label={restaurant.name}>
          <Word text="AFRISH" className="hero__word--a" />
          <Word text="PETALS" className="hero__word--b" />
        </h1>

        {/* ── The plate: circle mask, hairline ring, cycling dishes ── */}
        <div className="hero__plate" data-cursor="VIEW">
          <div className="hero__plate-pop">
            <svg className="hero__ring" viewBox="-52 -52 104 104" aria-hidden="true" focusable="false">
              <circle r="50" fill="none" stroke="rgba(245, 154, 69,.55)" strokeWidth=".18" />
              <circle r="50" fill="none" stroke="rgba(245, 154, 69,.9)" strokeWidth=".5" strokeDasharray=".35 2.05" />
              <circle cx="0" cy="-50" r=".9" fill="#f59a45" />
            </svg>
            <div className="hero__disc">
              {heroDishes.map((d, i) => (
                <div className={`hero__slide ${i === 0 ? 'is-active' : ''}`} key={d.image}>
                  <Img
                    name={d.image}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    priority={i === 0}
                    fetchPriority={i === 0 ? 'high' : 'low'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Outline copies of both words pass in front of the plate so the type weaves through the dish. */}
        <Word text="AFRISH" className="hero__word--a-front" />
        <Word text="PETALS" className="hero__word--b-front" />

        {/* ── Foreground botanicals + petals ── */}
        <div className="hero__leaf hero__leaf--c" aria-hidden="true">
          <div className="hero__leaf-in"><div className="hero__leaf-sway"><Leaf variant="fern" /></div></div>
        </div>
        <span className="hero__petal hero__petal--1" aria-hidden="true"><PetalMark /></span>
        <span className="hero__petal hero__petal--2" aria-hidden="true"><PetalMark /></span>
        <span className="hero__petal hero__petal--3" aria-hidden="true"><PetalMark /></span>

        {/* ── Rotating brand badge ── */}
        <div className="hero__badge" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="spin-slow">
            <defs>
              <path id={badgeId} d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
            </defs>
            <text>
              <textPath href={`#${badgeId}`} startOffset="0">
                CRAFTED WITH PASSION · SERVED WITH LOVE ·
              </textPath>
            </text>
          </svg>
          <Logo className="hero__badge-mark" />
        </div>

        {/* ── Editorial metadata ── */}
        <div className="hero__meta hero__meta--place" data-hero="fade">
          <p className="meta" data-hero="meta">{restaurant.city}, {restaurant.country}</p>
          <p className="meta hero__coords" data-hero="meta">{restaurant.coordinates}</p>
        </div>

        <div className="hero__label-wrap" data-hero="fade">
          <p className="hero__label meta" data-hero="label">
            <span className="hero__label-line" />
            {restaurant.descriptor}
          </p>
        </div>

        <div className="hero__counter" data-hero="fade">
          <div className="hero__count-row" data-hero="meta">
            <span className="hero__count">
              <span data-hero-count>01</span>
              <span className="hero__count-sep"> / </span>
              <span>{pad(heroDishes.length)}</span>
            </span>
            <span className="hero__count-nav">
              <button type="button" onClick={() => cycler.current?.prev()} aria-label="Previous dish"><ArrowLeft strokeWidth={1.4} /></button>
              <button type="button" onClick={() => cycler.current?.next()} aria-label="Next dish"><ArrowRight strokeWidth={1.4} /></button>
            </span>
          </div>
          <div className="hero__progress" data-hero="meta"><span className="hero__progress-bar" /></div>
          <div className="hero__caption" data-hero="meta" aria-live="polite">
            {heroDishes.map((d) => (
              <span className="hero__caption-item" key={d.image}>
                <span className="hero__caption-tag">{d.tag}</span> {SHOW_NOTES ? d.label : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="hero__foot" data-hero="fade">
          <p className="hero__tagline" data-hero="cta">
            {restaurant.tagline[0]}
            <br />
            <em>{restaurant.tagline[1]}</em>
          </p>
          <div className="hero__actions" data-hero="cta">
            <Button variant="solid" to="/book" magnetic>Reserve a table</Button>
            <Button link href="#menu">Explore the menu</Button>
          </div>
        </div>

        <a href="#story" className="hero__scroll meta" data-hero="fade" data-hero-scroll aria-label="Scroll to our story">
          <span>Scroll</span>
          <span className="hero__scroll-line" />
        </a>
      </div>
    </section>
  )
}
