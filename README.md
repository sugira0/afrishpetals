# Restaurant Services Website

Premium mobile-first restaurant services website with event proposal flow and QR generator page.

## Files

- `index.html`: Main customer-facing services page.
- `booking.html`: Table and event booking form page.
- `styles.css`: Full website styling.
- `app.js`: Frontend interactions, sliders, and form submission logic.
- `server.js`: Backend API for contact and booking submission delivery.
- `.env.example`: SMTP configuration template.
- `menu.json`: Editable content (restaurant details, services, testimonials, venue info, map).
- `assets/images/`: Local optimized visual assets.
- `assets/logos/`: Local client logo assets.
- `qr.html`: Generates a QR code that points to your live website URL.

## Run locally

Install dependencies and run the backend server (this enables Contact + Booking delivery):

```powershell
cd c:\Users\HP\Documents\Restaurant
npm install
npm start
```

Optional email setup:

1. Copy `.env.example` to `.env`
2. Set SMTP values (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`)
3. Set `MAIL_TO` to the restaurant inbox

If SMTP is not configured, submissions are still saved locally in `submissions.log` and frontend opens a WhatsApp fallback.

Open:

- Website: `http://localhost:8080/index.html`
- Booking: `http://localhost:8080/booking.html`
- Contact: `http://localhost:8080/contact.html`
- QR tool: `http://localhost:8080/qr.html`

## Customize your website

Edit `menu.json`:

- Update restaurant info under `restaurant`.
- Add/remove categories in `categories`.
- Add/remove service cards in each category.
- Update trust section under `trust`.
- Update capacity, package inclusions, add-ons, and policy under `venueDetails`.
- Update map URL under `map`.

## Publish so customers can scan

Host with a Node runtime (required for form APIs), for example:

- Render
- Railway
- VPS / Docker / PM2

After publishing, copy the public URL of `index.html` and paste it into `qr.html` to generate your print QR.
