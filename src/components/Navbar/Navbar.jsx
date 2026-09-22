import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { gsap, ScrollTrigger } from '../../animations/gsap.js'
import { getLenis } from '../../hooks/useLenis.js'
import { restaurant } from '../../data/restaurant.js'
import { visibleNavLinks } from '../../data/nav.js'
import { Logo } from '../ui/Logo.jsx'
import { Button } from '../ui/Button.jsx'
import './navbar.css'

const navLinks = visibleNavLinks()

/** Which nav item is "current" for a path (+ the home section in view). */
const keyFor = (link) => (link.to === '/' ? 'home' : link.section || link.to.replace('/', ''))

export default function Navbar({ ready, sectionsReady }) {
  const bar = useRef(null)
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [homeSection, setHomeSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const active = pathname === '/' ? homeSection : pathname.replace('/', '').split('/')[0]

  // Entrance: logo first, then links, then the reservation button.
  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.nav__logo', { opacity: 0, y: -20, duration: 1, clearProps: 'transform,opacity' }, 0)
        .from('.nav__link', { opacity: 0, y: -12, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity' }, 0.3)
        .from('.nav__cta, .nav__event', { opacity: 0, y: -12, duration: 0.8, clearProps: 'transform,opacity' }, 0.6)
    }, bar)
    return () => ctx.revert()
  }, [ready])

  // Compact bar, driven by ScrollTrigger (no scroll listeners of our own).
  useEffect(() => {
    const t = ScrollTrigger.create({ start: 60, end: 'max', onToggle: (self) => setScrolled(self.isActive) })
    return () => t.kill()
  }, [])
  useEffect(() => setScrolled(window.scrollY > 60), [pathname])

  // Active home section — only on "/", and only once the lazy sections exist.
  useEffect(() => {
    if (pathname !== '/') return
    setHomeSection('home')
    if (!sectionsReady) return
    const triggers = navLinks
      .filter((l) => l.section)
      .map((l) =>
        ScrollTrigger.create({
          trigger: `#${l.section}`,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setHomeSection(l.section),
        }),
      )
    return () => triggers.forEach((t) => t.kill())
  }, [pathname, sectionsReady])

  // Close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const lenis = getLenis()
    if (menuOpen) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Clicking the current page's own link should still do something sensible.
  const onNav = (e, to) => {
    setMenuOpen(false)
    if (to === '/' && pathname === '/') {
      e.preventDefault()
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { duration: 1.4 })
      else window.scrollTo({ top: 0 })
      history.replaceState(null, '', '/')
    }
  }

  return (
    <header ref={bar} className={`nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo" onClick={(e) => onNav(e, '/')} aria-label={`${restaurant.name} — home`}>
          <Logo className="nav__mark" priority />
          <span className="nav__wordmark">
            AFRISH <span>PETALS</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) => {
            const isActive = active === keyFor(l)
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`nav__link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => onNav(e, l.to)}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="nav__right">
          <Link to="/events/book" className="nav__event" onClick={(e) => onNav(e, '/events/book')}>
            Plan an event
          </Link>
          <Button size="sm" to="/book" className="nav__cta">
            Reserve a table
          </Button>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="mobile-menu"
            className="nav__overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              <ul>
                {[...navLinks, { label: 'Plan an event', to: '/events/book' }].map((l, i) => (
                  <li key={l.to}>
                    <m.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link to={l.to} onClick={(e) => onNav(e, l.to)}>
                        <span className="nav__overlay-index">0{i + 1}</span>
                        {l.label}
                      </Link>
                    </m.div>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="nav__overlay-foot">
              <p>{restaurant.tagline.join(' ')}</p>
              <Button variant="solid" to="/book">
                Reserve a table
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
