import { useRef } from 'react'
import { gsap } from '../animations/gsap.js'
import { usePageIntro } from '../hooks/usePageIntro.js'
import { revealHeadings, fadeUps } from '../animations/textReveal.js'
import { revealImages } from '../animations/imageReveal.js'
import { driftWords, parallaxInner, parallaxLayers } from '../animations/parallax.js'
import { drawLines, refreshSoon } from '../animations/pageReveal.js'
import { magnetic } from '../animations/magneticButton.js'
import { eventKinds, eventChapters } from '../data/story.js'
import { Img, ImageMask } from '../components/ui/Img.jsx'
import { Split } from '../components/ui/Split.jsx'
import { Letters } from '../components/ui/Letters.jsx'
import { Leaf, PetalMark, Sprig } from '../components/ui/Botanicals.jsx'
import { Logo } from '../components/ui/Logo.jsx'
import { Button } from '../components/ui/Button.jsx'
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton.jsx'
import './events-page.css'

/**
 * /events — the atmosphere and the possibilities. The inquiry itself lives on /events/book
 * (one booking flow only); every "plan" action here routes there.
 *   dark hero → ivory intro → dark chapters → ivory "space" → dark "your way" → cinematic close.
 */
export default function Events() {
  const root = useRef(null)

  usePageIntro(
    root,
    {
      bg: '[data-int="bg"]',
      words: '.evp-hero__title .ch',
      images: [{ targets: '.evp-hero__disc .img-inner', from: 'up', at: 0.9 }],
      meta: [
        { targets: '[data-int="eyebrow"]', y: -16, at: 0.5 },
        { targets: '[data-int="copy"]', y: 30, at: 1.3 },
      ],
      lines: '.evp-hero__rule',
      actions: '[data-int="cta"]',
      botanicals: '.evp-hero__leaf',
    },
    (el, { desktop }) => {
      gsap.to('.evp-hero__bg img', {
        scale: 1.14,
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.evp-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.evp-hero__title', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.evp-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-int="fade"]', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.evp-hero', start: '25% top', end: '75% top', scrub: true },
      })

      const body = el.querySelector('.evp-main')
      revealHeadings(body)
      fadeUps(body)
      revealImages(body)
      parallaxInner(body)
      drawLines(body)
      if (desktop) {
        parallaxLayers(body, { strength: 80 })
        driftWords(body)
      }
      gsap.to('.evp-close__bg-inner', {
        yPercent: 8,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: '.evp-close', start: 'top bottom', end: 'bottom top', scrub: true },
      })

      const off = magnetic(el)
      refreshSoon()
      return off
    },
  )

  return (
    <div ref={root} className="evp">
      {/* ═════════ 01 — HERO ═════════ */}
      <header className="evp-hero">
        <div className="evp-hero__bg" data-int="bg" aria-hidden="true">
          <Img name="events.candle" sizes="100vw" priority alt="" />
          <div className="evp-hero__shade" />
        </div>
        <div className="evp-hero__leaf evp-hero__leaf--a" aria-hidden="true"><Leaf variant="blade" /></div>
        <div className="evp-hero__leaf evp-hero__leaf--b" aria-hidden="true"><Leaf variant="fern" /></div>

        <div className="evp-hero__disc" data-speed="0.5" aria-hidden="true">
          <ImageMask name="events.toast" reveal={null} sizes="(min-width: 1024px) 24vw, 46vw" alt="" />
        </div>

        <div className="evp-hero__inner">
          <Logo className="evp-hero__logo" data-int="eyebrow" priority />
          <p className="eyebrow" data-int="eyebrow">Events at Afrish Petals</p>
          <h1 className="evp-hero__title" aria-label="Make it a moment.">
            <Letters text="MAKE IT" className="evp-hero__l1" />
            <Letters text="A MOMENT." className="evp-hero__l2" />
          </h1>
          <span className="evp-hero__rule" aria-hidden="true" />
          <div className="evp-hero__foot" data-int="fade">
            <p className="evp-hero__copy" data-int="copy">Gather, celebrate and create memorable moments around the table.</p>
            <div className="evp-hero__cta" data-int="cta">
              <Button to="/events/book" variant="solid" magnetic>Plan my event</Button>
              <WhatsAppButton variant="inline" context="event">Ask on WhatsApp</WhatsAppButton>
            </div>
          </div>
        </div>
      </header>

      <div className="evp-main">
        {/* ═════════ 02 — INTRODUCTION (ivory) ═════════ */}
        <section className="evp-intro on-light" aria-labelledby="evp-intro-title">
          <div className="container-x evp-intro__grid">
            <div className="evp-intro__head">
              <p className="eyebrow" data-fade>Events</p>
              <Split as="h2" id="evp-intro-title" className="display-xl evp-intro__title" lines={['For the', 'moments', 'that *matter.*']} />
            </div>
            <div className="evp-intro__side">
              <p className="body-copy" data-fade>
                From intimate celebrations to unforgettable gatherings, Afrish Petals is a place to bring people together — with good food, warm hospitality and the time to enjoy it.
              </p>
              <ul className="evp-kinds" aria-label="Kinds of event">
                {eventKinds.map((k) => (
                  <li key={k} data-fade>{k}</li>
                ))}
              </ul>
            </div>
            <PetalMark className="evp-intro__petal" strokeWidth={0.5} />
          </div>
        </section>

        {/* ═════════ 03 — EVENT EXPERIENCES (dark, vertical sequence) ═════════ */}
        <section className="evp-seq" aria-label="Kinds of gathering">
          {eventChapters.map((c, i) => (
            <article className={`evp-ch evp-ch--${i + 1}`} key={c.n} data-parallax-scope>
              <p className="evp-ch__n meta" aria-hidden="true">{c.n} / 0{eventChapters.length}</p>
              <div className="evp-ch__img" data-speed={i === 1 ? '0.2' : i ? '-0.35' : '0.35'}>
                <ImageMask name={c.image} reveal={['left', 'up', 'right'][i]} parallax={6} sizes="(min-width: 1024px) 46vw, 90vw" cursor="VIEW" />
              </div>
              <div className="evp-ch__text">
                <h3 className="evp-ch__title" data-drift={i % 2 ? -3 : 3}>{c.title}</h3>
                <p className="evp-ch__kinds meta">{c.kinds}</p>
                <p className="body-copy" data-fade>{c.text}</p>
              </div>
              <svg className="evp-ch__line" viewBox="0 0 400 4" preserveAspectRatio="none" aria-hidden="true">
                <path data-draw="scrub" d="M0 2 H400" fill="none" stroke="rgba(245, 154, 69,.5)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </article>
          ))}
        </section>

        {/* ═════════ 04 — THE SPACE (ivory) ═════════ */}
        <section className="evp-space on-light" data-parallax-scope aria-labelledby="evp-space-title">
          <div className="container-x evp-space__head">
            <p className="eyebrow" data-fade>The space</p>
            <Split as="h2" id="evp-space-title" className="display-xl evp-space__title" lines={['The space', 'sets the *mood.*']} />
          </div>
          <div className="evp-space__stage container-x">
            <div className="evp-space__a" data-speed="0.2">
              <ImageMask name="cta.table" reveal="right" parallax={6} sizes="(min-width: 1024px) 60vw, 92vw" cursor="VIEW" />
            </div>
            <div className="evp-space__b" data-speed="-0.5">
              <ImageMask name="events.candle" reveal="up" parallax={5} sizes="(min-width: 1024px) 26vw, 56vw" cursor="VIEW" />
            </div>
            <div className="evp-space__c" data-speed="0.6">
              <ImageMask name="experience.events" reveal="left" parallax={4} sizes="(min-width: 1024px) 14vw, 36vw" cursor="VIEW" />
            </div>
            <svg className="evp-space__line" viewBox="0 0 4 300" preserveAspectRatio="none" aria-hidden="true">
              <path data-draw="scrub" d="M2 0 V300" fill="none" stroke="#a8480c" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </section>

        {/* ═════════ 05 — YOUR EVENT, YOUR WAY (dark) ═════════ */}
        <section className="evp-way" aria-labelledby="evp-way-title">
          <Sprig className="evp-way__sprig" />
          <Leaf variant="wide" outline className="evp-way__leaf" />
          <div className="container-x evp-way__inner">
            <Split as="h2" id="evp-way-title" className="display-xl evp-way__title" lines={['Your moment.', 'Your *table.*']} />
            <div className="evp-way__copy">
              <p className="body-copy" data-fade>
                Every occasion is different. Tell us what you are planning and our team will talk it through with you — the details are arranged around your event and what you need.
              </p>
              <div data-fade data-delay="0.1">
                <Button to="/events/book" variant="solid" magnetic>Plan your event</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ 06 — CLOSING (cinematic) ═════════ */}
        <section className="evp-close" aria-labelledby="evp-close-title">
          <div className="evp-close__bg" aria-hidden="true">
            <div className="evp-close__bg-inner"><Img name="events.decor" sizes="100vw" alt="" /></div>
            <div className="evp-close__shade" />
          </div>
          <div className="container-x evp-close__inner">
            <Split as="h2" id="evp-close-title" className="display-xl evp-close__title" lines={["Let's make", 'it *memorable.*']} />
            <p className="evp-close__sub" data-fade>Talk to us about your occasion.</p>
            <div className="evp-close__actions" data-fade>
              <Button to="/events/book" variant="solid" magnetic>Plan an event</Button>
              <Button to="/" link>Explore Afrish Petals</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
