# Launch guide — afrishpetals.rw

Work top to bottom. `npm run launch:check` shows what's still open at any time.

## 1 · Content only the restaurant can supply

| Needed | Where | Effect once done |
| --- | --- | --- |
| ~~Menu~~ ✔ done — imported from Doresto (266 dishes). After editing the menu on Doresto run `npm run menu:import` and redeploy | `src/data/menu.raw.json` | Interactive menu + search |
| **Signature dishes** (3–4 — tell us the names; they need real photos) | `src/data/menu.js` → `signatures` (`launch.signatures = true`) | Adds the scroll-driven showcase |
| **Opening hours** | `src/data/restaurant.js` → `hours: [{ days: 'Mon – Fri', time: '12:00 – 22:00' }, …]` | Shown on Contact + footer instead of "call to confirm" |
| **Reservation time slots** (optional) | `src/data/booking.js` → `timeSlots` | Guests tap a slot instead of typing a time |
| **Founding story** | `src/data/restaurant.js` → `story: ['paragraph', 'paragraph']` | Replaces the two generic lines |
| **Guest reviews** (with permission) | `src/data/restaurant.js` → `testimonials.items` (`launch.testimonials = true`) | Adds the quotes section |
| **Real numbers** (only if checkable) | `src/data/restaurant.js` → `stats.items` (`launch.stats = true`) | Shows the counters in Story |
| **Own photography** — hero dishes, room, team, events | `src/data/images.js` (`local('file.webp', …)`; files in `public/images/`) | Removes the stock photos. Then `launch.gallery = true` |
| **Social links** | `src/data/restaurant.js` → `social` | Appear in the footer |
| **Event requirements** | `src/data/events.js` → `services` | Keep only what is really offered |
| ~~Confirm "Norssken" spelling~~ ✔ corrected to "Norrsken" | `src/data/restaurant.js` → `address` | Matches how people actually search for it |

Photo tips: JPG/WebP, at least 1800 px wide for hero shots; keep dishes bright and natural.

## 2 · Make the forms deliver email (Resend)

1. Create an account at <https://resend.com>.
2. **Domains → Add domain → `afrishpetals.rw`**, add the DNS records it shows (SPF/DKIM) at your domain registrar, wait for "Verified".
3. **API Keys → Create** (sending access). Copy the key.
4. In Vercel (step 3) set environment variables:
   - `RESEND_API_KEY` = the key
   - `FORMS_TO_EMAIL` = `afrishpetals@gmail.com` (or whoever should receive requests)
   - `FORMS_FROM_EMAIL` = `Afrish Petals <bookings@afrishpetals.rw>`
5. Redeploy. Until the key exists, guests get the WhatsApp/email hand-off — never a false "sent".

## 3 · Deploy to Vercel

```bash
npm install
npm run build            # must succeed locally first
npx vercel               # first time: log in, link the project, accept defaults (Framework: Vite, output: dist)
npx vercel --prod        # publish
```

or push the folder to GitHub and *Import Project* in Vercel (Build command `npm run build`, Output `dist`).
`vercel.json` already sets security headers, caching and the single-page-app rewrites; `api/submit.js` deploys as a function.

## 4 · Connect the domain `afrishpetals.rw`

Vercel → Project → **Settings → Domains → Add `afrishpetals.rw`** (and `www.afrishpetals.rw`), then at the registrar
(.rw domains are managed through your registrar / RICTA reseller) set the DNS exactly as Vercel displays
(typically an **A record → 76.76.21.21** for the apex and a **CNAME `www` → cname.vercel-dns.com**). HTTPS is automatic.
If the site will live on a different domain, change `SITE.url` in `src/data/seo.js` **before** building.

## 5 · After it is live (15 minutes)

- [ ] Open every page on a real phone and a laptop: `/`, `/contact`, `/book`, `/events/book`, `/privacy`.
- [ ] Submit a real test through **each** form; confirm the email arrives and *Reply* goes to the guest.
- [ ] Tap the WhatsApp button on each page: the message should be prefilled and reach +250 786 948 980.
- [ ] Paste the URL into WhatsApp/Facebook to check the share card (logo + "Premium African Restaurant").
- [ ] **Google Search Console** → add the property → submit `https://afrishpetals.rw/sitemap.xml`. Same in Bing Webmaster Tools.
- [ ] Create / claim the **Google Business Profile**, spelling the address "near Norrsken" exactly as on the site — this is what actually wins "best restaurant in Kigali" / "restaurant near Norrsken" searches (see below).
- [ ] Run Lighthouse (Chrome DevTools) on `/` and `/contact` (mobile).

## Ranking for "best restaurant in Kigali" / "restaurant near Norrsken"

What's already done on the site: the title, meta description, `keywords` tag, JSON-LD and real page text (home + Contact)
now use those exact phrases — see `src/data/seo.js`. That's necessary but on its own it will not put Afrish Petals "on
top." Google's `keywords` meta tag has done nothing for ranking since 2009; it costs nothing to include but don't expect
it to move anything. What actually decides who ranks top for a local search like this, roughly in order of impact:

1. **Google Business Profile** — for "best restaurant in Kigali" style searches, Google's local Map Pack (the block of
   three restaurants with stars, shown above the regular results) matters more than the website. Claim/verify it, add
   real photos, real hours, the phone number and the site link, keep the address spelled exactly the same everywhere
   (site, profile, any signage) as **"KN 63 St near Norrsken"**, and pick "African restaurant" as the category.
2. **Reviews** — the single biggest factor in that Map Pack ranking. Encourage guests to leave a Google review; reply to
   every one. There is no shortcut for this and the site cannot manufacture it — see `data/launch.js`, which is exactly
   why fake reviews were never added here.
3. **Backlinks** — other real websites (Doresto's own listing, a food blog, an event partner, a press mention) linking to
   `afrishpetals.rw` with the word "restaurant" or "Kigali" nearby. Directory listings (TripAdvisor, local Rwanda
   business directories) count too.
4. **Consistent NAP** (Name, Address, Phone) everywhere the business is listed — mismatched spellings of "Norrsken"
   across the internet actively work against this.
5. **Site speed and mobile usability** — already strong here (see the Lighthouse step above); this is a tie-breaker, not
   a primary driver.

## 6 · Later changes

- Menu / hours / photos: edit the data files above, `npm run build`, `npx vercel --prod`.
- Adding analytics or cookies? Update `src/pages/Privacy.jsx` first (it currently says there are none).
- Backups: keep this folder in Git (`.gitignore` already excludes `node_modules`, `dist`, `.env`). **Never commit `.env`.**
