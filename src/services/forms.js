/**
 * FORM SUBMISSION
 * ───────────────
 * Contact messages, table reservations and event inquiries all go through
 * `sendForm(kind, payload)`.
 *
 * In production the target is our own serverless function, /api/submit (see /api/submit.js),
 * which emails the request to the restaurant. It needs RESEND_API_KEY set on the host.
 *
 * Overrides (optional, .env): VITE_FORM_ENDPOINT — or per form VITE_CONTACT_ENDPOINT,
 * VITE_RESERVATION_ENDPOINT, VITE_EVENT_ENDPOINT — to send to Formspree / Make / Zapier / your own API instead.
 * The JSON payload always contains `type: 'contact' | 'reservation' | 'event'`.
 *
 * If nothing is reachable or configured (local dev, or the key isn't set yet) the result is
 * `{ ok: false, reason: 'not-connected' }` and the UI says so honestly, offering a prefilled
 * WhatsApp / email hand-off. A guest is never told a request was sent when it wasn't.
 */
const env = import.meta.env
const DEFAULT_ENDPOINT = env.PROD ? '/api/submit' : undefined
const ENDPOINTS = {
  contact: env.VITE_CONTACT_ENDPOINT || env.VITE_FORM_ENDPOINT || DEFAULT_ENDPOINT,
  reservation: env.VITE_RESERVATION_ENDPOINT || env.VITE_FORM_ENDPOINT || DEFAULT_ENDPOINT,
  event: env.VITE_EVENT_ENDPOINT || env.VITE_FORM_ENDPOINT || DEFAULT_ENDPOINT,
}

/** When this page load started — sent as `elapsed` so the server can drop instant bot posts. */
const loadedAt = Date.now()

export const isConnected = (kind) => Boolean(ENDPOINTS[kind])

export async function sendForm(kind, payload) {
  const url = ENDPOINTS[kind]
  if (!url) return { ok: false, reason: 'not-connected' }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ type: kind, ...payload, elapsed: Date.now() - loadedAt, source: 'afrishpetals.rw' }),
    })
    if (res.ok) return { ok: true }
    // 503 = our function without RESEND_API_KEY; 404/405 = host without functions → same honest fallback
    if ([404, 405, 501, 503].includes(res.status)) return { ok: false, reason: 'not-connected' }
    return { ok: false, reason: 'server-error' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
