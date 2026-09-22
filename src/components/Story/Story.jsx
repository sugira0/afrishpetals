import { useRef } from 'react'
import { useGsap } from '../../hooks/useGsap.js'
import { gsap } from '../../animations/gsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { revealImages } from '../../animations/imageReveal.js'
import { parallaxInner } from '../../animations/parallax.js'
import { parallaxLayers, countUps } from '../../animations/parallax.js'
import { stats, restaurant } from '../../data/restaurant.js'
import { published, SHOW_NOTES } from '../../data/launch.js'
import { ImageMask } from '../ui/Img.jsx'
import { Split } from '../ui/Split.jsx'
import { Sprig, PetalMark, Leaf } from '../ui/Botanicals.jsx'
import { Logo } from '../ui/Logo.jsx'
import './story.css'

const DEFAULT_STORY = [
  "Afrish Petals is one of Kigali's best restaurants — a premium African dining experience near Norrsken, Rwanda.",
  'Crafted with passion, served with love — a table where good food, warm hospitality and unforgettable moments come together.',
]

/**
 * OUR STORY — an asymmetric collage on ivory. The section's top edge is cut on
 * a diagonal and pulled up over the hero so the two scenes interlock.
 * Depth: every image lives on its own parallax layer (data-speed), the room
 * photograph is an arch, the guest portrait tilts into place, botanicals drift.
 */
export default function Story() {
  const root = useRef(null)

  useGsap(root, ({ desktop }) => {
    const el = root.current
    revealHeadings(el)
    fadeUps(el)
    revealImages(el)
    parallaxInner(el)
    countUps(el)
    if (desktop) parallaxLayers(el, { strength: 70 })

    // The portrait rotates slightly into its final resting angle as it arrives.
    gsap.fromTo(
      '.story__portrait-wrap',
      { rotation: 7 },
      {
        rotation: -2.5,
        ease: 'none',
        scrollTrigger: { trigger: '.story__portrait-wrap', start: 'top bottom', end: 'top 30%', scrub: 1 },
      },
    )
    gsap.to('.story__sprig', {
      yPercent: -18,
      rotation: 6,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
    })
    gsap.to('.story__ghost', {
      xPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  }, [])

  return (
    <section id="story" ref={root} className="story on-light" data-parallax-scope aria-labelledby="story-title">
      <div className="story__edge" aria-hidden="true" />
      <span className="story__ghost" aria-hidden="true">Kigali</span>

      <div className="story__grid container-x">
        {/* ── Headline ── */}
        <header className="story__head">
          <p className="eyebrow" data-fade>Our story</p>
          <Split
            as="h2"
            id="story-title"
            className="display-xl story__title"
            lines={['A Table.', 'A Story.', 'A Taste of *Africa.*']}
          />
        </header>

        {/* ── Room: tall arch ── */}
        <div className="story__room" data-speed="0.35">
          <ImageMask
            name="story.room"
            reveal="up"
            parallax={7}
            className="story__arch"
            sizes="(min-width: 1024px) 34vw, 80vw"
            cursor="VIEW"
          />
          <span className="story__cap meta">Kigali · Rwanda</span>
        </div>

        {/* ── Guest portrait: overlaps, tilts ── */}
        <div className="story__portrait" data-speed="-0.5">
          <div className="story__portrait-wrap">
            <ImageMask
              name="story.guest"
              reveal="left"
              parallax={5}
              sizes="(min-width: 1024px) 22vw, 52vw"
              cursor="VIEW"
            />
          </div>
        </div>

        {/* ── Food: wide, tucked under the copy ── */}
        <div className="story__dish" data-speed="0.6">
          <ImageMask
            name="story.dish"
            reveal="right"
            parallax={6}
            sizes="(min-width: 1024px) 28vw, 70vw"
            cursor="VIEW"
          />
        </div>

        {/* ── Copy ── */}
        <div className="story__copy">
          {(restaurant.story ?? DEFAULT_STORY).map((p, i) => (
            <p className="body-copy" data-fade data-delay={i * 0.1} key={i}>{p}</p>
          ))}
          <Logo variant="color" className="story__emblem" alt="Afrish Petals emblem" />
          {SHOW_NOTES && !restaurant.story && (
            <p className="story__placeholder-note sample-note" data-fade data-delay="0.15">
              Generic copy — add the real story in data/restaurant.js → story
            </p>
          )}
        </div>

        {/* ── Stats ── */}
        {published('stats') && (
        <dl className="story__stats" data-parallax-scope>
          {stats.items.map((s) => (
            <div key={s.label} className="story__stat">
              <dt className="meta">{s.label}</dt>
              <dd>
                <span data-count={s.value}>{s.value}</span>
                <span className="story__stat-suffix">{s.suffix}</span>
              </dd>
            </div>
          ))}
          {SHOW_NOTES && <p className="story__stats-note sample-note">Placeholder figures — confirm before publishing</p>}
        </dl>
        )}

        {/* ── Botanical line art ── */}
        <Sprig className="story__sprig" />
        <PetalMark className="story__mark" strokeWidth={0.6} />
        <Leaf variant="slim" outline className="story__leaf" />
      </div>
    </section>
  )
}
