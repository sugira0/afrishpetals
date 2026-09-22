/**
 * IMAGE CONFIGURATION — the single place to swap in real Afrish Petals photography.
 *
 * Every component references images by KEY (e.g. <Img name="hero.plate1" />).
 * To replace a placeholder:
 *
 *   1. Drop your file in /public/images  (e.g. /public/images/hero-plate-1.webp)
 *   2. Change the entry below from  photo('…unsplash id…')  to  local('hero-plate-1.webp')
 *
 * Nothing in /src/components needs to change.
 *
 * `local()` expects an optional responsive set: name-640.webp, name-1280.webp, name-1920.webp.
 * If you only have one file, pass a single width and it is served as-is.
 *
 * ⚠ Current entries are royalty-free stock PLACEHOLDERS (Unsplash licence, free for commercial use).
 *   They are NOT photographs of Afrish Petals' food or rooms. Replace at least the hero, story,
 *   experience and event images with the restaurant's own photography before promoting the site.
 */

// Stock placeholders are served from this site (public/images/stock) — no third-party requests.
// They were fetched by scripts/localize-images.mjs. Delete the folder once you use your own photos.
const STOCK = '/images/stock'
const WIDTHS = [480, 800, 1200, 1800]

/** Local stock placeholder with a responsive WebP srcset. */
const photo = (id, { w, h, alt, pos = 'center' }) => ({
  src: `${STOCK}/${id}-1200.webp`,
  srcSet: WIDTHS.map((n) => `${STOCK}/${id}-${n}.webp ${n}w`).join(', '),
  width: w,
  height: h,
  alt,
  pos,
})

/** Local, self-hosted asset in /public/images. */
// eslint-disable-next-line no-unused-vars
const local = (file, { w, h, alt, pos = 'center', widths } = {}) => {
  const base = `/images/${file}`
  const dot = base.lastIndexOf('.')
  const stem = base.slice(0, dot)
  const ext = base.slice(dot)
  return {
    src: base,
    srcSet: widths ? widths.map((n) => `${stem}-${n}${ext} ${n}w`).join(', ') : undefined,
    width: w,
    height: h,
    alt,
    pos,
  }
}

export const images = {
  hero: {
    plate1: photo('1504674900247-0877df9cc836', { w: 1200, h: 1200, alt: 'Seared beef with fresh herbs, chilli and cashews, photographed from above' }),
    plate2: photo('1559847844-5315695dadae', { w: 1200, h: 1200, alt: 'Rich stew with prawns served over rice in an enamel bowl' }),
    plate3: photo('1529042410759-befb1204b468', { w: 1200, h: 1200, alt: 'Grilled spiced meatballs on fresh greens' }),
    plate4: photo('1540189549336-e6e99c3679fe', { w: 1200, h: 1200, alt: 'Garden salad on a dark plate with a citrus garnish' }),
  },
  story: {
    room: photo('1517248135467-4c7edcad34c4', { w: 1200, h: 1500, alt: 'A warmly lit restaurant dining room with timber and dark tones', pos: '40% 50%' }),
    guest: photo('1533777857889-4be7c70b33f7', { w: 1200, h: 1500, alt: 'A guest enjoying a meal in a warmly lit restaurant', pos: '65% 40%' }),
    dish: photo('1555939594-58d7cb561ad1', { w: 1200, h: 900, alt: 'A shared platter of grilled meats, vegetables and sauces' }),
  },
  dishes: {
    grill: photo('1555939594-58d7cb561ad1', { w: 1400, h: 1400, alt: 'Mixed grill platter with skewers, roasted vegetables and dips' }),
    stew: photo('1559847844-5315695dadae', { w: 1400, h: 1400, alt: 'Prawn stew over rice in an enamel bowl' }),
    steak: photo('1600891964092-4316c288032e', { w: 1400, h: 1400, alt: 'Grilled steak with crisp fries and herbs' }),
    fish: photo('1519708227418-c8fd9a32b7a2', { w: 1400, h: 1400, alt: 'Pan-seared salmon with greens and lime on a dark plate' }),
  },
  // Atmosphere shots for the Menu tabs — deliberately NOT specific dishes, so they never misrepresent the menu.
  menu: {
    kitchen: photo('1551218808-94e220e084d2', { w: 1400, h: 1750, alt: 'A chef’s hands chopping fresh herbs and vegetables' }),
    drinks: photo('1470337458703-46ad1756a187', { w: 1400, h: 1750, alt: 'A cocktail being poured over ice' }),
    coffee: photo('1541167760496-1628856ab772', { w: 1400, h: 1750, alt: 'Milk being poured into a cup of coffee' }),
  },
  experience: {
    ingredients: photo('1551218808-94e220e084d2', { w: 1400, h: 1800, alt: 'A chef’s hands chopping fresh herbs and vegetables' }),
    ambience: photo('1550966871-3ed3cdb5ed0c', { w: 1400, h: 1800, alt: 'Warm, intimate restaurant interior' }),
    events: photo('1414235077428-338989a2e8c0', { w: 1400, h: 1800, alt: 'A candlelit table set for a private dinner' }),
    live: photo('1528605248644-14dd04022da1', { w: 1400, h: 1800, alt: 'Friends sharing dishes across a long table' }),
  },
  gallery: [
    { key: 'g1', ...photo('1414235077428-338989a2e8c0', { w: 1400, h: 1000, alt: 'A plated dish on a candlelit table' }), caption: 'The table, set' },
    { key: 'g2', ...photo('1544025162-d76694265947', { w: 1000, h: 1300, alt: 'Slow-cooked ribs on a wooden board' }), caption: 'Slow fire' },
    { key: 'g3', ...photo('1470337458703-46ad1756a187', { w: 1000, h: 1300, alt: 'Cocktail being poured over ice' }), caption: 'The pour' },
    { key: 'g4', ...photo('1517248135467-4c7edcad34c4', { w: 1400, h: 1000, alt: 'The dining room' }), caption: 'The room' },
    { key: 'g5', ...photo('1551218808-94e220e084d2', { w: 1000, h: 1300, alt: 'Chef preparing fresh vegetables' }), caption: 'Prepared by hand' },
    { key: 'g6', ...photo('1559847844-5315695dadae', { w: 1000, h: 1000, alt: 'Prawn stew over rice' }), caption: 'From the pot' },
    { key: 'g7', ...photo('1528605248644-14dd04022da1', { w: 1400, h: 1000, alt: 'Guests sharing a long table' }), caption: 'Together' },
    { key: 'g8', ...photo('1533777857889-4be7c70b33f7', { w: 1000, h: 1300, alt: 'A guest enjoying a meal' }), caption: 'A quiet moment' },
    { key: 'g9', ...photo('1567620905732-2d1ec7ab7445', { w: 1000, h: 1300, alt: 'Golden pancakes with syrup' }), caption: 'Something sweet' },
  ],
  contact: {
    hero: photo('1543007630-9710e4a00a20', { w: 1600, h: 1200, alt: 'A warmly lit bar with rows of pendant lights and glassware', pos: '50% 40%' }),
    room: photo('1550966871-3ed3cdb5ed0c', { w: 1200, h: 1500, alt: 'Warm, intimate restaurant interior' }),
  },
  events: {
    candle: photo('1414235077428-338989a2e8c0', { w: 1600, h: 1200, alt: 'A candlelit table with a plated dish and glassware', pos: '50% 55%' }),
    toast: photo('1519671482749-fd09be7ccebf', { w: 1200, h: 1500, alt: 'Guests raising glasses of wine in a toast', pos: '50% 40%' }),
    longTable: photo('1511795409834-ef04bbd61622', { w: 1400, h: 1000, alt: 'A long celebration table dressed with flowers and glassware' }),
    gathering: photo('1517457373958-b7bdd4587205', { w: 1400, h: 1000, alt: 'Friends laughing together at an evening gathering under string lights' }),
    bar: photo('1543007630-9710e4a00a20', { w: 1600, h: 1200, alt: 'A warmly lit bar with rows of pendant lights', pos: '50% 40%' }),
    decor: photo('1519225421980-715cb0215aed', { w: 1400, h: 1000, alt: 'A long table set with wildflowers and linen' }),
  },
  cta: {
    table: photo('1414235077428-338989a2e8c0', { w: 2000, h: 1300, alt: 'A candlelit restaurant table with glassware', pos: '50% 55%' }),
  },
}
