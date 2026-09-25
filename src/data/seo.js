/**
 * SEO — the single source of truth.
 *
 * This file drives (see vite.config.js → seoPlugin and src/lib/seo.js):
 *   • /sitemap.xml and /robots.txt      (generated at build, served in dev)
 *   • <title>, meta description, canonical, Open Graph + Twitter tags
 *   • JSON-LD structured data (Restaurant) — built only from data/restaurant.js facts
 *
 * To add a page: add a route in App.jsx and one entry in `pages` below. Done.
 * Plain ES module with no imports of its own so Node (the build) can load it.
 */

export const SITE = {
  /** Production origin — no trailing slash. Change if the domain ever changes. */
  url: 'https://www.afrishpetals.rw',
  name: 'Afrish Petals',
  locale: 'en_RW',
  /** 1200×630 share image in /public (regenerate with scripts/make-og-image.py). */
  ogImage: '/og-image.png',
  ogImageAlt: 'Afrish Petals — premium African restaurant in Kigali, Rwanda',
}

/**
 * One entry per indexable URL.
 *   title        ≤ ~60 characters
 *   description  ≤ ~155 characters
 *   keywords     a handful of phrases, comma-joined into <meta name="keywords">. Google has ignored
 *                this tag for ranking since 2009 — it does nothing there. It costs nothing to include
 *                (Bing/Yandex give it a very small weight), but it is NOT what makes a page rank; the
 *                title, description and the page's own visible text are what matter. Kept short and
 *                honest — real phrases a guest would actually search, not a stuffed list.
 */
export const pages = {
  '/': {
    title: 'Afrish Petals — Best Restaurant in Kigali, Rwanda',
    description:
      'One of the best restaurants in Kigali, Rwanda. Afrish Petals is a premium African dining experience near Norrsken. Crafted with passion, served with love.',
    keywords: [
      'best restaurant in Kigali',
      'restaurant near Norrsken',
      'African restaurant Kigali',
      'Afrish Petals',
      'restaurant Kigali Rwanda',
    ],
  },
  '/story': {
    title: 'Our Story — Afrish Petals, African Restaurant in Kigali',
    description:
      'The story behind Afrish Petals: a premium African dining experience in Kigali, crafted with passion and served with love, near Norrsken.',
    keywords: ['Afrish Petals story', 'African restaurant Kigali', 'best restaurant in Kigali'],
  },
  '/events': {
    title: 'Events at Afrish Petals — Celebrations & Gatherings in Kigali',
    description:
      'Gather, celebrate and create memorable moments at Afrish Petals in Kigali. Birthdays, anniversaries, corporate gatherings and private dinners near Norrsken.',
    keywords: ['event venue Kigali', 'private dinner Kigali', 'restaurant near Norrsken', 'birthday venue Kigali'],
  },
  '/contact': {
    title: 'Contact — Afrish Petals, Restaurant Near Norrsken, Kigali',
    description:
      'Find Afrish Petals, a top restaurant in Kigali near Norrsken, at KN 63 St. Call +250 786 948 980, email us, chat on WhatsApp, or send a message.',
    keywords: ['restaurant near Norrsken', 'Afrish Petals location', 'Afrish Petals contact', 'best restaurant in Kigali'],
  },
  '/book': {
    title: 'Reserve a Table — Afrish Petals, Kigali',
    description:
      'Request a table at Afrish Petals in Kigali in four quick steps: choose your date, time and guests, and our team will confirm availability.',
    keywords: ['reserve a table Kigali', 'book a restaurant Kigali', 'best restaurant in Kigali', 'Afrish Petals reservation'],
  },
  '/events/book': {
    title: 'Plan a Private Event — Afrish Petals, Kigali',
    description:
      'Birthdays, anniversaries, corporate and private dinners. Tell Afrish Petals about your event in Kigali and we will help you plan the moment.',
    keywords: ['private event venue Kigali', 'restaurant near Norrsken', 'event venue Kigali'],
  },
  '/privacy': {
    title: 'Privacy Notice — Afrish Petals, Kigali',
    description: 'How Afrish Petals uses the details you share through our contact, reservation and event forms.',
  },
}

/** Shown for unknown URLs. Marked noindex so it never appears in search results. */
export const notFound = {
  title: 'Page not found — Afrish Petals',
  description: 'This page could not be found.',
}
