import { useLayoutEffect } from 'react'
import { gsap, MQ } from '../animations/gsap.js'

/**
 * Scoped, media-aware GSAP setup.
 *
 * `setup({ desktop, mobile })` only runs when the user has NOT asked for
 * reduced motion. Everything created inside is reverted automatically when
 * the component unmounts or the media query flips, so elements are never
 * left in a half-animated state.
 *
 * Elements are only hidden (gsap.set) from inside `setup`, so with reduced
 * motion they simply render in their final, visible state.
 */
export function useGsap(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef)
    mm.add(MQ, (ctx) => {
      const { motion, desktop, mobile } = ctx.conditions
      if (!motion) return
      return setup({ desktop, mobile, scope: scopeRef.current })
    })
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
