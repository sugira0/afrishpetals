import { useEffect } from 'react'
import { useStepForm } from '../../hooks/useStepForm.js'
import { eventConfig, eventSteps } from '../../data/events.js'
import { collect, email, futureDate, intRange, phone, prettyDate, required, todayISO } from '../../lib/validators.js'
import { describe } from '../../lib/messages.js'
import { ChipGroup, Field, FormNav, GuestStepper, ResultPanel, StepHeading, StepIndicator, StepShell } from '../forms/FormParts.jsx'

const INITIAL = { eventType: '', date: '', daypart: '', guests: '', services: [], name: '', company: '', phone: '', email: '', notes: '' }
const { guests: G } = eventConfig

const validators = {
  event: (v) => collect({ eventType: required(v.eventType, 'Please choose the kind of event.') }),
  when: (v) =>
    collect({
      date: futureDate(v.date, eventConfig.advanceDays),
      daypart: required(v.daypart, 'Please choose a preferred time of day.'),
    }),
  guests: (v) => collect({ guests: intRange(v.guests, G.min, G.max, 'guests') }),
  experience: () => ({}), // optional
  contact: (v) =>
    collect({
      name: required(v.name, 'Please tell us your name.'),
      phone: required(v.phone, 'Please enter a phone number.') || phone(v.phone),
      email: email(v.email),
    }),
}

const steps = eventSteps.map((s) => ({ ...s, validate: validators[s.id] }))

/**
 * EVENT INQUIRY — five steps (Event · When · Guests · Experience · Contact).
 * Every option list comes from data/events.js so services can change without
 * touching this file. It is an inquiry, never a booking confirmation.
 */
export default function EventBookingForm({ onStepChange }) {
  const f = useStepForm({ steps, kind: 'event', initial: INITIAL })
  const { values, errors, step } = f

  useEffect(() => onStepChange?.(step), [step, onStepChange])

  if (['sent', 'not-connected', 'error'].includes(f.status)) {
    const summary = describe('event', values)
    return (
      <ResultPanel
        status={f.status}
        eyebrow="Event inquiry"
        title="Almost there."
        sentTitle="Thank you — let's plan it."
        rows={[
          { label: 'Event', value: values.eventType },
          { label: 'Date', value: prettyDate(values.date) },
          { label: 'Time', value: values.daypart },
          { label: 'Guests', value: values.guests },
          { label: 'Name', value: values.name },
        ]}
        sentText="We've received your event inquiry. Our team will be in touch to talk through the details — nothing is confirmed until we do."
        pendingText="Online sending is unavailable right now, so your inquiry has not been sent yet. Send it to our team in one tap — your details are already filled in."
        waContext="event"
        waExtra={summary}
        mailSubject={`Event inquiry — ${values.eventType || 'Afrish Petals'}`}
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
    <form onSubmit={onSubmit} noValidate aria-label="Event inquiry">
      <StepIndicator steps={eventSteps} current={step} onJump={f.jump} />

      <StepShell stepKey={step} dir={f.dir}>
        {step === 0 && (
          <>
            <StepHeading n={1} title="What are we celebrating?" focus={focus} />
            <div className="step__body">
              <ChipGroup
                legend="Event type"
                name="eventType"
                options={eventConfig.eventTypes}
                value={values.eventType}
                onChange={(v) => f.set('eventType', v)}
                columns={2}
                error={errors.eventType}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <StepHeading n={2} title="When is it?" hint="A rough date is fine — we'll confirm availability together." focus={focus} />
            <div className="step__body">
              <Field label="Event date" name="date" error={errors.date}>
                {(p) => <input {...p} type="date" min={todayISO()} value={values.date} onChange={(e) => f.set('date', e.target.value)} />}
              </Field>
              <ChipGroup
                legend="Preferred time"
                name="daypart"
                options={eventConfig.dayparts}
                value={values.daypart}
                onChange={(v) => f.set('daypart', v)}
                columns={3}
                error={errors.daypart}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeading n={3} title="How many guests?" hint="An estimate is enough." focus={focus} />
            <div className="step__body">
              <GuestStepper
                label="Number of guests"
                value={values.guests}
                onChange={(v) => f.set('guests', v)}
                min={G.min}
                max={G.max}
                quickPicks={G.quickPicks}
                error={errors.guests}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <StepHeading n={4} title="What would you like to talk through?" hint="Optional. Tick anything you'd like to discuss — it's a conversation starter, not a commitment." focus={focus} />
            <div className="step__body">
              <ChipGroup
                legend="Requirements"
                name="services"
                options={eventConfig.services}
                value={values.services}
                onChange={(v) => f.set('services', v)}
                multiple
                optional
                columns={2}
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <StepHeading n={5} title="Where can we reach you?" focus={focus} />
            <div className="step__body step__body--2">
              <Field label="Your name" name="name" error={errors.name}>
                {(p) => <input {...p} type="text" autoComplete="name" placeholder="Full name" value={values.name} onChange={(e) => f.set('name', e.target.value)} />}
              </Field>
              <Field label="Company" name="company" optional>
                {(p) => <input {...p} type="text" autoComplete="organization" placeholder="Company or group" value={values.company} onChange={(e) => f.set('company', e.target.value)} />}
              </Field>
              <Field label="Phone" name="phone" error={errors.phone}>
                {(p) => <input {...p} type="tel" autoComplete="tel" placeholder="+250 …" value={values.phone} onChange={(e) => f.set('phone', e.target.value)} />}
              </Field>
              <Field label="Email" name="email" optional error={errors.email}>
                {(p) => <input {...p} type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(e) => f.set('email', e.target.value)} />}
              </Field>
              <Field label="Additional notes" name="notes" optional wide>
                {(p) => <textarea {...p} rows={3} placeholder="Anything else we should know…" value={values.notes} onChange={(e) => f.set('notes', e.target.value)} />}
              </Field>
            </div>
          </>
        )}
      </StepShell>

      <FormNav
        showBack={step > 0}
        onBack={f.back}
        nextLabel={f.isLast ? 'Plan My Event' : 'Continue'}
        busy={f.status === 'sending'}
        consent={f.isLast}
      />
    </form>
  )
}
