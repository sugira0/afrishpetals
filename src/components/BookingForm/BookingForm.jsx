import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStepForm } from '../../hooks/useStepForm.js'
import { bookingSteps, tableBooking } from '../../data/booking.js'
import { collect, email, futureDate, intRange, phone, prettyDate, required, todayISO } from '../../lib/validators.js'
import { describe } from '../../lib/messages.js'
import { ChipGroup, Field, FormNav, GuestStepper, ResultPanel, StepHeading, StepIndicator, StepShell, SummaryList } from '../forms/FormParts.jsx'

const INITIAL = { date: '', time: '', guests: '2', name: '', phone: '', email: '', notes: '' }

const validators = {
  when: (v) =>
    collect({
      date: futureDate(v.date, tableBooking.advanceDays),
      time: required(v.time, 'Please choose a time.'),
    }),
  who: (v) =>
    collect({
      guests: intRange(v.guests, 1, tableBooking.maxGuests, 'guests').replace(
        `The maximum here is ${tableBooking.maxGuests}.`,
        `For more than ${tableBooking.maxGuests} guests, please plan an event with us instead.`,
      ),
      name: required(v.name, 'Please tell us your name.'),
    }),
  details: (v) =>
    collect({
      phone: required(v.phone, 'Please enter a phone number.') || phone(v.phone),
      email: email(v.email),
    }),
  confirm: () => ({}),
}

const steps = bookingSteps.map((s) => ({ ...s, validate: validators[s.id] }))

/**
 * TABLE RESERVATION — four short steps (When · Who · Details · Confirm).
 * Framer Motion handles the step transitions; validation is inline and
 * keyboard-first (Enter advances, errors move focus). `onStepChange` lets the
 * page crossfade its backdrop photograph as the guest progresses.
 */
export default function BookingForm({ onStepChange }) {
  const f = useStepForm({ steps, kind: 'reservation', initial: INITIAL })
  const { values, errors, step } = f

  useEffect(() => onStepChange?.(step), [step, onStepChange])

  const rows = [
    { label: 'Date', value: prettyDate(values.date) },
    { label: 'Time', value: values.time },
    { label: 'Guests', value: values.guests },
    { label: 'Name', value: values.name },
  ]

  if (['sent', 'not-connected', 'error'].includes(f.status)) {
    const summary = describe('reservation', values)
    return (
      <ResultPanel
        status={f.status}
        eyebrow="Reservation request"
        title="You're almost there."
        rows={rows}
        sentText="We've received your reservation request. Our team will confirm availability."
        pendingText="Online sending is unavailable right now, so your request has not been sent yet. Send it to our team in one tap — your details are already filled in."
        waContext="reservation"
        waExtra={summary}
        mailSubject={`Reservation request — ${prettyDate(values.date)}`}
        mailBody={summary}
        onEdit={f.reset}
      />
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (f.isLast) f.submit()
    else f.next()
  }
  const focus = f.interacted.current

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Table reservation">
      <StepIndicator steps={bookingSteps} current={step} onJump={f.jump} />

      <StepShell stepKey={step} dir={f.dir}>
        {step === 0 && (
          <>
            <StepHeading n={1} title="When would you like to dine?" hint="Choose a date and a time. Our team confirms availability." focus={focus} />
            <div className="step__body">
              <Field label="Date" name="date" error={errors.date}>
                {(p) => (
                  <input
                    {...p}
                    type="date"
                    min={todayISO()}
                    value={values.date}
                    onChange={(e) => f.set('date', e.target.value)}
                  />
                )}
              </Field>
              {tableBooking.timeSlots.length > 0 ? (
                <ChipGroup
                  legend="Time"
                  name="time"
                  options={tableBooking.timeSlots}
                  value={values.time}
                  onChange={(v) => f.set('time', v)}
                  columns={4}
                  error={errors.time}
                  hint="Indicative slots — we'll confirm the exact time with you."
                />
              ) : (
                <Field label="Preferred time" name="time" error={errors.time} hint="We'll confirm the exact time with you.">
                  {(p) => <input {...p} type="time" value={values.time} onChange={(e) => f.set('time', e.target.value)} />}
                </Field>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <StepHeading n={2} title="Who's joining you?" focus={focus} />
            <div className="step__body">
              <GuestStepper
                label="Number of guests"
                value={values.guests}
                onChange={(v) => f.set('guests', v)}
                min={1}
                max={tableBooking.maxGuests}
                error={errors.guests}
              />
              <Field label="Your name" name="name" error={errors.name}>
                {(p) => <input {...p} type="text" autoComplete="name" placeholder="Full name" value={values.name} onChange={(e) => f.set('name', e.target.value)} />}
              </Field>
              {Number(values.guests) > tableBooking.maxGuests && (
                <p className="field__hint">
                  Planning something bigger? <Link to="/events/book" className="link-line">Plan an event</Link>
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeading n={3} title="How can we reach you?" focus={focus} />
            <div className="step__body step__body--2">
              <Field label="Phone" name="phone" error={errors.phone}>
                {(p) => <input {...p} type="tel" autoComplete="tel" placeholder="+250 …" value={values.phone} onChange={(e) => f.set('phone', e.target.value)} />}
              </Field>
              <Field label="Email" name="email" optional error={errors.email}>
                {(p) => <input {...p} type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(e) => f.set('email', e.target.value)} />}
              </Field>
              <Field label="Special request" name="notes" optional wide>
                {(p) => (
                  <textarea {...p} rows={3} placeholder="Allergies, a celebration, seating preferences…" value={values.notes} onChange={(e) => f.set('notes', e.target.value)} />
                )}
              </Field>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <StepHeading n={4} title="Confirm your request" hint="Check the details. This is a request — a table is only confirmed once our team replies." focus={focus} />
            <SummaryList
              rows={[
                ...rows,
                { label: 'Phone', value: values.phone },
                { label: 'Email', value: values.email },
                { label: 'Request', value: values.notes },
              ]}
            />
          </>
        )}
      </StepShell>

      <FormNav
        showBack={step > 0}
        onBack={f.back}
        nextLabel={f.isLast ? 'Request Reservation' : 'Continue'}
        busy={f.status === 'sending'}
        consent={f.isLast}
      />
    </form>
  )
}
