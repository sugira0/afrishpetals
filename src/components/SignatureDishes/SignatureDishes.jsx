import { useRef } from 'react'
import { useGsap } from '../../hooks/useGsap.js'
import { gsap, ScrollTrigger } from '../../animations/gsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { revealImages } from '../../animations/imageReveal.js'
import { signatures, formatPrice } from '../../data/menu.js'
import { SHOW_NOTES } from '../../data/launch.js'
import { ImageMask } from '../ui/Img.jsx'
import { Split } from '../ui/Split.jsx'
import { Leaf } from '../ui/Botanicals.jsx'
import { Button } from '../ui/Button.jsx'
import './signature.css'

const pad = (n) => String(n + 1).padStart(2, '0')

/**
 * SIGNATURE CREATIONS
 *  ≥1024px + motion → the stage is pinned; scroll progress selects the dish and
 *  each change is a choreographed transition (wipe, text rise, price count).
 *  Otherwise (phones, reduced motion) the same markup is a calm stacked list.
 */
export default function SignatureDishes() {
  const root = useRef(null)

  useGsap(root, ({ desktop }) => {
    const el = root.current
    revealHeadings(el)
    fadeUps(el)

    if (!desktop) {
      revealImages(el)
      return
    }

    // ── Pinned showcase ──
    el.classList.add('is-pinned')
    const stage = el.querySelector('.sig__stage')
    const items = gsap.utils.toArray('.sig__item', el)
    const navItems = gsap.utils.toArray('.sig__nav li', el)
    const ghost = el.querySelector('.sig__ghost span')
    const total = items.length
    let current = 0

    const parts = (item) => gsap.utils.toArray('[data-part]', item)
    const media = (item) => item.querySelector('.sig__media .img-inner')
    const mediaImg = (item) => item.querySelector('.sig__media img')
    const support = (item) => item.querySelector('.sig__support .img-inner')
    const supportImg = (item) => item.querySelector('.sig__support img')
    const price = (item) => item.querySelector('.sig__price-num')

    // Initial state: only the first dish exists.
    items.forEach((item, i) => {
      gsap.set(item, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 1 })
      // reveal wrappers are handled here, not by the generic revealer
      item.querySelectorAll('[data-reveal]').forEach((w) => w.removeAttribute('data-reveal'))
    })
    gsap.set(navItems[0], { '--on': 1 })

    // Entrance of the first dish when the stage arrives
    const intro = gsap.timeline({
      scrollTrigger: { trigger: stage, start: 'top 70%', once: true },
      defaults: { ease: 'power4.out' },
    })
    intro
      .from(media(items[0]), { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.5, ease: 'power4.inOut' })
      .from(mediaImg(items[0]), { scale: 1.25, duration: 1.9 }, 0)
      .from(support(items[0]), { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.4, ease: 'power4.inOut' }, 0.35)
      .from(parts(items[0]), { yPercent: 40, opacity: 0, duration: 1, stagger: 0.08 }, 0.5)

    const goTo = (next) => {
      if (next === current) return
      const from = items[current]
      const to = items[next]
      const dir = next > current ? 1 : -1
      const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } })

      gsap.set(to, { autoAlpha: 1, zIndex: 3 })
      gsap.set(from, { zIndex: 2 })

      // Dominant image: the new dish wipes in over the old one
      tl.fromTo(
        media(to),
        { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2 },
        0,
      )
        .fromTo(mediaImg(to), { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0)
        .to(mediaImg(from), { scale: 1.1, duration: 1.2 }, 0)
        // Supporting panel slides through on its own timing
        .fromTo(
          support(to),
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 },
          0.25,
        )
        .fromTo(supportImg(to), { scale: 1.3 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0.25)
        // Text: old lines lift away, new lines rise in
        .to(parts(from), { yPercent: -45, opacity: 0, duration: 0.55, stagger: 0.04, ease: 'power3.in' }, 0)
        .fromTo(
          parts(to),
          { yPercent: 45, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'power4.out' },
          0.45,
        )
        .set(from, { autoAlpha: 0 }, 1.25)

      // Price counts to its new value
      const el$ = price(to)
      const prev = { v: signatures[current].price }
      gsap.to(prev, {
        v: signatures[next].price,
        duration: 1.1,
        ease: 'power3.out',
        onUpdate: () => (el$.textContent = formatPrice(Math.round(prev.v / 500) * 500)),
        onComplete: () => (el$.textContent = formatPrice(signatures[next].price)),
      })

      // Index, ghost numeral, side navigation
      gsap.to(navItems, { '--on': (i) => (i === next ? 1 : 0), duration: 0.6, ease: 'power2.out' })
      gsap
        .timeline()
        .to(ghost, { yPercent: -100 * dir, opacity: 0, duration: 0.4, ease: 'power2.in' })
        .call(() => (ghost.textContent = pad(next)))
        .set(ghost, { yPercent: 100 * dir })
        .to(ghost, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })

      current = next
    }

    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${window.innerHeight * total * 0.8}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => goTo(Math.min(total - 1, Math.floor(self.progress * total))),
    })

    // Supporting panels drift against the scroll for depth
    gsap.to('.sig__support', {
      yPercent: -26,
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * total * 0.8}`,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    })

    return () => el.classList.remove('is-pinned')
  }, [])

  return (
    <section id="signature" ref={root} className="sig" aria-labelledby="sig-title">
      <div className="sig__stage">
        <Leaf variant="fern" outline className="sig__fern" />
        <header className="sig__head container-x">
          <p className="eyebrow" data-fade>Signature dishes</p>
          <Split as="h2" id="sig-title" className="display-lg sig__title" lines={['Our Signature', '*Creations*']} />
        </header>

        {SHOW_NOTES && <p className="sample-note sig__note">Sample dishes &amp; prices — replace in data/menu.js</p>}

        <div className="sig__items">
          {signatures.map((d, i) => (
            <article className="sig__item container-x" key={d.id} data-i={i} aria-label={d.name}>
              <div className="sig__media">
                <ImageMask name={d.image} reveal="up" sizes="(min-width: 1024px) 46vw, 92vw" cursor="VIEW" />
              </div>
              <div className="sig__support">
                <ImageMask name={d.support} reveal="left" sizes="(min-width: 1024px) 18vw, 44vw" />
              </div>
              <div className="sig__text">
                <p className="sig__cat meta" data-part>
                  <span className="sec-index">{pad(i)}</span> — {d.category}
                </p>
                <h3 className="display-lg sig__name" data-part>{d.name}</h3>
                <p className="body-copy sig__desc" data-part>{d.desc}</p>
                <p className="sig__price" data-part>
                  <span className="sig__price-num">{formatPrice(d.price)}</span>
                </p>
                <div data-part>
                  <Button href="#menu" link>See the full menu</Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="sig__ghost" aria-hidden="true"><span>01</span></div>
        <ol className="sig__nav" aria-hidden="true">
          {signatures.map((d, i) => (
            <li key={d.id}>
              <span className="sig__nav-bar" />
              <span className="meta">{pad(i)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
