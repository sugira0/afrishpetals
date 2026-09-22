/**
 * POST /api/submit — receives the Contact, Reservation and Event forms and emails them
 * to the restaurant (Vercel serverless function; no dependencies, uses Resend's REST API).
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY     required. Create one at https://resend.com
 *   FORMS_TO_EMAIL     where requests are delivered (default: the restaurant email in data/restaurant.js)
 *   FORMS_FROM_EMAIL   sender, e.g. "Afrish Petals <bookings@afrishpetals.rw>".
 *                      Needs a domain verified in Resend. For a first test you can leave the default
 *                      (onboarding@resend.dev), which only delivers to the email you registered with Resend.
 *
 * Without RESEND_API_KEY it answers 503 { reason: 'not-configured' } and the website falls back
 * to the prefilled WhatsApp / email hand-off — guests are never told a request was sent when it wasn't.
 */
import { restaurant } from '../src/data/restaurant.js'
import { describe } from '../src/lib/messages.js'

const KINDS = {
  contact: { label: 'Contact message', required: ['name', 'email', 'message'] },
  reservation: { label: 'Table reservation request', required: ['name', 'phone', 'date', 'time', 'guests'] },
  event: { label: 'Event inquiry', required: ['name', 'phone', 'eventType', 'date', 'daypart', 'guests'] },
}

const MAX = { default: 300, notes: 2000, message: 4000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Best-effort per-instance rate limit (5 submissions / 10 min / IP). Not a substitute for a WAF.
const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Trim + cap every string field; keep arrays of short strings. */
function clean(body) {
  const out = {}
  for (const [k, v] of Object.entries(body || {})) {
    if (typeof v === 'string') out[k] = v.trim().slice(0, MAX[k] || MAX.default)
    else if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === 'string').map((x) => x.trim().slice(0, 80)).slice(0, 12)
    else if (typeof v === 'number') out[k] = String(v)
  }
  return out
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, reason: 'method' })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) return res.status(503).json({ ok: false, reason: 'not-configured' })

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (limited(ip)) return res.status(429).json({ ok: false, reason: 'rate-limit' })

  const data = clean(typeof req.body === 'string' ? safeJson(req.body) : req.body)
  const spec = KINDS[data.type]
  if (!spec) return res.status(400).json({ ok: false, reason: 'invalid' })

  // Bots submit instantly. A human needs a few seconds — drop those silently (pretend success).
  if (Number(data.elapsed) < 2500) return res.status(200).json({ ok: true })

  const missing = spec.required.filter((f) => !data[f])
  if (missing.length) return res.status(400).json({ ok: false, reason: 'invalid', missing })
  if (data.email && !EMAIL_RE.test(data.email)) return res.status(400).json({ ok: false, reason: 'invalid', missing: ['email'] })

  const details = describe(data.type, data)
  const subject = `[Afrish Petals website] ${spec.label} — ${data.name}`
  const to = process.env.FORMS_TO_EMAIL || restaurant.email
  const from = process.env.FORMS_FROM_EMAIL || 'Afrish Petals Website <onboarding@resend.dev>'

  const html =
    `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">` +
    `<h2 style="margin:0 0 12px">${esc(spec.label)}</h2>` +
    `<pre style="font:inherit;white-space:pre-wrap;margin:0">${esc(details)}</pre>` +
    `<p style="color:#666;margin-top:20px;font-size:13px">Sent from afrishpetals.rw. This is a request — nothing is confirmed until the team replies.</p></div>`

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text: `${spec.label}\n\n${details}\n`,
        ...(data.email && EMAIL_RE.test(data.email) ? { reply_to: data.email } : {}),
      }),
    })
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text().catch(() => ''))
      return res.status(502).json({ ok: false, reason: 'delivery' })
    }
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Resend request failed', e)
    return res.status(502).json({ ok: false, reason: 'delivery' })
  }
}

function safeJson(s) {
  try {
    return JSON.parse(s)
  } catch {
    return {}
  }
}
