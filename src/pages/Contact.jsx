import { useRef } from 'react'
import { ArrowUpRight, Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { gsap } from '../animations/gsap.js'
import { usePageIntro } from '../hooks/usePageIntro.js'
import { revealHeadings, fadeUps } from '../animations/textReveal.js'
import { drawLines, refreshSoon } from '../animations/pageReveal.js'
import { magnetic } from '../animations/magneticButton.js'
import { restaurant } from '../data/restaurant.js'
import { SHOW_NOTES } from '../data/launch.js'
import { ImageMask } from '../components/ui/Img.jsx'
import { Split } from '../components/ui/Split.jsx'
import { Letters } from '../components/ui/Letters.jsx'
import { Logo } from '../components/ui/Logo.jsx'
import { Leaf, Sprig } from '../components/ui/Botanicals.jsx'
import { Button } from '../components/ui/Button.jsx'
import LocationMap, { directionsUrl } from '../components/Map/LocationMap.jsx'
import ContactForm from '../components/ContactForm/ContactForm.jsx'
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton.jsx'
import './contact.css'

const telHref = `tel:${restaurant.phone.replace(/[^\d+]/g, '')}`

/** Editorial information item — a hairline, a gold label, a large readable value. Not a card. */
function InfoItem({ n, icon: Icon, label, href, external, className = '', children }) {
  const inner = (
    <>
      <span className="ct-item__rule" aria-hidden="true" />
      <span className="ct-item__top">
        <span className="ct-item__label">
          <Icon strokeWidth={1.4} aria-hidden="true" />
          {label}
        </span>
        <span className="ct-item__n" aria-hidden="true">{n}</span>
      </span>
      <span className="ct-item__value">{children}</span>
      {href && <ArrowUpRight className="ct-item__go" strokeWidth={1.3} aria-hidden="true" />}
    </>
  )
  const cls = `ct-item ${href ? 'ct-item--link' : ''} ${className}`
  return href ? (
    <a href={href} className={cls} data-cursor="OPEN" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/**
 * CONTACT — an editorial destination, deliberately unlike the home page:
 * the word CONTACT bleeds off the viewport over a photograph, information sits
 * on hairlines instead of cards, and the map is a proper location scene.
 */
export default function Contact() {
  const root = useRef(null)

  usePageIntro(
    root,
    {
      bg: '[data-int="bg"]',
      words: '.ct-hero__headline .line-inner, .ct-hero__word .ch',
      images: [{ targets: '.ct-hero__img .img-inner', from: 'left' }],
      meta: [
        { targets: '[data-int="top"]', y: -18, at: 0.6 },
        { targets: '[data-int="left"]', x: -40, at: 1.0 },
        { targets: '[data-int="right"]', x: 40, at: 1.15 },
        { targets: '[data-int="up"]', y: 36, at: 1.3 },
      ],
      lines: '.ct-hero__rule',
      actions: '[data-int="cta"]',
      botanicals: '.ct-hero__leaf',
    },
    (el, { desktop }) => {
      const body = el.querySelector('.ct-body')
      revealHeadings(body)
      fadeUps(body)
      drawLines(body)

      // Info rules draw as each item arrives
      gsap.utils.toArray('.ct-item__rule', el).forEach((rule) =>
        gsap.from(rule, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
        }),
      )

      // Hero leaves the frame with gentle depth
      gsap.to('.ct-hero__word', {
        xPercent: desktop ? -6 : -3,
        ease: 'none',
        scrollTrigger: { trigger: '.ct-hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.ct-hero__img .img-inner img', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.ct-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-int="fade"]', {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: '.ct-hero', start: '20% top', end: '80% top', scrub: true },
      })

      const off = magnetic(el)
      refreshSoon()
      return off
    },
  )

  return (
    <div ref={root} className="ct">
      {/* ═════════ HERO ═════════ */}
      <header className="ct-hero">
        <div className="ct-hero__bg" data-int="bg" aria-hidden="true" />

        <div className="ct-hero__img" aria-hidden="true">
          <ImageMask name="contact.hero" reveal={null} sizes="(min-width: 768px) 62vw, 100vw" priority alt="" />
          <div className="ct-hero__img-shade" />
        </div>

        <div className="ct-hero__leaf ct-hero__leaf--a" aria-hidden="true"><Leaf variant="blade" /></div>
        <div className="ct-hero__leaf ct-hero__leaf--b" aria-hidden="true"><Leaf variant="fern" outline /></div>

        <p className="ct-hero__index meta" data-int="top" data-int-fade>
          <span>05</span> / CONTACT
        </p>

        <div className="ct-hero__copy" data-int="fade">
          <Split
            as="h1"
            intro
            className="ct-hero__headline"
            lines={['Come find', '*us.*']}
          />
          <span className="ct-hero__rule" aria-hidden="true" />
          <p className="ct-hero__sub" data-int="up">
            Good food, warm hospitality, and unforgettable moments in the heart of Kigali — a restaurant near
            Norrsken, easy to find and easy to love.
          </p>
          <div className="ct-hero__cta" data-int="cta">
            <Button to="/book" variant="solid" magnetic>Reserve a table</Button>
            <Button href="#visit" link>Find us</Button>
          </div>
        </div>

        <div className="ct-hero__floats" data-int="fade">
          <p className="ct-float ct-float--coords meta" data-int="right">
            {restaurant.coordinates}
            <span>{restaurant.city}, {restaurant.country}</span>
          </p>
          <p className="ct-float ct-float--pin" data-int="left">
            <MapPin strokeWidth={1.3} aria-hidden="true" />
            <span>
              {restaurant.address}
              <em>{restaurant.city}, {restaurant.country}</em>
            </span>
          </p>
          <a href="#visit" className="ct-scroll meta" data-int="right" aria-label="Scroll to location">
            <span>Scroll</span>
            <span className="ct-scroll__line" />
          </a>
        </div>

        <Letters text="CONTACT" className="ct-hero__word" />
      </header>

      <div className="ct-body">
        {/* ═════════ INFORMATION ═════════ */}
        <section className="ct-info" aria-labelledby="ct-info-title">
          <Sprig className="ct-info__sprig" />
          <div className="container-x">
            <header className="ct-info__head">
              <p className="eyebrow" data-fade>Visit · Call · Write</p>
              <Split as="h2" id="ct-info-title" className="display-lg" lines={['Everything', 'you need to *find us*']} />
            </header>

            <div className="ct-info__grid">
              <InfoItem n="01" icon={MapPin} label="Location" href={directionsUrl()} external className="ct-item--loc">
                {restaurant.address}
                <span className="ct-item__sub">{restaurant.city}, {restaurant.country}</span>
              </InfoItem>
              <InfoItem n="02" icon={Phone} label="Phone" href={telHref} className="ct-item--phone">
                {restaurant.phone}
              </InfoItem>
              <InfoItem n="03" icon={Mail} label="Email" href={`mailto:${restaurant.email}`} className="ct-item--mail">
                {restaurant.email}
              </InfoItem>
              <InfoItem n="04" icon={Globe} label="Website" href={`https://${restaurant.website}`} external className="ct-item--web">
                {restaurant.website}
              </InfoItem>
              <InfoItem n="05" icon={Clock} label="Opening hours" className="ct-item--hours">
                {restaurant.hours ? (
                  <ul className="ct-hours">
                    {restaurant.hours.map((h) => (
                      <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <span className="ct-item__muted">{restaurant.hoursPlaceholder}</span>
                    {SHOW_NOTES && <span className="sample-note ct-item__note">Dev note — set hours in data/restaurant.js</span>}
                  </>
                )}
              </InfoItem>
            </div>
          </div>
        </section>

        {/* ═════════ MAP ═════════ */}
        <section id="visit" className="ct-map" aria-labelledby="ct-map-title">
          <div className="container-x">
            <div className="ct-map__frame">
              <LocationMap />
            </div>
            <aside className="ct-map__panel" aria-labelledby="ct-map-title">
              <Logo className="ct-map__logo" data-fade />
              <p className="eyebrow" data-fade>Find us</p>
              <h2 id="ct-map-title" className="ct-map__title">
                {restaurant.address}
                <em>{restaurant.city}, {restaurant.country}</em>
              </h2>
              <p className="ct-map__note">Directions open in Google Maps using our address.</p>
              <div className="ct-map__actions">
                <Button href={directionsUrl()} external variant="solid">Get directions</Button>
                <Button href={telHref} link>Call us</Button>
              </div>
            </aside>
          </div>
        </section>

        {/* ═════════ FORM ═════════ */}
        <section id="write" className="ct-write" aria-labelledby="ct-write-title">
          <div className="container-x ct-write__grid">
            <div className="ct-write__intro">
              <p className="eyebrow" data-fade>Write to us</p>
              <Split as="h2" id="ct-write-title" className="display-lg" lines={['Say', '*hello.*']} />
              <p className="body-copy" data-fade>
                Questions, feedback or something you would like to plan — send us a note and we'll reply as soon as we can.
              </p>
              <div className="ct-write__direct" data-fade>
                <WhatsAppButton variant="inline" context="general">Chat on WhatsApp</WhatsAppButton>
                <Button to="/events/book" link>Planning an event?</Button>
              </div>
            </div>
            <div className="ct-write__form">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
