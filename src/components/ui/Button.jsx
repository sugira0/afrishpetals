import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { scrollToTarget } from '../../hooks/useLenis.js'

/**
 * Premium button. Behaviours:
 *  - `to="/book"`           → client-side route (react-router)
 *  - `onClick`              → <button>
 *  - `href="#section"`      → smooth-scrolls through Lenis (same page)
 *  - `href="https://…"`     → external link (add `external`)
 * `variant`: outline (default) | solid | dark ; `size`: md | sm ; `link` renders the quiet underlined style.
 * `magnetic` opts a primary CTA into the magnetic hover (animations/magneticButton.js).
 */
export function Button({ children, to, href, onClick, variant = 'outline', size = 'md', link = false, arrow = true, external, cursor, magnetic = false, className = '', ...rest }) {
  const cls = link
    ? `link-line ${className}`
    : `btn ${variant === 'solid' ? 'btn--solid' : ''} ${variant === 'dark' ? 'btn--dark' : ''} ${size === 'sm' ? 'btn--sm' : ''} ${className}`
  const Icon = external ? ArrowUpRight : ArrowRight
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {arrow && <Icon className="btn__arrow" strokeWidth={1.5} aria-hidden="true" />}
    </>
  )
  const common = { className: cls, 'data-cursor': cursor, 'data-magnetic': magnetic ? '' : undefined, ...rest }

  if (to) {
    return (
      <Link to={to} {...common}>
        {content}
      </Link>
    )
  }
  if (href && !onClick) {
    const isHash = href.startsWith('#')
    return (
      <a
        href={href}
        {...common}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={
          isHash
            ? (e) => {
                e.preventDefault()
                scrollToTarget(href)
                history.replaceState(null, '', href)
              }
            : undefined
        }
      >
        {content}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} {...common}>
      {content}
    </button>
  )
}
