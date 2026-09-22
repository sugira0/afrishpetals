import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGsap } from '../../hooks/useGsap.js'
import { gsap } from '../../animations/gsap.js'
import { restaurant } from '../../data/restaurant.js'
import { visibleNavLinks } from '../../data/nav.js'
import { whatsappUrl } from '../../data/whatsapp.js'
import { Logo } from '../ui/Logo.jsx'
import { Button } from '../ui/Button.jsx'
import { directionsUrl } from '../Map/LocationMap.jsx'
import './footer.css'

const navLinks = visibleNavLinks()
const TBA = <span className="ft__tba">To be announced</span>

const socials = [
  ['Instagram', restaurant.social.instagram],
  ['Facebook', restaurant.social.facebook],
  ['TikTok', restaurant.social.tiktok],
  ['X', restaurant.social.x],
]

/**
 * Footer — contact details come only from data/restaurant.js. Anything not yet
 * supplied reads "To be announced" instead of being invented.
 */
export default function Footer() {
  const root = useRef(null)

  useGsap(root, () => {
    gsap.from('.ft__giant .ch', {
      yPercent: 100,
      duration: 1.4,
      stagger: 0.05,
      ease: 'power4.out',
      scrollTrigger: { trigger: '.ft__giant', start: 'top 95%', once: true },
    })
  }, [])

  const activeSocials = socials.filter(([, href]) => href)

  return (
    <footer id="footer" ref={root} className="ft" aria-labelledby="ft-brand">
      <div className="container-x ft__top">
        <div className="ft__brand">
          <Link to="/" className="ft__logo" id="ft-brand">
            <Logo className="ft__mark" />
            <span>AFRISH <em>PETALS</em></span>
          </Link>
          <p className="ft__tag">
            {restaurant.tagline[0]}
            <br />
            <em>{restaurant.tagline[1]}</em>
          </p>
          <div className="ft__ctas">
            <Button to="/book" size="sm">Reserve a table</Button>
            <Button to="/events/book" link>Plan an event</Button>
          </div>
        </div>

        <div className="ft__col">
          <h2 className="ft__h meta">Contact</h2>
          <dl className="ft__list">
            <div><dt>Phone</dt><dd>{restaurant.phone ? <a href={`tel:${restaurant.phone.replace(/\s/g, '')}`}>{restaurant.phone}</a> : TBA}</dd></div>
            <div><dt>Email</dt><dd>{restaurant.email ? <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a> : TBA}</dd></div>
            <div>
              <dt>Location</dt>
              <dd>
                {restaurant.address ? <a href={directionsUrl()} target="_blank" rel="noopener noreferrer">{restaurant.address}</a> : TBA}
                <span className="ft__place">{restaurant.city}, {restaurant.country}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="ft__col">
          <h2 className="ft__h meta">Opening hours</h2>
          {restaurant.hours ? (
            <dl className="ft__list">
              {restaurant.hours.map((h) => (
                <div key={h.days}><dt>{h.days}</dt><dd>{h.time}</dd></div>
              ))}
            </dl>
          ) : (
            <p className="ft__list-p"><span className="ft__tba">{restaurant.hoursPlaceholder}</span></p>
          )}
        </div>

        <div className="ft__col">
          <h2 className="ft__h meta">Connect</h2>
          <ul className="ft__social">
            <li><a href={whatsappUrl('general')} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            {activeSocials.map(([label, href]) => (
              <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>
            ))}
          </ul>
          <h2 className="ft__h meta ft__h--gap">Explore</h2>
          <ul className="ft__social">
            {navLinks.slice(1).map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
            <li><Link to="/events/book">Plan an event</Link></li>
            <li><a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer">Full menu ↗</a></li>
          </ul>
        </div>
      </div>

      <p className="ft__giant" aria-hidden="true">
        {[...'AFRISH PETALS'].map((c, i) => (
          <span className="ch-wrap" key={i}><span className="ch">{c === ' ' ? ' ' : c}</span></span>
        ))}
      </p>

      <div className="container-x ft__base">
        <span className="meta">© {new Date().getFullYear()} {restaurant.name} · {restaurant.city}, {restaurant.country}</span>
        <span className="ft__legal">
          <Link to="/privacy" className="meta">Privacy</Link>
          <span className="meta ft__site">{restaurant.website}</span>
        </span>
      </div>
    </footer>
  )
}
