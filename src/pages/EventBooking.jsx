import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { gsap } from '../animations/gsap.js'
import { usePageIntro } from '../hooks/usePageIntro.js'
import { revealHeadings, fadeUps } from '../animations/textReveal.js'
import { revealImages } from '../animations/imageReveal.js'
import { driftWords, parallaxInner, parallaxLayers } from '../animations/parallax.js'
import { drawLines, refreshSoon } from '../animations/pageReveal.js'
import { magnetic } from '../animations/magneticButton.js'
import { eventSteps, eventStory } from '../data/events.js'
import { Img, ImageMask } from '../components/ui/Img.jsx'
import { Split } from '../components/ui/Split.jsx'
import { Letters } from '../components/ui/Letters.jsx'
import { Leaf, PetalMark } from '../components/ui/Botanicals.jsx'
import { Logo } from '../components/ui/Logo.jsx'
import { Button } from '../components/ui/Button.jsx'
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton.jsx'
import EventBookingForm from '../components/EventBookingForm/EventBookingForm.jsx'
import './events.css'

/**
 * /events/book — immersive. Full-bleed photography, oversized type, three
 * storytelling words, then the inquiry flow. GSAP choreographs the page
 * (entrance, parallax, drifting words, drawn lines, clip reveals); Framer
 * Motion handles the form's step transitions.
 */
export default function EventBooking() {
  const root = useRef(null)
  const [step, setStep] = useState(0)
  const onStepChange = useCallback((s) => setStep(s), [])

  usePageIntro(
    root,
    {
      bg: '[data-int="bg"]',
      words: '.ev-hero__title .ch',
      images: [
        { targets: '.ev-float--a .img-inner', from: 'up', at: 0.9 },
        { targets: '.ev-float--b .img-inner', from: 'left', at: 1.05 },
        { targets: '.ev-float--c .img-inner', from: 'right', at: 1.2 },
      ],
      meta: [
        { targets: '[data-int="eyebrow"]', y: -16, at: 0.5 },
        { targets: '[data-int="copy"]', y: 30, at: 1.3 },
      ],
      lines: '.ev-hero__rule',
      actions: '[data-int="cta"]',
      botanicals: '.ev-hero__leaf',
    },
    (el, { desktop }) => {
      // ── hero: background breathes, floaters drift at different speeds ──
      gsap.to('.ev-hero__bg img', {
        scale: 1.16,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.ev-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.ev-hero__title', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: '.ev-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-int="fade"]', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.ev-hero', start: '25% top', end: '75% top', scrub: true },
      })

      // ── storytelling + form ──
      const body = el.querySelector('.ev-main')
      revealHeadings(body)
      fadeUps(body)
      revealImages(body)
      parallaxInner(body)
      drawLines(body)
      if (desktop) {
        parallaxLayers(el, { strength: 80 })
        driftWords(body)
      }
      gsap.to('.ev-plan__bg img', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.ev-plan', start: 'top bottom', end: 'bottom top', scrub: true },
      })

      const off = magnetic(el)
      refreshSoon()
      return off
    },
  )

  return (
    <div ref={root} className="ev">
      {/* ═════════ HERO ═════════ */}
      <header className="ev-hero">
        <div className="ev-hero__bg" data-int="bg" aria-hidden="true">
          <Img name="events.candle" sizes="100vw" priority alt="" />
          <div className="ev-hero__shade" />
        </div>

        <div className="ev-hero__leaf ev-hero__leaf--a" aria-hidden="true"><Leaf variant="blade" /></div>
        <div className="ev-hero__leaf ev-hero__leaf--b" aria-hidden="true"><Leaf variant="fern" /></div>

        {/* floating event imagery, each at its own depth */}
        <div className="ev-float ev-float--a" data-speed="0.6" aria-hidden="true">
          <ImageMask name="events.toast" reveal={null} sizes="(min-width: 1024px) 18vw, 40vw" alt="" />
        </div>
        <div className="ev-float ev-float--b" data-speed="-0.5" aria-hidden="true">
          <ImageMask name="events.longTable" reveal={null} sizes="(min-width: 1024px) 24vw, 46vw" alt="" />
        </div>
        <div className="ev-float ev-float--c" data-speed="0.9" aria-hidden="true">
          <ImageMask name="events.gathering" reveal={null} sizes="(min-width: 1024px) 16vw, 36vw" alt="" />
        </div>

        <svg className="ev-hero__ring" viewBox="0 0 200 200" aria-hidden="true">
          <circle data-draw data-delay="1.2" cx="100" cy="100" r="96" fill="none" stroke="rgba(245, 154, 69,.45)" strokeWidth="0.6" />
        </svg>

        <div className="ev-hero__inner">
          <Logo className="ev-hero__logo" data-int="eyebrow" priority />
          <p className="eyebrow" data-int="eyebrow">Private events</p>
          <h1 className="ev-hero__title" aria-label="Make it a moment.">
            <Letters text="MAKE IT" className="ev-hero__l1" />
            <Letters text="A MOMENT." className="ev-hero__l2" />
          </h1>
          <span className="ev-hero__rule" aria-hidden="true" />
          <div className="ev-hero__foot" data-int="fade">
            <p className="ev-hero__copy" data-int="copy">
              From intimate celebrations to unforgettable gatherings, create an experience your guests will remember.
            </p>
            <div className="ev-hero__cta" data-int="cta">
              <Button href="#plan" variant="solid" magnetic>Plan my event</Button>
              <WhatsAppButton variant="inline" context="event">Ask on WhatsApp</WhatsAppButton>
            </div>
          </div>
        </div>

        <a href="#story" className="ev-hero__scroll meta" data-int="fade" aria-label="Scroll to the story">
          <span>Scroll</span>
          <span className="ev-hero__scroll-line" />
        </a>
      </header>

      <div className="ev-main">
        {/* ═════════ STORY ═════════ */}
        <section id="story" className="ev-story" aria-label="The occasion">
          {eventStory.map((b, i) => (
            <div className={`ev-band ev-band--${i + 1}`} key={b.word} data-parallax-scope>
              <p className="ev-band__n meta" aria-hidden="true">0{i + 1} / 0{eventStory.length}</p>
              <h2 className="ev-band__word" data-drift={i % 2 ? -5 : 5}>{b.word}</h2>
              <div className="ev-band__img" data-speed={i % 2 ? '-0.4' : '0.4'}>
                <ImageMask name={b.image} reveal={i % 2 ? 'right' : 'left'} parallax={6} sizes="(min-width: 1024px) 34vw, 86vw" cursor="VIEW" />
              </div>
              <p className="ev-band__line" data-fade>{b.line}</p>
              <svg className="ev-band__draw" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
                <path data-draw="scrub" d="M0 10 H400" fill="none" stroke="rgba(245, 154, 69,.55)" strokeWidth="1" />
              </svg>
              {i === 1 && <PetalMark className="ev-band__mark" strokeWidth={0.5} />}
            </div>
          ))}
        </section>

        {/* ═════════ PLAN ═════════ */}
        <section id="plan" className="ev-plan" aria-labelledby="ev-plan-title">
          <div className="ev-plan__bg" aria-hidden="true">
            <Img name="events.decor" sizes="100vw" alt="" />
            <div className="ev-plan__shade" />
          </div>
          <div className="container-x ev-plan__grid">
            <div className="ev-plan__intro">
              <p className="eyebrow" data-fade>The inquiry</p>
              <Split as="h2" id="ev-plan-title" className="display-lg" lines={['Plan my', '*event.*']} />
              <p className="body-copy" data-fade>
                Tell us about the occasion in a few short steps. This is an inquiry — our team will get back to you to talk it through.
              </p>
              <div className="ev-plan__ghost" aria-hidden="true">
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={step}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    0{step + 1}
                    <small>{eventSteps[step].label}</small>
                  </m.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="ev-plan__panel">
              <EventBookingForm onStepChange={onStepChange} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
