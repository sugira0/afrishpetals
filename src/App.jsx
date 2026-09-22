import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import { useLenis, scrollToTarget, scrollToTop } from './hooks/useLenis.js'
import { AppContext } from './hooks/useApp.jsx'
import { ScrollTrigger } from './animations/gsap.js'
import { contextForPath } from './data/whatsapp.js'
import { applySeo } from './lib/seo.js'
import Navbar from './components/Navbar/Navbar.jsx'
import Preloader from './components/Preloader/Preloader.jsx'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton.jsx'
import MenuPopup from './components/MenuPopup/MenuPopup.jsx'

// Every route is its own chunk: a visitor to /contact never downloads the home
// page's animation code, and vice-versa.
const Home = lazy(() => import('./pages/Home.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Booking = lazy(() => import('./pages/Booking.jsx'))
const EventBooking = lazy(() => import('./pages/EventBooking.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Footer = lazy(() => import('./components/Footer/Footer.jsx'))

const loadMotionFeatures = () => import('./motionFeatures.js').then((mod) => mod.default)

const SEEN_KEY = 'afrish-petals:seen'
const hasSeenIntro = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/** Route changes: jump to top, or glide to a `/#section` anchor once it exists. */
function useRouteScroll(ready, sectionsReady) {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) scrollToTop()
  }, [pathname, hash])

  useEffect(() => {
    if (!hash || !ready) return
    if (pathname === '/' && !sectionsReady) return
    // give pinned sections a beat to measure, then scroll
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
      scrollToTarget(hash)
    }, 380)
    return () => clearTimeout(t)
  }, [pathname, hash, ready, sectionsReady])
}

export default function App() {
  const { pathname } = useLocation()
  // Repeat visits in the same session skip the preloader entirely.
  const [skipIntro] = useState(hasSeenIntro)
  const [ready, setReady] = useState(skipIntro)
  const [preloading, setPreloading] = useState(!skipIntro)
  const [sectionsReady, setSectionsReady] = useState(false)

  useLenis()
  useRouteScroll(ready, sectionsReady)
  // per-route title, description, canonical and share tags (data/seo.js)
  useEffect(() => applySeo(pathname), [pathname])

  // No scrolling while the curtain is down.
  useEffect(() => {
    if (preloading) {
      window.scrollTo(0, 0)
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
  }, [preloading])

  const onReveal = () => {
    setReady(true)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode — fine */
    }
  }

  const ctx = useMemo(() => ({ ready, sectionsReady, setSectionsReady }), [ready, sectionsReady])

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <AppContext.Provider value={ctx}>
        <a href="#main" className="skip-link">Skip to content</a>
        {preloading && <Preloader onReveal={onReveal} onDone={() => setPreloading(false)} />}
        <Navbar ready={ready} sectionsReady={sectionsReady} />
        <main id="main">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/events/book" element={<EventBooking />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        {!preloading && <MenuPopup />}
        {ready && <WhatsAppButton context={contextForPath(pathname)} delay={0.6} />}
        <div className="grain" aria-hidden="true" />
      </AppContext.Provider>
    </LazyMotion>
  )
}
