import { SITE, pages, notFound } from '../data/seo.js'

const abs = (path) => `${SITE.url}${path === '/' ? '/' : path}`

/** Create-or-update a <meta>/<link> in <head>. */
function upsert(tag, attrs, match) {
  let el = document.head.querySelector(match)
  if (!el) {
    el = document.createElement(tag)
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

/**
 * Applies per-route metadata on client-side navigation. The first HTML response
 * already carries the home page's tags (injected at build by vite.config.js), so
 * crawlers that don't run JavaScript still get correct basics; this keeps the tab
 * title, canonical and share tags right as visitors move between pages.
 */
export function applySeo(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const page = pages[clean]
  const meta = page || notFound
  const url = abs(page ? clean : pathname)
  const image = `${SITE.url}${SITE.ogImage}`

  document.title = meta.title
  upsert('meta', { name: 'description', content: meta.description }, 'meta[name="description"]')
  if (meta.keywords) upsert('meta', { name: 'keywords', content: meta.keywords.join(', ') }, 'meta[name="keywords"]')
  else document.head.querySelector('meta[name="keywords"]')?.remove()
  upsert('meta', { name: 'robots', content: page ? 'index, follow, max-image-preview:large' : 'noindex, follow' }, 'meta[name="robots"]')
  upsert('link', { rel: 'canonical', href: url }, 'link[rel="canonical"]')

  upsert('meta', { property: 'og:title', content: meta.title }, 'meta[property="og:title"]')
  upsert('meta', { property: 'og:description', content: meta.description }, 'meta[property="og:description"]')
  upsert('meta', { property: 'og:url', content: url }, 'meta[property="og:url"]')
  upsert('meta', { property: 'og:image', content: image }, 'meta[property="og:image"]')
  upsert('meta', { name: 'twitter:title', content: meta.title }, 'meta[name="twitter:title"]')
  upsert('meta', { name: 'twitter:description', content: meta.description }, 'meta[name="twitter:description"]')
  upsert('meta', { name: 'twitter:image', content: image }, 'meta[name="twitter:image"]')
}
