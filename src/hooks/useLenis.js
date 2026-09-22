import { useEffect } from 'react'
import { startSmoothScroll } from '../animations/smoothScroll.js'

export { getLenis, scrollToTarget, scrollToTop } from '../animations/smoothScroll.js'

/** Starts Lenis for the lifetime of the app shell. */
export function useLenis() {
  useEffect(() => startSmoothScroll(), [])
}
