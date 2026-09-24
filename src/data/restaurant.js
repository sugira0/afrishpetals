/**
 * RESTAURANT DATA
 * Only facts supplied for the brief are filled in. Anything `null` renders as a
 * quiet "to be announced" line in the UI — nothing is invented.
 * Fill these in when real details are available.
 */
export const restaurant = {
  name: 'Afrish Petals',
  tagline: ['Crafted with Passion.', 'Served with Love.'],
  descriptor: 'Premium African Restaurant',
  city: 'Kigali',
  country: 'Rwanda',
  coordinates: '1°56′S  30°04′E',
  website: 'afrishpetals.rw',

  // ── Supplied by the restaurant ──
  /** Full menu + online ordering (Doresto). Used by the "View full menu" buttons. */
  menuUrl: 'https://www.doresto.com/restaurant/afrish-petals',
  phone: '+250 786 948 980',
  whatsapp: '250786948980', // digits only, international format, no "+" (used for wa.me links)
  email: 'afrishpetals@gmail.com',
  address: 'KN 63 St near Norrsken', // originally supplied as "Norssken"; corrected to the Norrsken House spelling — flag if wrong

  // ── Not supplied yet — never invented ──
  /** Founding story as an array of paragraphs. While null the Story section shows two short, factual lines. */
  story: null,
  hours: null, // e.g. [{ days: 'Mon – Thu', time: '12:00 – 22:00' }, …]
  hoursPlaceholder: "Please call or message us on WhatsApp to confirm today's opening hours.",
  social: {
    instagram: null,
    facebook: null,
    tiktok: null,
    x: null,
  },

  /**
   * Map integration. Nothing here is a fake coordinate.
   *  - `embedUrl`: paste a Google Maps "Embed a map" src URL (or any provider's iframe URL)
   *    and the map section becomes a live embed automatically.
   *  - `directionsQuery`: used to build a real "Get directions" link (address search).
   */
  map: {
    embedUrl: null,
    directionsQuery: 'KN 63 St near Norrsken, Kigali, Rwanda',
  },
}

/**
 * Story stats. PLACEHOLDER values — the site flags them as such on screen until
 * `verified` is set to true.
 */
export const stats = {
  verified: false,
  items: [
    { value: 100, suffix: '+', label: 'Signature dishes' },
    { value: 5, suffix: '★', label: 'Guest experience' },
    { value: 100, suffix: '%', label: 'Local ingredients' },
  ],
}

/** `to` is a router path; `section` marks in-page anchors on the home page. */
export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Our Story', to: '/story', section: 'story' },
  { label: 'Menu', to: '/#menu', section: 'menu' },
  { label: 'Experience', to: '/#experience', section: 'experience' },
  { label: 'Gallery', to: '/#gallery', section: 'gallery', requires: 'gallery' },
  { label: 'Contact', to: '/contact' },
]

export const experiencePanels = [
  {
    id: 'ingredients',
    index: '01',
    title: 'Fresh Ingredients',
    text: 'Fresh, carefully chosen ingredients at the heart of every plate.',
    image: 'experience.ingredients',
  },
  {
    id: 'ambience',
    index: '02',
    title: 'Cozy Ambience',
    text: 'A warm, welcoming room made for lingering a little longer.',
    image: 'experience.ambience',
  },
  {
    id: 'events',
    index: '03',
    title: 'Private Events',
    text: 'Birthdays, anniversaries and celebrations, planned together with our team.',
    image: 'experience.events',
  },
  {
    id: 'live',
    index: '04',
    title: 'Live Moments',
    text: 'The energy of a shared table and an evening well spent.',
    image: 'experience.live',
  },
]

/** SAMPLE testimonials — replace with real guest words (with permission). */
export const testimonials = {
  sample: true,
  items: [
    {
      quote: 'A sample line for a guest to say about the food, the room and the way the evening felt.',
      name: 'Guest name',
      context: 'Dinner for two',
    },
    {
      quote: 'A second sample quote, placed here so the layout can be judged with real-length copy.',
      name: 'Guest name',
      context: 'Private celebration',
    },
    {
      quote: 'A third sample quote. Swap all of these in data/restaurant.js once real reviews are approved.',
      name: 'Guest name',
      context: 'Weekend lunch',
    },
  ],
}
