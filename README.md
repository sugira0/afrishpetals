# Afrish Petals — website

React + Vite + Tailwind v4 · GSAP / ScrollTrigger · Lenis · Framer Motion · React Router · Vercel.

```bash
npm install
npm run dev            # http://localhost:5173  — same rule as production: nothing unpublished is shown
npm run build          # production build → dist/
npm run preview        # serve the production build locally
npm run launch:check   # plain-English list of what is still outstanding before going live
```

**Going live?** Read [LAUNCH.md](LAUNCH.md) — step-by-step (content, email, Vercel, domain, Search Console).

## Nothing fake reaches anyone — not even in dev

`src/data/launch.js` holds one switch per section that would otherwise show made-up content
(`menu`, `signatures`, `testimonials`, `stats`, `gallery`). A section is shown — **in `npm run dev` and in the
production build alike** — only when its switch is `true`, which you set once the real content is in the matching
data file. Until then, nobody (including you, reviewing locally) sees sample dish names, invented prices, fake
reviews or unverified numbers. Until then visitors see:

| Section | Live site shows |
| --- | --- |
| Menu | **the real menu** (266 dishes, imported from Doresto — see below). If the switch is turned off it falls back to "Our menu is being finalised" + WhatsApp |
| Signature dishes, guest reviews, story numbers, gallery | not shown (and the Gallery nav link is hidden) |
| Opening hours | "Please call or message us on WhatsApp to confirm today's opening hours." |
| Founding story | two short, factual lines |
| Reservation time | a plain time field (no invented time slots) |

Want to preview a hidden section's layout before the real content arrives? Flip its switch to `true` in
`src/data/launch.js` locally, look, then flip it back — never commit or deploy it that way.

## The menu (imported from Doresto)

`npm run menu:import` opens the restaurant's public page (`restaurant.menuUrl`) in headless Chrome, scrolls until all
dishes have loaded, and saves **text only** (name, description, price, section) to `src/data/menu.raw.json`.
The website never calls Doresto while running — re-run the command whenever the menu changes there, then rebuild.
Internal entries ("Refer", "Booking Place") are filtered out; ALL-CAPS / all-lowercase names are tidied; spelling is
left exactly as entered on Doresto, so fix typos at the source and re-import.

> The dish **photos** on Doresto are web images carrying other sites' watermarks. They are deliberately **not**
> imported or used (copyright). The Menu tabs use neutral atmosphere photos instead.

**"View full menu" pop-up** (`src/components/MenuPopup`): appears 2 s after the intro and gives a soft pop every 2 s
(`POPUP` at the top of the file; set `repeatMs: null` for a single appearance). It pauses on hover, can be closed
(remembered for the session), never pops for reduced-motion visitors, and is hidden on the booking pages.

## Where content lives

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, hours, socials, story, map, reviews, stats | `src/data/restaurant.js` |
| Menu | **imported** from the restaurant's Doresto page: `npm run menu:import` → `src/data/menu.raw.json` (text only). `src/data/menu.js` groups it into tabs |
| Signature dishes | `src/data/menu.js` → `signatures` (not populated yet) |
| Photography (every image) | `src/data/images.js` — use `local('file.webp', …)`, files go in `public/images/` |
| Reservation limits / time slots | `src/data/booking.js` |
| Event types, dayparts, requirements | `src/data/events.js` — **delete anything the restaurant doesn't offer** |
| WhatsApp wording per page | `src/data/whatsapp.js` |
| Domain, page titles + descriptions (SEO) | `src/data/seo.js` |

Current photos are royalty-free stock (Unsplash licence) served from `public/images/stock` — **not** photos of the
restaurant. Replace them with the restaurant's own before promoting the site.

## Forms

Contact, reservation and event forms post to **`/api/submit`** (`api/submit.js`, a Vercel function) which emails each
request to the restaurant through [Resend](https://resend.com). Set `RESEND_API_KEY` (see `.env.example` and LAUNCH.md).
Without it the site says so honestly and hands the guest a prefilled WhatsApp / email message instead — it never claims
a request was sent when it wasn't. Nothing is ever "confirmed" automatically: reservations and events are *requests*.

## Structure

```
api/            submit.js — form → email (serverless)
scripts/        seo-plugin (sitemap, robots, meta, JSON-LD) · launch-check · make-og-image · make-icons
                make-white-logo · localize-images
src/
  pages/        Home · Contact · Booking · EventBooking · Privacy · NotFound   (lazy route chunks)
  data/         restaurant · launch · menu · images · booking · events · whatsapp · seo · nav · gallery
  animations/   gsap · pageReveal · textReveal · imageReveal · parallax · magneticButton · smoothScroll · heroAnimations
  hooks/        useGsap · usePageIntro · useStepForm · useLenis · useApp
  components/   Navbar · Hero · Story · SignatureDishes · Menu · Experience · Gallery · Testimonials · ReservationCTA
                Footer · Preloader · WhatsAppButton · ContactForm · BookingForm · EventBookingForm · forms · Map · ui
  services/     forms.js — client side of the form endpoint
  lib/          validators · messages · seo
```

Routes: `/`, `/contact`, `/book`, `/events/book`, `/privacy` (+ a `noindex` 404). Pinned / horizontal scenes only run at
≥1024 px with motion allowed; phones and `prefers-reduced-motion` get calm, stacked layouts.

## SEO

`src/data/seo.js` drives `/sitemap.xml`, `/robots.txt`, per-page title / description / canonical / Open Graph / Twitter
tags and JSON-LD (Restaurant + WebSite, built only from supplied facts). New page → add the route and one entry in `seo.js`.

## Logo & icons

`public/images/logo.png` (original colours) and `logo-white.png` (for dark backgrounds, generated by
`python scripts/make-white-logo.py`). Regenerate app icons with `python scripts/make-icons.py` and the share image with
`python scripts/make-og-image.py`.
