import { restaurant } from '../../data/restaurant.js'
import './map.css'

/**
 * LOCATION MAP — the single, isolated integration point for maps.
 *
 * Configure in data/restaurant.js → `map`:
 *   embedUrl         a provider iframe URL (e.g. Google Maps "Embed a map" src).
 *                    When set, a live, dark-toned map is rendered.
 *   directionsQuery  address string used for the real "Get directions" link.
 *
 * With no `embedUrl` this renders an *illustrative* map — clearly labelled — and
 * does not pretend to be interactive. The illustration contains no real
 * coordinates; nothing about the pin position is claimed.
 */
export const directionsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.map.directionsQuery)}`

export default function LocationMap() {
  const { embedUrl } = restaurant.map

  if (embedUrl) {
    return (
      <div className="lmap lmap--live">
        <iframe
          title={`Map showing ${restaurant.name}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="lmap" role="img" aria-label="Illustrative map of central Kigali (not to scale)">
      <svg className="lmap__svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* terrain contours */}
        <g fill="none" stroke="rgba(224, 112, 31,.09)" strokeWidth="1">
          <path data-draw="scrub" d="M-40 130 C 200 60, 380 210, 640 150 S 1040 60, 1260 170" />
          <path data-draw="scrub" d="M-40 200 C 220 130, 400 290, 660 230 S 1040 140, 1260 250" />
          <path data-draw="scrub" d="M-40 560 C 240 480, 420 640, 700 570 S 1040 500, 1260 600" />
          <path data-draw="scrub" d="M-40 630 C 250 560, 440 700, 720 640 S 1050 580, 1260 670" />
        </g>
        {/* blocks */}
        <g fill="rgba(243,235,221,.035)" stroke="rgba(243,235,221,.07)" strokeWidth="1">
          <rect x="120" y="270" width="150" height="90" />
          <rect x="300" y="250" width="120" height="120" />
          <rect x="740" y="250" width="160" height="100" />
          <rect x="930" y="290" width="110" height="130" />
          <rect x="180" y="420" width="130" height="80" />
          <rect x="780" y="430" width="140" height="90" />
        </g>
        {/* roads */}
        <g fill="none" stroke="rgba(245, 154, 69,.38)" strokeWidth="1.4" strokeLinecap="round">
          <path data-draw d="M-40 380 C 240 350, 420 400, 620 372 S 980 330, 1260 360" />
          <path data-draw d="M560 -40 C 580 160, 540 260, 600 380 S 640 560, 610 740" />
          <path data-draw data-delay=".3" d="M-40 470 C 180 490, 360 460, 560 500 S 900 540, 1260 500" />
          <path data-draw data-delay=".5" d="M330 -40 C 350 120, 300 240, 340 360 S 320 560, 350 740" />
          <path data-draw data-delay=".7" d="M860 -40 C 850 140, 890 230, 850 360 S 880 560, 860 740" />
        </g>
        <g fill="none" stroke="rgba(243,235,221,.14)" strokeWidth="1">
          <path data-draw d="M-40 300 L 1260 260" />
          <path data-draw d="M-40 430 L 1260 445" />
          <path data-draw d="M460 -40 L 490 740" />
          <path data-draw d="M730 -40 L 700 740" />
        </g>
        {/* pin */}
        <g transform="translate(600 372)">
          <circle r="46" fill="none" stroke="rgba(245, 154, 69,.35)" strokeWidth="1" />
          <circle r="22" fill="none" stroke="rgba(245, 154, 69,.6)" strokeWidth="1" />
          <circle r="7" fill="#f59a45" />
        </g>
      </svg>
      <span className="lmap__badge meta">Illustrative map · not to scale</span>
    </div>
  )
}
