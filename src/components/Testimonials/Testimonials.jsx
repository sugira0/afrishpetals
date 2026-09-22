import { Fragment, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useGsap } from '../../hooks/useGsap.js'
import { gsap } from '../../animations/gsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { testimonials } from '../../data/restaurant.js'
import { SHOW_NOTES } from '../../data/launch.js'
import { Split } from '../ui/Split.jsx'
import { Logo } from '../ui/Logo.jsx'
import './testimonials.css'

const EASE = [0.16, 1, 0.3, 1]

/**
 * TESTIMONIALS — one large quote at a time, set like a magazine pull-quote.
 * No stars, no cards. Words rise in one by one; navigation is two quiet arrows
 * and a counter (also ← / → on the keyboard).
 */
export default function Testimonials() {
  const root = useRef(null)
  const [i, setI] = useState(0)
  const items = testimonials.items
  const t = items[i]
  const go = (d) => setI((v) => (v + d + items.length) % items.length)

  useGsap(root, () => {
    revealHeadings(root.current)
    fadeUps(root.current)
    gsap.to('.tst__mark', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    })
  }, [])

  const words = t.quote.split(' ')

  return (
    <section
      id="testimonials"
      ref={root}
      className="tst on-light"
      aria-roledescription="carousel"
      aria-label="Guest words"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      <span className="tst__mark" aria-hidden="true">“</span>
      <Logo variant="color" className="tst__emblem" />
      <div className="container-x tst__inner">
        <p className="eyebrow" data-fade>Guest words</p>

        <figure className="tst__fig" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.blockquote
              key={i}
              className="tst__quote"
              initial="hidden"
              animate="show"
              exit="out"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } }, out: { transition: { staggerChildren: 0.01 } } }}
            >
              {words.map((w, k) => (
                <Fragment key={k}>
                  <span className="tst__w">
                    <m.span
                      className="tst__w-in"
                      variants={{
                        hidden: { y: '110%' },
                        show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
                        out: { y: '-110%', transition: { duration: 0.4, ease: [0.5, 0, 0.75, 0] } },
                      }}
                    >
                      {w}
                    </m.span>
                  </span>{' '}
                </Fragment>
              ))}
            </m.blockquote>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <m.figcaption
              key={i}
              className="tst__by"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <span className="tst__name">{t.name}</span>
              <span className="tst__ctx meta">{t.context}</span>
            </m.figcaption>
          </AnimatePresence>
        </figure>

        <div className="tst__foot">
          <div className="tst__nav">
            <button type="button" onClick={() => go(-1)} aria-label="Previous quote"><ArrowLeft strokeWidth={1.3} /></button>
            <span className="tst__count meta">
              {String(i + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(items.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Next quote"><ArrowRight strokeWidth={1.3} /></button>
          </div>
          {SHOW_NOTES && <p className="sample-note">Sample quotes — replace with real guest reviews</p>}
        </div>
      </div>
      <Split as="h2" className="sr-only" lines="What our guests say" />
    </section>
  )
}
