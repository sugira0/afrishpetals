import { useEffect, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'
import { whatsappUrl } from '../../data/whatsapp.js'
import './whatsapp.css'

/**
 * Reusable WhatsApp entry point.
 *
 *   <WhatsAppButton context="general" />              floating widget (bottom-right)
 *   <WhatsAppButton context="reservation" />
 *   <WhatsAppButton context="event" variant="inline" extra={summary}>Send on WhatsApp</WhatsAppButton>
 *
 * `context` picks the prefilled opening line (data/whatsapp.js); `extra` appends
 * details (e.g. what a guest already typed into a form). The URL is built at
 * render time, so one component serves every page.
 *
 * Floating: a small circular button that eases in after a short delay, scales to
 * 1.06 on hover and reveals a "Chat with us" tooltip. It never pulses. On touch
 * devices it steps aside while a form field has focus (keyboard open) so it can
 * never sit on top of a submit button.
 */
export default function WhatsAppButton({
  context = 'general',
  extra = '',
  variant = 'floating',
  delay = 1.2,
  className = '',
  children,
}) {
  const reduce = useReducedMotion()
  const href = whatsappUrl(context, extra)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (variant !== 'floating') return
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
  }, [variant])

  if (variant === 'inline') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`btn btn--wa ${className}`}>
        <FaWhatsapp className="btn__icon" aria-hidden="true" />
        <span className="btn__label">{children || 'Chat on WhatsApp'}</span>
      </a>
    )
  }

  return (
    <m.div
      className={`wa ${typing ? 'is-away' : ''} ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <m.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="wa__link"
        aria-label="Chat with Afrish Petals on WhatsApp"
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileFocus={reduce ? undefined : { scale: 1.06 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        data-cursor="CHAT"
      >
        <span className="wa__tip" aria-hidden="true">Chat with us</span>
        <span className="wa__btn">
          <FaWhatsapp aria-hidden="true" />
        </span>
      </m.a>
    </m.div>
  )
}
