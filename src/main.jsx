import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Self-hosted fonts (no third-party requests). Files are only fetched for the glyphs a page actually uses.
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import 'lenis/dist/lenis.css'
import './styles/index.css'
import './styles/ui.css'
import App from './App.jsx'
import { getImage } from './hooks/useImages.js'

// Preload only the single most important asset for the landing route: the first hero plate.
if (location.pathname === '/') {
  const hero = getImage('hero.plate1')
  if (hero) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = hero.src
    if (hero.srcSet) {
      link.setAttribute('imagesrcset', hero.srcSet)
      link.setAttribute('imagesizes', '(min-width: 1024px) 45vw, 90vw')
    }
    link.fetchPriority = 'high'
    document.head.appendChild(link)
  }
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
