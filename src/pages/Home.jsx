import { lazy, Suspense, useEffect } from 'react'
import { useApp } from '../hooks/useApp.jsx'
import Hero from '../components/Hero/Hero.jsx'

// Everything below the fold is a separate chunk — the first paint only ships the hero.
const Sections = lazy(() => import('../components/Sections.jsx'))

/** HOME — the cinematic brand introduction. */
export default function Home() {
  const { ready, setSectionsReady } = useApp()
  // leaving home: its sections unmount, so nav anchors must stop tracking them
  useEffect(() => () => setSectionsReady(false), [setSectionsReady])
  return (
    <>
      <Hero ready={ready} />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Sections onReady={() => setSectionsReady(true)} />
      </Suspense>
    </>
  )
}
