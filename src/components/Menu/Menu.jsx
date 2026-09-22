import { useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useGsap } from '../../hooks/useGsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { menuGroups, formatPrice, MENU_URL } from '../../data/menu.js'
import { Img } from '../ui/Img.jsx'
import { Split } from '../ui/Split.jsx'
import { Button } from '../ui/Button.jsx'
import './menu.css'

const EASE = [0.16, 1, 0.3, 1]
const PREVIEW = 6 // dishes shown per tab — the rest live on the full menu

/** A short preview, not the order form: every card opens the real menu to see options and order. */
function DishCard({ dish, i }) {
  return (
    <m.a
      className="menu__card"
      href={MENU_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.08 + i * 0.05 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <span className="menu__card-top">
        <span className="menu__card-name">{dish.name}</span>
        <ArrowUpRight className="menu__card-arrow" strokeWidth={1.6} aria-hidden="true" />
      </span>
      {dish.desc && <span className="menu__card-desc">{dish.desc}</span>}
      <span className="menu__card-price">
        {dish.price != null ? formatPrice(dish.price) : 'See menu'}
        <span className="sr-only"> — opens the full menu to order (new tab)</span>
      </span>
    </m.a>
  )
}

/**
 * MENU PREVIEW — a short taste of the real menu (data/menu.js, imported from Doresto), not the whole
 * 266-item list. Three tabs, six dishes each; every dish and every "View full menu" button opens the
 * restaurant's ordering page (MENU_URL) in a new tab, where guests see full options and prices and order.
 */
export default function Menu() {
  const root = useRef(null)
  const [index, setIndex] = useState(0)
  const group = menuGroups[index]
  const preview = group.sections.flatMap((s) => s.items).slice(0, PREVIEW)

  useGsap(root, () => {
    revealHeadings(root.current)
    fadeUps(root.current)
  }, [])

  const onKeyTabs = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + menuGroups.length) % menuGroups.length
    setIndex(next)
    root.current.querySelector(`#tab-${menuGroups[next].id}`)?.focus()
  }

  return (
    <section id="menu" ref={root} className="menu" aria-labelledby="menu-title">
      <div className="menu__backdrop" aria-hidden="true">
        <AnimatePresence initial={false}>
          <m.div
            key={group.id}
            className="menu__backdrop-img"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <Img name={group.image} sizes="50vw" alt="" />
          </m.div>
        </AnimatePresence>
        <div className="menu__backdrop-shade" />
      </div>

      <div className="container-x menu__inner">
        <header className="menu__head">
          <p className="eyebrow" data-fade>The menu</p>
          <Split as="h2" id="menu-title" className="display-lg" lines={['Taste the', '*continent*']} />
          <p className="menu__intro" data-fade>
            A short taste of what's on offer. Tap any dish to see the full menu, every price and option, and to order.
          </p>
        </header>

        <div className="menu__tabs" role="tablist" aria-label="Menu categories" onKeyDown={onKeyTabs} data-fade>
          {menuGroups.map((g, i) => (
            <button
              key={g.id}
              id={`tab-${g.id}`}
              role="tab"
              type="button"
              aria-selected={i === index}
              aria-controls="menu-panel"
              tabIndex={i === index ? 0 : -1}
              className={`menu__tab ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <span className="menu__tab-n">{g.count}</span>
              {g.label}
              {i === index && <m.span layoutId="menu-underline" className="menu__underline" transition={{ duration: 0.6, ease: EASE }} />}
            </button>
          ))}
        </div>

        <div className="menu__stage" id="menu-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`}>
          <div className="menu__figure" aria-hidden="true">
            <AnimatePresence initial={false}>
              <m.div
                key={group.id}
                className="menu__pic"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', zIndex: 2 }}
                exit={{ y: '-8%', opacity: 0, zIndex: 1, transition: { duration: 0.8, ease: EASE } }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              >
                <m.div className="menu__pic-inner" initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE }}>
                  <Img name={group.image} sizes="(min-width: 1024px) 34vw, 92vw" alt="" />
                </m.div>
              </m.div>
            </AnimatePresence>
            <span className="menu__count meta">{String(index + 1).padStart(2, '0')} / {String(menuGroups.length).padStart(2, '0')}</span>
          </div>

          <div className="menu__copy">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={group.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <h3 className="display-md menu__cat">{group.label}</h3>
                <p className="body-copy menu__blurb">{group.blurb}</p>

                <div className="menu__grid">
                  {preview.map((d, i) => (
                    <DishCard key={d.id} dish={d} i={i} />
                  ))}
                </div>
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="menu__cta" data-fade>
          <Button href={MENU_URL} external variant="solid">View full menu</Button>
          <Button to="/book" link>Reserve a table</Button>
        </div>
      </div>
    </section>
  )
}
