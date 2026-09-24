import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsap.js'
import { usePageIntro } from '../hooks/usePageIntro.js'
import { revealHeadings, fadeUps } from '../animations/textReveal.js'
import { revealImages } from '../animations/imageReveal.js'
import { driftWords, parallaxInner, parallaxLayers } from '../animations/parallax.js'
import { drawLines, refreshSoon } from '../animations/pageReveal.js'
import { magnetic } from '../animations/magneticButton.js'
import { storyCopy, craft } from '../data/story.js'
import { Img, ImageMask } from '../components/ui/Img.jsx'
import { Split } from '../components/ui/Split.jsx'
import { Letters } from '../components/ui/Letters.jsx'
import { Leaf, PetalMark, Sprig } from '../components/ui/Botanicals.jsx'
import { Logo } from '../components/ui/Logo.jsx'
import { Button } from '../components/ui/Button.jsx'
import './story-page.css'

/** Abstract, architectural line-work (no pictorial "African" clichés): nested diamonds + a pair of arcs. */
function Geometry({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false">
      {[190, 150, 110, 70, 30].map((r) => (
        <path key={r} data-draw d={`M200 ${200 - r} L${200 + r} 200 L200 ${200 + r} L${200 - r} 200 Z`} vectorEffect="non-scaling-stroke" />
      ))}
      <circle data-draw cx="200" cy="200" r="196" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/**
 * /story — six editorial spreads:
 *   dark hero → ivory "Where it began" → dark "A taste of Africa" → ivory "The table"
 *   → pinned dark "Craft" (Food / Hospitality / Atmosphere) → cinematic close.
 * All motion goes through the shared GSAP helpers; with reduced motion the page simply renders in its final state.
 */
export default function Story() {
  const root = useRef(null)

  usePageIntro(
    root,
    {
      bg: '[data-int="bg"]',
      words: '.sp-hero__title .ch',
      images: [{ targets: '.sp-hero__disc .img-inner', from: 'up', at: 0.9 }],
      meta: [
        { targets: '[data-int="eyebrow"]', y: -16, at: 0.5 },
        { targets: '[data-int="triad"] span', y: 24, at: 1.4 },
      ],
      lines: '.sp-hero__rule',
      actions: '[data-int="cta"]',
      botanicals: '.sp-hero__leaf',
    },
    (el, { desktop }) => {
      gsap.to('.sp-hero__bg img', {
        scale: 1.14,
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.sp-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.sp-hero__title', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.sp-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-int="fade"]', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.sp-hero', start: '25% top', end: '75% top', scrub: true },
      })

      const body = el.querySelector('.sp-main')
      revealHeadings(body)
      fadeUps(body)
      revealImages(body)
      parallaxInner(body)
      drawLines(body)
      if (desktop) {
        parallaxLayers(body, { strength: 70 })
        driftWords(body)
      }

      // Slow, continuous turn on the Africa ring
      gsap.to('.sp-africa__ring', { rotation: 360, duration: 90, ease: 'none', repeat: -1 })

      // ── Craft: pinned on desktop; each chapter takes a third of the scroll ──
      let pin
      if (desktop) {
        const craftEl = body.querySelector('.sp-craft')
        const items = gsap.utils.toArray('.sp-craft__item', craftEl)
        craftEl.classList.add('is-pinned')
        const set = (i) => items.forEach((it, n) => it.classList.toggle('is-active', n === i))
        set(0)
        pin = ScrollTrigger.create({
          trigger: craftEl.querySelector('.sp-craft__stage'),
          start: 'top top',
          end: () => `+=${window.innerHeight * items.length * 0.9}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => set(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
        })
      }

      const off = magnetic(el)
      refreshSoon()
      return () => {
        pin?.kill()
        el.querySelector('.sp-craft')?.classList.remove('is-pinned')
        off?.()
      }
    },
  )

  return (
    <div ref={root} className="sp">
      {/* ═════════ 01 — HERO ═════════ */}
      <header className="sp-hero">
        <div className="sp-hero__bg" data-int="bg" aria-hidden="true">
          <Img name="experience.ambience" sizes="100vw" priority alt="" />
          <div className="sp-hero__shade" />
        </div>
        <div className="sp-hero__leaf sp-hero__leaf--a" aria-hidden="true"><Leaf variant="blade" /></div>
        <div className="sp-hero__leaf sp-hero__leaf--b" aria-hidden="true"><Leaf variant="fern" /></div>

        <div className="sp-hero__disc" aria-hidden="true">
          <ImageMask name="story.dish" reveal={null} sizes="(min-width: 1024px) 26vw, 46vw" alt="" />
        </div>

        <div className="sp-hero__inner">
          <Logo className="sp-hero__logo" data-int="eyebrow" priority />
          <p className="eyebrow" data-int="eyebrow">Our story</p>
          <h1 className="sp-hero__title" aria-label="More than a restaurant.">
            <Letters text="MORE THAN" className="sp-hero__l1" />
            <Letters text="A RESTAURANT." className="sp-hero__l2" />
          </h1>
          <span className="sp-hero__rule" aria-hidden="true" />
          <p className="sp-hero__triad" data-int="triad">
            <span>A table.</span>
            <span>A story.</span>
            <span>A taste of Africa.</span>
          </p>
          <div className="sp-hero__cta" data-int="cta">
            <Button href="#began" variant="solid" magnetic>Read our story</Button>
          </div>
        </div>

        <a href="#began" className="sp-hero__scroll meta" data-int="fade" aria-label="Scroll to the story">
          <span>Scroll</span>
          <span className="sp-hero__scroll-line" />
        </a>
      </header>

      <div className="sp-main">
        {/* ═════════ 02 — WHERE IT BEGAN (ivory) ═════════ */}
        <section id="began" className="sp-began on-light" data-parallax-scope aria-labelledby="began-title">
          <div className="container-x sp-began__grid">
            <header className="sp-began__head">
              <p className="eyebrow" data-fade>The beginning</p>
              <Split as="h2" id="began-title" className="display-xl sp-began__title" lines={['Where it', '*began.*']} />
            </header>

            <div className="sp-began__big" data-speed="0.3">
              <ImageMask name="story.room" reveal="up" parallax={7} sizes="(min-width: 1024px) 34vw, 80vw" cursor="VIEW" />
              <span className="sp-cap meta">Kigali · Rwanda</span>
            </div>

            <div className="sp-began__copy">
              <span className="sp-began__num meta" aria-hidden="true">01</span>
              {storyCopy.beginning.map((p, i) => (
                <p key={i} className={i === 0 ? 'sp-lede' : 'body-copy'} data-fade data-delay={i * 0.1}>{p}</p>
              ))}
              <svg className="sp-rule-draw" viewBox="0 0 300 4" preserveAspectRatio="none" aria-hidden="true">
                <path data-draw d="M0 2 H300" fill="none" stroke="#a8480c" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="sp-began__small" data-speed="-0.45">
              <ImageMask name="story.guest" reveal="left" parallax={5} sizes="(min-width: 1024px) 20vw, 46vw" cursor="VIEW" />
            </div>

            <Logo variant="color" className="sp-began__emblem" alt="" />
            <Sprig className="sp-began__sprig" />
          </div>
        </section>

        {/* ═════════ 03 — A TASTE OF AFRICA (dark) ═════════ */}
        <section className="sp-africa" data-parallax-scope aria-labelledby="africa-title">
          <Geometry className="sp-africa__geo" />
          <Leaf variant="wide" outline className="sp-africa__leaf" />
          <div className="container-x sp-africa__inner">
            <Split as="h2" id="africa-title" className="display-xl sp-africa__title" lines={['A taste', 'of *Africa.*']} />
            <div className="sp-africa__plate" data-speed="0.4">
              <svg className="sp-africa__ring" viewBox="-52 -52 104 104" aria-hidden="true" focusable="false">
                <circle r="50" fill="none" stroke="rgba(245, 154, 69,.55)" strokeWidth=".2" />
                <circle r="50" fill="none" stroke="rgba(245, 154, 69,.9)" strokeWidth=".5" strokeDasharray=".35 2.05" />
              </svg>
              <ImageMask name="hero.plate1" reveal="up" parallax={5} className="sp-africa__disc" sizes="(min-width: 1024px) 34vw, 78vw" alt="" />
            </div>
            <p className="sp-africa__copy body-copy" data-fade>{storyCopy.africa}</p>
          </div>
        </section>

        {/* ═════════ 04 — THE TABLE (ivory, image bleeds off the grid) ═════════ */}
        <section className="sp-table on-light" data-parallax-scope aria-labelledby="table-title">
          <div className="sp-table__img" data-speed="0.25">
            <ImageMask name="experience.live" reveal="right" parallax={6} sizes="(min-width: 1024px) 70vw, 100vw" cursor="VIEW" />
          </div>
          <div className="container-x sp-table__inner">
            <Split as="h2" id="table-title" className="display-xl sp-table__title" lines={['The table', 'brings *us*', 'together.']} />
            <div className="sp-table__copy">
              <span className="sp-table__mark" aria-hidden="true" />
              <p className="body-copy" data-fade>{storyCopy.table}</p>
            </div>
          </div>
          <PetalMark className="sp-table__petal" strokeWidth={0.5} />
        </section>

        {/* ═════════ 05 — CRAFT & EXPERIENCE (dark, pinned on desktop) ═════════ */}
        <section className="sp-craft" aria-labelledby="craft-title">
          <div className="sp-craft__stage">
            <div className="container-x sp-craft__head">
              <p className="eyebrow" data-fade>Craft &amp; experience</p>
              <h2 id="craft-title" className="sr-only">Food, hospitality and atmosphere</h2>
            </div>
            <ol className="sp-craft__list">
              {craft.map((c, i) => (
                <li className="sp-craft__item" key={c.n}>
                  <div className="sp-craft__text">
                    <span className="sp-craft__n">{c.n} — 0{craft.length}</span>
                    <h3 className="sp-craft__word" data-drift={i % 2 ? -3 : 3}>{c.word}</h3>
                    <p className="body-copy">{c.text}</p>
                  </div>
                  <div className="sp-craft__media">
                    <ImageMask name={c.image} reveal={null} sizes="(min-width: 1024px) 40vw, 86vw" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ═════════ 06 — CLOSING (cinematic) ═════════ */}
        <section className="sp-close" aria-labelledby="close-title">
          <div className="sp-close__bg" aria-hidden="true">
            <div className="sp-close__bg-inner"><Img name="cta.table" sizes="100vw" alt="" /></div>
            <div className="sp-close__shade" />
          </div>
          <div className="container-x sp-close__inner">
            <Split as="h2" id="close-title" className="display-xl sp-close__title" lines={['Come for', 'the food.', 'Stay for', 'the *moment.*']} />
            <div className="sp-close__actions" data-fade>
              <Button to="/#menu" link>Explore the menu</Button>
              <Button to="/events" link>Plan an event</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
