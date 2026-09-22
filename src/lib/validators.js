/** Small, dependency-free validators. Each returns an error string or '' (valid). */

export const required = (v, msg = 'This field is required.') => (String(v ?? '').trim() ? '' : msg)

export const email = (v) => {
  if (!String(v ?? '').trim()) return ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'
}

/** Accepts local (07…) and international (+250…) numbers; 9–15 digits. */
export const phone = (v) => {
  const s = String(v ?? '').trim()
  if (!s) return ''
  if (!/^\+?[0-9][0-9\s().-]{6,20}$/.test(s)) return 'Use digits only, e.g. +250 7XX XXX XXX.'
  const digits = s.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15 ? '' : 'That phone number looks too short or too long.'
}

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export const futureDate = (v, maxDays = 365) => {
  if (!v) return 'Please choose a date.'
  const d = new Date(`${v}T00:00:00`)
  if (Number.isNaN(d.getTime())) return 'Please choose a valid date.'
  if (d < startOfToday()) return 'Please choose today or a future date.'
  const limit = new Date(startOfToday())
  limit.setDate(limit.getDate() + maxDays)
  return d > limit ? 'That date is too far ahead — please contact us directly.' : ''
}

export const intRange = (v, min, max, label = 'guests') => {
  const n = Number(v)
  if (!String(v ?? '').trim() || !Number.isInteger(n)) return `Please enter a whole number of ${label}.`
  if (n < min) return `Please enter at least ${min}.`
  if (n > max) return `The maximum here is ${max}.`
  return ''
}

/** Drops empty results so `Object.keys(errors).length` means "has errors". */
export const collect = (map) => Object.fromEntries(Object.entries(map).filter(([, msg]) => msg))

export const todayISO = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export const prettyDate = (v) => {
  if (!v) return ''
  const d = new Date(`${v}T00:00:00`)
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
