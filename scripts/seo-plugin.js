import { SITE, pages } from '../src/data/seo.js'
import { restaurant } from '../src/data/restaurant.js'

/**
 * Vite plugin: everything crawlers read *before* running any JavaScript.
 *
 *   /sitemap.xml   one <url> per entry in data/seo.js `pages`
 *   /robots.txt    allow all + sitemap pointer
 *   <head>         title, description, canonical, Open Graph, Twitter, JSON-LD
 *
 * Served in dev (so you can open /sitemap.xml locally) and emitted into dist/ on build.
 * All content comes from src/data/seo.js and src/data/restaurant.js — nothing to keep in sync here.
 */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const abs = (path) => `${SITE.url}${path}`

export function sitemapXml(lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = Object.keys(pages)
    .map((path) => `  <url>\n    <loc>${esc(abs(path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`
}

/** Structured data — only facts that were actually supplied. No invented hours, ratings or coordinates. */
export function jsonLd() {
  const sameAs = Object.values(restaurant.social || {}).filter(Boolean)
  const home = pages['/']
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        inLanguage: 'en',
      },
      {
        '@type': 'Restaurant',
        '@id': `${SITE.url}/#restaurant`,
        name: SITE.name,
        url: `${SITE.url}/`,
        description: home.description,
        // Self-declared search terms (a business is entitled to describe itself this way) — a hint for
        // engines that read it, not a verified fact. Distinct from e.g. a rating, which we never fabricate.
        ...(home.keywords ? { keywords: home.keywords.join(', ') } : {}),
        image: [abs(SITE.ogImage)],
        logo: abs('/images/logo.png'),
        servesCuisine: 'African',
        telephone: restaurant.phone,
        email: restaurant.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: restaurant.address,
          addressLocality: restaurant.city,
          addressCountry: 'RW',
        },
        areaServed: restaurant.city,
        acceptsReservations: abs('/book'),
        hasMenu: restaurant.menuUrl,
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.map.directionsQuery)}`,
        ...(sameAs.length ? { sameAs } : {}),
      },
    ],
  }
}

function headTags() {
  const home = pages['/']
  const img = abs(SITE.ogImage)
  return [
    `<meta name="description" content="${esc(home.description)}" />`,
    ...(home.keywords ? [`<meta name="keywords" content="${esc(home.keywords.join(', '))}" />`] : []),
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${abs('/')}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${esc(home.title)}" />`,
    `<meta property="og:description" content="${esc(home.description)}" />`,
    `<meta property="og:url" content="${abs('/')}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(SITE.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(home.title)}" />`,
    `<meta name="twitter:description" content="${esc(home.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>`,
  ]
    .map((t) => `    ${t}`)
    .join('\n')
}

export default function seoPlugin() {
  return {
    name: 'afrish-seo',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(pages['/'].title)}</title>`)
          .replace('</head>', `${headTags()}\n  </head>`)
      },
    },

    // dev: open http://localhost:5173/sitemap.xml and /robots.txt
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          return res.end(sitemapXml())
        }
        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end(robotsTxt())
        }
        next()
      })
    },

    // build: emit into dist/
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
    },
  }
}
