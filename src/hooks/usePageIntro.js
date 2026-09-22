import { useEffect, useRef } from 'react'
import { useGsap } from './useGsap.js'
import { useApp } from './useApp.jsx'
import { buildPageIntro } from '../animations/pageReveal.js'

/**
 * Builds a page's coordinated entrance (see animations/pageReveal.js) and plays
 * it as soon as the shell says `ready`. Survives media-query flips: if the
 * timeline is rebuilt after the page is already ready, it plays immediately.
 *
 * `extra(root, ctx)` runs inside the same GSAP scope for scroll choreography
 * and returns an optional cleanup.
 */
export function usePageIntro(scopeRef, cfg, extra) {
  const { ready } = useApp()
  const readyRef = useRef(ready)
  const tlRef = useRef(null)
  readyRef.current = ready

  useGsap(scopeRef, (ctx) => {
    const root = scopeRef.current
    const tl = buildPageIntro(root, typeof cfg === 'function' ? cfg(ctx) : cfg)
    tlRef.current = tl
    if (readyRef.current) tl.play()
    const cleanup = extra?.(root, ctx)
    return () => {
      tlRef.current = null
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    if (ready) tlRef.current?.play()
  }, [ready])
}
