import { gsap } from './gsap.js'

/**
 * Magnetic hover for primary calls to action (`[data-magnetic]`): the button
 * drifts a few pixels toward the pointer and settles back on leave.
 * Only for fine pointers; returns a cleanup function to remove listeners.
 */
export function magnetic(scope, { strength = 0.28 } = {}) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  const off = []
  gsap.utils.toArray('[data-magnetic]', scope).forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    off.push(() => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    })
  })
  return () => off.forEach((f) => f())
}
