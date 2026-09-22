import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { m, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { restaurant } from '../../data/restaurant.js'
import './menupopup.css'

/**
 * "View full menu" pop-up button → the restaurant's Doresto menu (data/restaurant.js → menuUrl).
 *
 *   firstDelayMs  how long after the page is ready before it pops up      (2 seconds)
 *   repeatMs      then it gives a soft "pop" every this many ms            (2 seconds; null = never repeat)
 *
 * Considerate by design: the repeat pauses while the button is hovered/focused, stops when the visitor
 * closes it (remembered for the session), never runs for people who prefer reduced motion, and the
 * button is not shown on the booking pages, where it could sit on top of the form controls.
 */
const POPUP = { firstDelayMs: 2000, repeatMs: 2000 }
const CLOSED_KEY = 'afrish-petals:menu-popup-closed'

export default function MenuPopup() {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const [closed, setClosed] = useState(() => {
    try {
      return sessionStorage.getItem(CLOSED_KEY) === '1'
    } catch {
      return false
    }
  })
  const [shown, setShown] = useState(false)
  const [paused, setPaused] = useState(false)
  const [popping, setPopping] = useState(false)
  const [typing, setTyping] = useState(false)

  const onBookingPage = pathname.startsWith('/book') || pathname.startsWith('/events')

  // appear
  useEffect(() => {
    if (closed || onBookingPage) return setShown(false)
    const t = setTimeout(() => setShown(true), POPUP.firstDelayMs)
    return () => clearTimeout(t)
  }, [closed, onBookingPage])

  // soft repeat
  useEffect(() => {
    if (!shown || reduce || paused || !POPUP.repeatMs) return
    let off
    const id = setInterval(() => {
      setPopping(true)
      off = setTimeout(() => setPopping(false), 700)
    }, POPUP.repeatMs)
    return () => {
      clearInterval(id)
      clearTimeout(off)
    }
  }, [shown, reduce, paused])

  // step aside while a form field has focus on touch devices (on-screen keyboard)
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return
    const isField = (el) => el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
    const on = (e) => isField(e.target) && setTyping(true)
    const off = () => setTyping(false)
    document.addEventListener('focusin', on)
    document.addEventListener('focusout', off)
    return () => {
      document.removeEventListener('focusin', on)
      document.removeEventListener('focusout', off)
    }
  }, [])

  const close = () => {
    setClosed(true)
    try {
      sessionStorage.setItem(CLOSED_KEY, '1')
    } catch {
      /* private mode */
    }
  }

  if (!shown || closed || onBookingPage) return null

  return (
    <m.div
      className={`mp ${typing ? 'is-away' : ''}`}
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <a
        className={`mp__link ${popping ? 'is-popping' : ''}`}
        href={restaurant.menuUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>View full menu</span>
        <ArrowUpRight strokeWidth={1.8} aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button type="button" className="mp__close" onClick={close} aria-label="Dismiss the menu button">
        <X strokeWidth={1.8} aria-hidden="true" />
      </button>
    </m.div>
  )
}
