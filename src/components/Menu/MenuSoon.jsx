import { useRef } from 'react'
import { useGsap } from '../../hooks/useGsap.js'
import { revealHeadings, fadeUps } from '../../animations/textReveal.js'
import { Split } from '../ui/Split.jsx'
import { Button } from '../ui/Button.jsx'
import { Logo } from '../ui/Logo.jsx'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton.jsx'
import './menu.css'

/**
 * Shown in production while data/launch.js → `menu` is false (no real menu supplied yet).
 * Keeps the #menu anchor and nav link working and gives guests a real next step,
 * instead of publishing a sample menu with made-up prices.
 */
export default function MenuSoon() {
  const root = useRef(null)
  useGsap(root, () => {
    revealHeadings(root.current)
    fadeUps(root.current)
  }, [])

  return (
    <section id="menu" ref={root} className="menu menu--soon" aria-labelledby="menu-title">
      <div className="container-x menu-soon">
        <Logo className="menu-soon__logo" data-fade />
        <p className="eyebrow" data-fade>The menu</p>
        <Split as="h2" id="menu-title" className="display-lg" lines={['Our menu,', '*shared with you*']} />
        <p className="body-copy" data-fade>
          Our full menu is being finalised. Message us on WhatsApp and we will send you the current menu, or reserve a
          table and we will look after the rest.
        </p>
        <div className="menu-soon__actions" data-fade>
          <WhatsAppButton variant="inline" context="general">Ask for the menu</WhatsAppButton>
          <Button to="/book" variant="solid">Reserve a table</Button>
        </div>
      </div>
    </section>
  )
}
