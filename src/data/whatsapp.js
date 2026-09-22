import { restaurant } from './restaurant.js'

/** Prefilled opening lines per context. Edit the wording here — nowhere else. */
export const WHATSAPP_MESSAGES = {
  general: 'Hello Afrish Petals, I would like to make an inquiry.',
  reservation: 'Hello Afrish Petals, I would like to inquire about reserving a table.',
  event: 'Hello Afrish Petals, I would like to inquire about booking an event.',
}

/**
 * Builds a wa.me link for a context, optionally appending extra lines
 * (e.g. the details a guest already typed into a form).
 */
export function whatsappUrl(context = 'general', extra = '') {
  const base = WHATSAPP_MESSAGES[context] ?? WHATSAPP_MESSAGES.general
  const text = extra ? `${base}\n\n${extra}` : base
  return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(text)}`
}

/** Which WhatsApp context belongs to which route. */
export function contextForPath(pathname) {
  if (pathname.startsWith('/events')) return 'event'
  if (pathname.startsWith('/book')) return 'reservation'
  return 'general'
}
