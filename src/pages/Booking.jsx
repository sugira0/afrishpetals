import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { gsap } from '../animations/gsap.js'
import { usePageIntro } from '../hooks/usePageIntro.js'
import { magnetic } from '../animations/magneticButton.js'
import { refreshSoon } from '../animations/pageReveal.js'
import { bookingImages } from '../data/booking.js'
import { Img } from '../components/ui/Img.jsx'
import { Split } from '../components/ui/Split.jsx'
import { Leaf } from '../components/ui/Botanicals.jsx'
import { Logo } from '../components/ui/Logo.jsx'
import { Button } from '../components/ui/Button.jsx'
import BookingForm from '../components/BookingForm/BookingForm.jsx'
import './booking.css'

/**
 * /book — a refined reservation journey.
 * Left: a photograph that changes quietly with each step. Right: the form.
 * GSAP choreographs the page entrance; Framer Motion handles the step-level
 * transitions inside the form.
 */
export default function Booking() {
  const root = useRef(null)
  const [step, setStep] = useState(0)
  const onStepChange = useCallback((s) => setStep(s), [])

  usePageIntro(
    root,
    {
      bg: '[data-int="bg"]',
      words: '.bk-title .line-inner',
      images: [{ targets: '.bk-visual__frame', from: 'up', at: 0.35 }],
      meta: [
        { targets: '[data-int="eyebrow"]', y: -14, at: 0.5 },
        { targets: '[data-int="sub"]', y: 24, at: 1.0 },
        { targets: '[data-int="panel"]', x: 50, at: 0.9 },
      ],
      botanicals: '.bk-visual__leaf',
    },
    (el, { desktop }) => {
      gsap.to('.bk-visual__frame img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      const off = magnetic(el)
      refreshSoon()
      return off
    },
  )

  return (
    <div ref={root} className="bk">
      <div className="bk__bg" data-int="bg" aria-hidden="true" />

      <section className="bk-visual" aria-label="Reserve a table">
        <div className="bk-visual__frame" aria-hidden="true">
          <AnimatePresence initial={false}>
            <m.div
              key={step}
              className="bk-visual__img"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Img name={bookingImages[Math.min(step, bookingImages.length - 1)]} sizes="(min-width: 1024px) 46vw, 100vw" priority={step === 0} alt="" />
            </m.div>
          </AnimatePresence>
          <div className="bk-visual__shade" />
        </div>
        <div className="bk-visual__leaf" aria-hidden="true"><Leaf variant="wide" /></div>

        <div className="bk-visual__copy">
          <Logo className="bk-visual__logo" data-int="eyebrow" priority />
          <p className="eyebrow" data-int="eyebrow">Reservations</p>
          <Split as="h1" intro className="bk-title" lines={['Reserve', 'your *table.*']} />
          <p className="bk-sub" data-int="sub">Make your next moment one to remember.</p>
        </div>
      </section>

      <section className="bk-panel" data-int="panel" aria-label="Reservation form">
        <div className="bk-panel__inner">
          <BookingForm onStepChange={onStepChange} />
          <p className="bk-panel__foot">
            Planning something bigger?{' '}
            <Button to="/events/book" link arrow={false}>Plan an event</Button>
          </p>
        </div>
      </section>
    </div>
  )
}
