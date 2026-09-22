/**
 * PUBLISH SWITCHES — what is allowed to appear ANYWHERE, including `npm run dev`.
 *
 * A section whose switch is `false` is never rendered — not on the live site, and not while
 * developing either: the site never shows sample menus, made-up prices, fake reviews, unverified
 * numbers or placeholder dish names to anyone who opens it, reviewer included.
 *
 * Flip a switch to `true` only when the matching data file holds REAL, approved content:
 *
 *   menu          data/menu.js  → imported from Doresto (`npm run menu:import`)  ✔ real
 *   signatures    data/menu.js  → `signatures`    (real signature dishes)
 *   testimonials  data/restaurant.js → `testimonials.items` (real guest quotes, with permission)
 *   stats         data/restaurant.js → `stats.items`         (real, checkable numbers)
 *   gallery       data/images.js → `images.gallery`          (the restaurant's OWN photographs)
 *
 * `npm run launch:check` lists everything that is still outstanding.
 *
 * To preview a section's layout with its current (sample) data before the real content arrives,
 * flip its switch to `true` locally, look, then flip it back — never commit or deploy it that way.
 */
export const launch = {
  menu: true, // real menu imported from the restaurant's Doresto page (data/menu.js)
  signatures: false,
  testimonials: false,
  stats: false,
  gallery: false,
}

/** True in the production build, false in `vite dev`. (Guarded so plain Node can import this file.) */
export const IS_LIVE = Boolean(import.meta.env?.PROD)

/** Should this section render? Only once its switch is explicitly on — dev included. */
export const published = (key) => launch[key] === true

/** Dev-only annotations ("Sample menu — replace…"), for when a switch is on with sample data still in it. */
export const SHOW_NOTES = !IS_LIVE
