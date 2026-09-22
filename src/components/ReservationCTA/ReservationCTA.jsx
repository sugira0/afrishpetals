import { useRef } from 'react'
import { useGsap } from '../../hooks/useGsap.js'
import { gsap } from '../../animations/gsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { Img } from '../ui/Img.jsx'
import { Split } from '../ui/Split.jsx'
import { Button } from '../ui/Button.jsx'
import { Leaf } from '../ui/Botanicals.jsx'
import { Logo } from '../ui/Logo.jsx'
import './cta.css'

/**
 * FINAL CTA — full-bleed photography that drifts and settles as the section
 * crosses the viewport, with the three-line promise set enormous on top.
 */
export default function ReservationCTA() {
  const root = useRef(null)

  useGsap(root, ({ desktop }) => {
    const el = root.current
    revealHeadings(el, { start: 'top 75%' })
    fadeUps(el)

    gsap.fromTo(
      '.cta__bg-inner',
      { yPercent: -9, scale: 1.18 },
      {
        yPercent: 9,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    gsap.from('.cta__action', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.cta__action', start: 'top 92%', once: true },
    })
    if (desktop) {
      gsap.to('.cta__leaf--a', {
        yPercent: -22,
        rotation: 8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      })
      gsap.to('.cta__leaf--b', {
        yPercent: 26,
        rotation: -10,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      })
    }
  }, [])

  return (
    <section id="reserve" ref={root} className="cta" aria-labelledby="cta-title">
      <div className="cta__bg" aria-hidden="true">
        <div className="cta__bg-inner">
          <Img name="cta.table" sizes="100vw" alt="" />
        </div>
        <div className="cta__shade" />
      </div>
      <Leaf variant="blade" className="cta__leaf cta__leaf--a" />
      <Leaf variant="wide" className="cta__leaf cta__leaf--b" />

      <div className="container-x cta__inner">
        <Logo className="cta__logo" data-fade />
        <Split
          as="h2"
          id="cta-title"
          className="cta__title"
          lines={['Good *food.*', 'Good people.', 'Great *moments.*']}
        />
        <div className="cta__action">
          <Button variant="solid" to="/book" className="cta__btn" magnetic>Reserve your table</Button>
          <Button to="/events/book" link>Plan an event</Button>
          <p className="cta__sub">Crafted with Passion. Served with Love.</p>
        </div>
      </div>
    </section>
  )
}
