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

Optional email setup (choose one):

1. SMTP backend delivery
2. Copy `.env.example` to `.env`
3. Set SMTP values (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`)
4. Set `MAIL_TO` to the restaurant inbox

OR

1. EmailJS delivery for Contact + Booking pages
2. Open `contact.html` and set `data-emailjs-public-key` on `#contact-form`
3. Keep `data-emailjs-service-id` + `data-emailjs-template-id` on each form (already prefilled in this project)
4. Booking page automatically reuses the Contact page public key if booking key is not set

If EmailJS is not configured or fails, the site falls back to backend API delivery. If backend delivery also fails, frontend opens a WhatsApp fallback.

Suggested EmailJS variables for Booking template (if you later create a dedicated booking template):

- `booking_type` or `bookingType`
- `customer_name` or `name`
- `phone`
- `email`
- `booking_date` or `date`
- `booking_time` or `time`
- `guests`
- `preferred_space` or `space`
- `table_preference` or `tablePreference`
- `event_type` or `eventType`
- `budget`
- `special_requests` or `message`

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
