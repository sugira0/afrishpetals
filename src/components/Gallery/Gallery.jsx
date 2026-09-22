import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useGsap } from '../../hooks/useGsap.js'
import { getLenis } from '../../hooks/useLenis.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { revealImages } from '../../animations/imageReveal.js'
import { parallaxLayers } from '../../animations/parallax.js'
import { gallery } from '../../data/gallery.js'
import { ImageMask, Img } from '../ui/Img.jsx'
import { Split } from '../ui/Split.jsx'
import './gallery.css'

/**
 * GALLERY — an overlapping, slightly rotated collage on a 12-column canvas.
 * Hover: the image eases forward and its caption slides up; siblings recede
 * (pure CSS with :has). Click opens a minimal lightbox.
 */
export default function Gallery() {
  const root = useRef(null)
  const [active, setActive] = useState(null)

  useGsap(root, ({ desktop }) => {
    const el = root.current
    revealHeadings(el)
    fadeUps(el)
    revealImages(el)
    if (desktop) parallaxLayers(el, { strength: 60 })
  }, [])

  return (
    <section id="gallery" ref={root} className="gal" data-parallax-scope aria-labelledby="gal-title">
      <div className="container-x">
        <header className="gal__head">
          <p className="eyebrow" data-fade>Gallery</p>
          <Split as="h2" id="gal-title" className="display-lg" lines={['The room,', 'the *table,*', 'the light']} />
        </header>

        <ul className="gal__grid">
          {gallery.map((g, i) => (
            <li
              key={g.key}
              className="g-item"
              data-speed={g.speed}
              style={{ '--col': g.col, '--row': g.row, '--rot': `${g.rot}deg`, '--z': g.z }}
            >
              <button type="button" className="g-item__frame" onClick={() => setActive(i)} data-cursor="VIEW" aria-label={`Open image: ${g.caption}`}>
                <ImageMask data={g} reveal={i % 2 ? 'right' : 'left'} sizes="(min-width: 1024px) 30vw, 46vw" className="g-item__img" />
                <span className="g-item__cap">
                  <span>{g.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active !== null && <Lightbox index={active} onClose={() => setActive(null)} onChange={setActive} />}
      </AnimatePresence>
    </section>
  )
}

function Lightbox({ index, onClose, onChange }) {
  const g = gallery[index]
  const closeBtn = useRef(null)
  const n = gallery.length

  useEffect(() => {
    const previous = document.activeElement
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % n)
      if (e.key === 'ArrowLeft') onChange((index - 1 + n) % n)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      getLenis()?.start()
      previous?.focus?.()
    }
  }, [index, n, onChange, onClose])

  return (
    <m.div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button className="lb__scrim" onClick={onClose} tabIndex={-1} aria-label="Close viewer" />
      <button ref={closeBtn} className="lb__btn lb__close" onClick={onClose} aria-label="Close">
        <X strokeWidth={1.3} />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        <m.figure
          key={g.key}
          className="lb__fig"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Img data={g} sizes="90vw" priority />
          <figcaption className="meta">
            {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} — {g.caption}
          </figcaption>
        </m.figure>
      </AnimatePresence>
      <button className="lb__btn lb__prev" onClick={() => onChange((index - 1 + n) % n)} aria-label="Previous image">
        <ArrowLeft strokeWidth={1.3} />
      </button>
      <button className="lb__btn lb__next" onClick={() => onChange((index + 1) % n)} aria-label="Next image">
        <ArrowRight strokeWidth={1.3} />
      </button>
    </m.div>
  )
}
