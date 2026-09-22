import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { sendForm } from '../../services/forms.js'
import { collect, email, phone, required } from '../../lib/validators.js'
import { describe } from '../../lib/messages.js'
import { ConsentNote, Field, ResultPanel } from '../forms/FormParts.jsx'

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' }

const validate = (v) =>
  collect({
    name: required(v.name, 'Please tell us your name.'),
    email: required(v.email, 'Please enter your email.') || email(v.email),
    phone: phone(v.phone),
    message: required(v.message, 'Please write a short message.'),
  })

/**
 * Contact form — thin lines, big type, a gold underline that grows on focus.
 * Validates inline (no browser alerts) and swaps to a confirmation panel.
 */
export default function ContactForm() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | not-connected | error

  const bind = (name) => ({
    value: values[name],
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }))
      if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }))
    },
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) return document.getElementById(`cf-${first}`)?.focus()
    setStatus('sending')
    const res = await sendForm('contact', values)
    setStatus(res.ok ? 'sent' : res.reason === 'not-connected' ? 'not-connected' : 'error')
  }

  const summary = describe('contact', values)
  const busy = status === 'sending'

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'idle' || busy ? (
        <form key="form" className="cform" onSubmit={onSubmit} noValidate aria-label="Contact form">
          <Field label="Name" name="name" id="cf-name" error={errors.name}>
            {(p) => <input {...p} type="text" autoComplete="name" placeholder="Your name" {...bind('name')} />}
          </Field>
          <Field label="Email" name="email" id="cf-email" error={errors.email}>
            {(p) => <input {...p} type="email" autoComplete="email" placeholder="you@example.com" {...bind('email')} />}
          </Field>
          <Field label="Phone" name="phone" id="cf-phone" optional error={errors.phone}>
            {(p) => <input {...p} type="tel" autoComplete="tel" placeholder="+250 …" {...bind('phone')} />}
          </Field>
          <Field label="Subject" name="subject" id="cf-subject" optional>
            {(p) => <input {...p} type="text" placeholder="How can we help?" {...bind('subject')} />}
          </Field>
          <Field label="Message" name="message" id="cf-message" wide error={errors.message}>
            {(p) => <textarea {...p} rows={4} placeholder="Tell us a little…" {...bind('message')} />}
          </Field>
          <div className="cform__submit cform__submit--consent">
            <ConsentNote />
            <button type="submit" className="btn btn--solid" disabled={busy} data-magnetic>
              <span className="btn__label">{busy ? 'Sending…' : 'Send Message'}</span>
              {!busy && (
                <svg className="btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          </div>
        </form>
      ) : (
        <ResultPanel
          key="result"
          status={status}
          eyebrow="Message"
          title="One last step."
          sentTitle="Thank you."
          sentText="Your message has been received. We'll be in touch soon."
          pendingText="Online sending is unavailable right now, so your message has not been sent yet. Send it to our team in one tap — your details are already filled in."
          waContext="general"
          waExtra={summary}
          mailSubject={values.subject || 'Message from afrishpetals.rw'}
          mailBody={summary}
          onEdit={() => setStatus('idle')}
        />
      )}
    </AnimatePresence>
  )
}
