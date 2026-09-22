import { useEffect } from 'react'
import { ScrollTrigger } from '../animations/gsap.js'
import Story from './Story/Story.jsx'
import SignatureDishes from './SignatureDishes/SignatureDishes.jsx'
import Menu from './Menu/Menu.jsx'
import Experience from './Experience/Experience.jsx'
import Gallery from './Gallery/Gallery.jsx'
import Testimonials from './Testimonials/Testimonials.jsx'
import ReservationCTA from './ReservationCTA/ReservationCTA.jsx'
import MenuSoon from './Menu/MenuSoon.jsx'
import { published } from '../data/launch.js'

/**
 * Everything below the hero, in a single lazy chunk. Once mounted, pinned
 * scenes need fresh measurements — so we refresh after layout, after fonts
 * and after the window's own load event.
 */
export default function Sections({ onReady }) {
  useEffect(() => {
    onReady?.()
    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
    }
  }, [onReady])

  return (
    <>
      <Story />
      {published('signatures') && <SignatureDishes />}
      {published('menu') ? <Menu /> : <MenuSoon />}
      <Experience />
      {published('gallery') && <Gallery />}
      {published('testimonials') && <Testimonials />}
      <ReservationCTA />
    </>
  )
}
