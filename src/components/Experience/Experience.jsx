import { useRef } from 'react'
import { useGsap } from '../../hooks/useGsap.js'
import { gsap } from '../../animations/gsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { revealImages } from '../../animations/imageReveal.js'
import { experiencePanels } from '../../data/restaurant.js'
import { ImageMask } from '../ui/Img.jsx'
import { Split } from '../ui/Split.jsx'
import { PetalMark } from '../ui/Botanicals.jsx'
import { Button } from '../ui/Button.jsx'
import './experience.css'

/**
 * MORE THAN A RESTAURANT
 *  ≥1024px + motion → section pins, vertical scroll drives a horizontal track,
 *  then unpins and normal scrolling resumes. Images drift inside their masks
 *  using `containerAnimation`, so parallax stays in sync with the sideways motion.
 *  Phones / reduced motion → the same panels stack vertically.
 */
export default function Experience() {
  const root = useRef(null)

  useGsap(root, ({ desktop }) => {
    const el = root.current

    if (!desktop) {
      revealHeadings(el)
      fadeUps(el)
      revealImages(el)
      return
    }

    el.classList.add('is-horizontal')
    const viewport = el.querySelector('.exp__viewport')
    const track = el.querySelector('.exp__track')
    const bar = el.querySelector('.exp__bar-fill')
    const distance = () => track.scrollWidth - window.innerWidth

    revealHeadings(el, { start: 'top 80%' })

    const scroller = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
      },
    })

    // Per-panel choreography, tied to the horizontal motion
    gsap.utils.toArray('.exp__panel', el).forEach((panel) => {
      const inner = panel.querySelector('.img-inner')
      const img = panel.querySelector('img')
      const num = panel.querySelector('.exp__num')
      const title = panel.querySelector('.exp__title')
      const text = panel.querySelector('.exp__text')

      if (img) {
        gsap.fromTo(
          img,
          { xPercent: -8, scale: 1.18 },
          {
            xPercent: 8,
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scroller,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      }
      if (inner) {
        gsap.from(inner, {
          clipPath: 'inset(0% 100% 0% 0%)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: panel, containerAnimation: scroller, start: 'left 85%', once: true },
        })
      }
      if (num) {
        gsap.fromTo(
          num,
          { xPercent: 18 },
          {
            xPercent: -18,
            ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: scroller, start: 'left right', end: 'right left', scrub: true },
          },
        )
      }
      ;[title, text].filter(Boolean).forEach((node, i) =>
        gsap.from(node, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, containerAnimation: scroller, start: 'left 70%', once: true },
        }),
      )
    })

    // A little petal turns as you travel
    gsap.to('.exp__spin', {
      rotation: 360,
      ease: 'none',
      scrollTrigger: { trigger: viewport, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
    })

    return () => {
      el.classList.remove('is-horizontal')
    }
  }, [])

  return (
    <section id="experience" ref={root} className="exp" aria-labelledby="exp-title">
      <div className="exp__viewport">
        <div className="exp__track">
          {/* Intro panel */}
          <div className="exp__intro">
            <p className="eyebrow" data-fade>The experience</p>
            <Split as="h2" id="exp-title" className="display-xl exp__heading" lines={['More Than', 'a *Restaurant*']} />
            <p className="body-copy" data-fade>
              More than a meal — the whole evening: the food, the room and the people across the table.
            </p>
            <div data-fade>
              <Button to="/events/book" link>Plan an event</Button>
            </div>
            <p className="exp__hint meta" aria-hidden="true">
              <span className="exp__hint-line" /> Keep scrolling
            </p>
            <PetalMark className="exp__spin" strokeWidth={0.5} />
          </div>

          {experiencePanels.map((p, i) => (
            <article className={`exp__panel exp__panel--${i % 2 ? 'b' : 'a'}`} key={p.id} aria-labelledby={`exp-${p.id}`}>
              <span className="exp__num" aria-hidden="true">{p.index}</span>
              <ImageMask name={p.image} reveal="left" className="exp__img" sizes="(min-width: 1024px) 40vw, 92vw" cursor="EXPLORE" />
              <div className="exp__copy">
                <h3 id={`exp-${p.id}`} className="display-md exp__title">{p.title}</h3>
                <p className="body-copy exp__text">{p.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="exp__progress" aria-hidden="true">
          <span className="meta">01</span>
          <span className="exp__bar"><span className="exp__bar-fill" /></span>
          <span className="meta">0{experiencePanels.length}</span>
        </div>
      </div>
    </section>
  )
}
