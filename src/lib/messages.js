import { restaurant } from '../data/restaurant.js'
import { prettyDate } from './validators.js'

/** Plain-text summaries used for the WhatsApp / email hand-off. */
export function describe(kind, v) {
  const lines = []
  const add = (label, value) => value && lines.push(`${label}: ${value}`)
  if (kind === 'reservation') {
    add('Date', prettyDate(v.date))
    add('Time', v.time)
    add('Guests', v.guests)
    add('Name', v.name)
    add('Phone', v.phone)
    add('Email', v.email)
    add('Special request', v.notes)
  } else if (kind === 'event') {
    add('Event', v.eventType)
    add('Date', prettyDate(v.date))
    add('Time', v.daypart)
    add('Guests', v.guests)
    add('Requirements', Array.isArray(v.services) && v.services.length ? v.services.join(', ') : '')
    add('Name', v.name)
    add('Company', v.company)
    add('Phone', v.phone)
    add('Email', v.email)
    add('Notes', v.notes)
  } else {
    add('Name', v.name)
    add('Email', v.email)
    add('Phone', v.phone)
    add('Subject', v.subject)
    add('Message', v.message)
  }
  return lines.join('\n')
}

export const mailtoUrl = (subject, body) =>
  `mailto:${restaurant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
