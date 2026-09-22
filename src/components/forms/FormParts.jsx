import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { restaurant } from '../../data/restaurant.js'
import { mailtoUrl } from '../../lib/messages.js'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton.jsx'
import { Logo } from '../ui/Logo.jsx'
import './forms.css'

const EASE = [0.16, 1, 0.3, 1]

/* ───────── Text-like field: thin border, animated gold underline ───────── */
export function Field({ label, error, hint, optional, wide, children, id, name }) {
  const uid = useId()
  const fid = id ?? name ?? uid
  const errId = `${fid}-err`
  const hintId = `${fid}-hint`
  const describedBy = [error && errId, hint && hintId].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field ${wide ? 'field--wide' : ''} ${error ? 'has-error' : ''}`}>
      <label htmlFor={fid} className="field__label">
        {label}
        {optional && <span className="field__opt">optional</span>}
      </label>
      <div className="field__box">
        {children({
          id: fid,
          name,
          className: 'field__control',
          'aria-invalid': error ? 'true' : undefined,
          'aria-describedby': describedBy,
        })}
        <span className="field__line" aria-hidden="true" />
      </div>
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <FieldError id={errId} error={error} />
    </div>
  )
}

export function FieldError({ id, error }) {
  return (
    <div className="field__error-slot">
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={id}
            className="field__error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── Choice chips (radio or checkbox — real inputs, styled) ───────── */
export function ChipGroup({ legend, name, options, value, onChange, multiple = false, error, columns, optional, hint }) {
  const errId = `${name}-err`
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <fieldset className={`chips ${error ? 'has-error' : ''}`} aria-describedby={error ? errId : undefined}>
      <legend className="field__label">
        {legend}
        {optional && <span className="field__opt">optional</span>}
      </legend>
      {hint && <p className="field__hint">{hint}</p>}
      <div className="chips__grid" style={columns ? { '--cols': columns } : undefined}>
        {options.map((o, i) => {
          const val = typeof o === 'string' ? o : o.value
          const label = typeof o === 'string' ? o : o.label
          const checked = multiple ? value.includes(val) : value === val
          return (
            <label key={val} className={`chip ${checked ? 'is-on' : ''}`}>
              <input
                className="chip__input"
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                value={val}
                checked={checked}
                data-field={i === 0 ? name : undefined}
                onChange={() => (multiple ? toggle(val) : onChange(val))}
              />
              <span className="chip__face">
                {multiple && <Check className="chip__tick" strokeWidth={2} aria-hidden="true" />}
                {label}
              </span>
            </label>
          )
        })}
      </div>
      <FieldError id={errId} error={error} />
    </fieldset>
  )
}

/* ───────── Guest counter: big number, − / +, optional quick picks ───────── */
export function GuestStepper({ label, name = 'guests', value, onChange, min, max, error, quickPicks = [] }) {
  const errId = `${name}-err`
  const n = Number(value)
  const clamp = (x) => String(Math.min(max, Math.max(min, x)))
  return (
    <div className={`stepper-wrap ${error ? 'has-error' : ''}`}>
      <label htmlFor={name} className="field__label">{label}</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          onClick={() => onChange(clamp((Number.isFinite(n) && value !== '' ? n : min) - 1))}
          aria-label="One fewer guest"
          disabled={value !== '' && n <= min}
        >
          <Minus strokeWidth={1.4} />
        </button>
        <input
          id={name}
          name={name}
          className="stepper__value"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errId : undefined}
        />
        <button
          type="button"
          className="stepper__btn"
          onClick={() => onChange(clamp((Number.isFinite(n) && value !== '' ? n : min - 1) + 1))}
          aria-label="One more guest"
          disabled={value !== '' && n >= max}
        >
          <Plus strokeWidth={1.4} />
        </button>
        <span className="field__line" aria-hidden="true" />
      </div>
      {quickPicks.length > 0 && (
        <div className="quick" role="group" aria-label="Common group sizes">
          {quickPicks.map((q) => (
            <button key={q} type="button" className={`quick__pick ${String(q) === String(value) ? 'is-on' : ''}`} onClick={() => onChange(String(q))}>
              {q}
            </button>
          ))}
        </div>
      )}
      <FieldError id={errId} error={error} />
    </div>
  )
}

/* ───────── Progress: 01 WHEN / 02 WHO … with a gold indicator ───────── */
export function StepIndicator({ steps, current, onJump }) {
  return (
    <nav className="steps" aria-label="Progress">
      <ol className="steps__list">
        {steps.map((s, i) => {
          const state = i < current ? 'is-done' : i === current ? 'is-active' : ''
          return (
            <li key={s.id} className={`steps__item ${state}`}>
              <button
                type="button"
                className="steps__btn"
                onClick={() => onJump(i)}
                disabled={i >= current}
                aria-current={i === current ? 'step' : undefined}
                aria-label={`Step ${i + 1}: ${s.label}${i < current ? ' (completed — go back)' : ''}`}
              >
                <span className="steps__n">{i < current ? <Check strokeWidth={2} aria-hidden="true" /> : String(i + 1).padStart(2, '0')}</span>
                <span className="steps__label">{s.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="steps__track" aria-hidden="true">
        <m.span
          className="steps__fill"
          initial={false}
          animate={{ scaleX: (current + 1) / steps.length }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
    </nav>
  )
}

/* ───────── Animated step container (Framer Motion) ───────── */
export function StepShell({ stepKey, dir, children }) {
  const reduce = useReducedMotion()
  const dist = reduce ? 0 : 36
  return (
    <AnimatePresence mode="wait" initial={false} custom={dir}>
      <m.div
        key={stepKey}
        className="step"
        custom={dir}
        variants={{
          enter: (d) => ({ opacity: 0, x: d * dist }),
          center: { opacity: 1, x: 0 },
          exit: (d) => ({ opacity: 0, x: -d * dist }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: reduce ? 0.01 : 0.38, ease: EASE }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}

/** Step heading; receives focus after a step change so keyboard/SR users land on new content. */
export function StepHeading({ n, title, hint, focus }) {
  const ref = useRef(null)
  useEffect(() => {
    if (focus) ref.current?.focus({ preventScroll: true })
  }, [focus])
  return (
    <header className="step__head">
      <p className="step__n" aria-hidden="true">{String(n).padStart(2, '0')}</p>
      <h2 className="step__title" tabIndex={-1} ref={ref}>{title}</h2>
      {hint && <p className="step__hint">{hint}</p>}
    </header>
  )
}

/* ───────── Back / Continue ───────── */
export function FormNav({ showBack, onBack, nextLabel, busy, consent = false }) {
  return (
    <>
    {consent && <ConsentNote />}
    <div className="form-nav">
      {showBack ? (
        <button type="button" className="form-nav__back" onClick={onBack}>
          <ArrowLeft strokeWidth={1.4} aria-hidden="true" /> Back
        </button>
      ) : (
        <span />
      )}
      <button type="submit" className="btn btn--solid form-nav__next" disabled={busy}>
        <span className="btn__label">{busy ? 'Sending…' : nextLabel}</span>
        {!busy && <ArrowRight className="btn__arrow" strokeWidth={1.5} aria-hidden="true" />}
      </button>
    </div>
    </>
  )
}

export function ConsentNote() {
  return (
    <p className="consent">
      By sending, you agree that we may use these details to reply to you. See our <Link to="/privacy">privacy notice</Link>.
    </p>
  )
}

export function SummaryList({ rows }) {
  return (
    <dl className="summary">
      {rows.filter((r) => r.value).map((r) => (
        <div key={r.label} className="summary__row">
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Confirmation / result panel.
 *  sent          → the backend accepted the request
 *  not-connected → no backend yet: say so, hand off via WhatsApp / email with details filled in
 *  error         → the backend failed: same hand-off
 * It never says a table or event is confirmed.
 */
export function ResultPanel({
  eyebrow,
  title,
  sentTitle,
  rows,
  status,
  sentText,
  pendingText,
  waContext,
  waExtra,
  mailSubject,
  mailBody,
  onEdit,
  backLabel = 'Back to Afrish Petals',
}) {
  const sent = status === 'sent'
  const ref = useRef(null)
  useEffect(() => ref.current?.focus({ preventScroll: true }), [])
  return (
    <m.div
      className="result"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <Logo className="result__logo" />
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="result__title" tabIndex={-1} ref={ref}>
        {sent ? sentTitle || title : title}
      </h2>
      {rows?.length > 0 && <SummaryList rows={rows} />}
      <p className="result__text" role="status">
        {sent
          ? sentText
          : status === 'error'
            ? "We couldn't send your request just now, so it has not been sent. Please try again in a moment, or send it to our team directly:"
            : pendingText}
      </p>
      <div className="result__actions">
        {!sent && (
          <>
            <WhatsAppButton variant="inline" context={waContext} extra={waExtra}>Send on WhatsApp</WhatsAppButton>
            <a className="btn" href={mailtoUrl(mailSubject, mailBody)}>
              <span className="btn__label">Send by email</span>
              <ArrowRight className="btn__arrow" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </>
        )}
        {sent && <WhatsAppButton variant="inline" context={waContext} extra={waExtra}>Contact us on WhatsApp</WhatsAppButton>}
      </div>
      <div className="result__foot">
        {onEdit && !sent && (
          <button type="button" className="link-line" onClick={onEdit}>Edit my details</button>
        )}
        <Link to="/" className="link-line">
          {backLabel}
          <ArrowRight className="btn__arrow" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      {!sent && (
        <p className="result__contact meta">
          Or call {restaurant.phone}
        </p>
      )}
    </m.div>
  )
}
