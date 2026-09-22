/**
 * MENU — real data, imported from the restaurant's Doresto page.
 *
 *   npm run menu:import      re-reads https://www.doresto.com/restaurant/afrish-petals
 *                            and rewrites src/data/menu.raw.json (text only — no photos)
 *
 * This file turns that raw list into what the website shows. Nothing here is invented:
 * names, descriptions and prices are the platform's; we only tidy capitalisation and group
 * the platform's 19 menu sections into three easy-to-browse tabs.
 *
 * Prices are those shown on the default branch of the platform page (currency: RWF).
 */
import raw from './menu.raw.json'
import { restaurant } from './restaurant.js'

export const MENU_URL = restaurant.menuUrl
export const menuSource = { url: MENU_URL, importedAt: raw.importedAt, total: raw.dishes.length }
export const CURRENCY = 'RWF'

/** Entries in the platform that are not dishes (internal items) — never shown publicly. */
const EXCLUDE = /^(refer|booking place)$/i

/** ALL CAPS → Title Case, all-lowercase → capital first letter. Spelling is left exactly as entered. */
export function tidyName(input) {
  const s = String(input).replace(/\s+/g, ' ').trim()
  const letters = s.replace(/[^A-Za-z]/g, '')
  if (letters.length > 1 && letters === letters.toUpperCase()) {
    return s.toLowerCase().replace(/(^|[\s/(-])([a-z])/g, (_, a, b) => a + b.toUpperCase())
  }
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** platform section → display title and tab */
const SECTION_TITLES = {
  FastFood: 'Fast Food',
  Snacks: 'Snacks',
  Salad: 'Salads',
  Buffet: 'Buffet',
  Boillon: 'Bouillon',
  Fruits: 'Fruits',
  Dessert: 'Desserts',
  FreshDrinks: 'Fresh Drinks',
  Juice: 'Juices',
  Smoothies: 'Smoothies',
  'Milk Shakes': 'Milkshakes',
  Mojitos: 'Mojitos',
  'Iced Drinks': 'Iced Drinks',
  'Special Drinks': 'Special Drinks',
  Baverage: 'Beverages',
  Water: 'Water',
  Coffee: 'Coffee',
  'Iced Coffee': 'Iced Coffee',
  Tea: 'Tea',
}

const GROUPS = [
  {
    id: 'kitchen',
    label: 'Kitchen',
    blurb: 'Plates, snacks, salads and more from our kitchen.',
    image: 'menu.kitchen',
    sections: ['FastFood', 'Snacks', 'Salad', 'Buffet', 'Boillon', 'Fruits', 'Dessert'],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    blurb: 'Fresh drinks, juices, smoothies, milkshakes and mojitos.',
    image: 'menu.drinks',
    sections: ['FreshDrinks', 'Juice', 'Smoothies', 'Milk Shakes', 'Mojitos', 'Iced Drinks', 'Special Drinks', 'Baverage', 'Water'],
  },
  {
    id: 'coffee',
    label: 'Coffee & Tea',
    blurb: 'Coffee, iced coffee and tea.',
    image: 'menu.coffee',
    sections: ['Coffee', 'Iced Coffee', 'Tea'],
  },
]

const dishes = raw.dishes
  .filter((d) => d.name && !EXCLUDE.test(d.name.trim()))
  .map((d) => ({ id: d.id, name: tidyName(d.name), desc: d.desc || '', price: d.price ?? null, section: d.section }))

export const menuGroups = GROUPS.map((g) => {
  const sections = g.sections
    .map((key) => ({ id: key.toLowerCase().replace(/\W+/g, '-'), title: SECTION_TITLES[key] || key, items: dishes.filter((d) => d.section === key) }))
    .filter((s) => s.items.length)
  return { ...g, sections, count: sections.reduce((n, s) => n + s.items.length, 0) }
})

/** Flat list for search: every dish with where it lives. */
export const allDishes = menuGroups.flatMap((g) => g.sections.flatMap((s) => s.items.map((d) => ({ ...d, group: g.label, groupId: g.id, sectionTitle: s.title }))))

export const formatPrice = (n, currency = CURRENCY) => `${new Intl.NumberFormat('en-US').format(n)} ${currency}`

/* ────────────────────────────────────────────────────────────────────────────
   Signature dishes — NOT populated. The platform has an "Afrish Specialities" category
   but it cannot be read reliably from the public page. When the restaurant tells us its
   signature dishes, add them here (name, desc, price, image) and set launch.signatures = true.
   ──────────────────────────────────────────────────────────────────────────── */
export const signatures = [
  {
    id: 'sig-1',
    category: 'Grill',
    name: 'Sample Signature Grill',
    desc: 'A placeholder description for the dominant dish.',
    price: 26000,
    image: 'dishes.grill',
    support: 'dishes.steak',
  },
  {
    id: 'sig-2',
    category: 'Main Course',
    name: 'Sample Signature Stew',
    desc: 'A placeholder description for the second dish.',
    price: 18000,
    image: 'dishes.stew',
    support: 'dishes.fish',
  },
  {
    id: 'sig-3',
    category: 'Main Course',
    name: 'Sample Signature Steak',
    desc: 'A placeholder description for the third dish.',
    price: 24000,
    image: 'dishes.steak',
    support: 'dishes.grill',
  },
  {
    id: 'sig-4',
    category: 'From the Sea',
    name: 'Sample Signature Fish',
    desc: 'A placeholder description for the fourth dish.',
    price: 22000,
    image: 'dishes.fish',
    support: 'dishes.stew',
  },
]
