import { useCallback, useRef, useState } from 'react'
import { sendForm } from '../services/forms.js'

/**
 * State machine shared by the reservation and event flows.
 *
 *   steps   [{ id, label, validate?(values) → { field: message } }]
 *   kind    'reservation' | 'event'  (which endpoint sendForm uses)
 *
 * `next()` validates the current step, then advances; on failure it returns the
 * error map and moves focus to the first invalid control. `submit()` validates
 * every step, jumping back to the first one with problems.
 */
export function useStepForm({ steps, kind, initial }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | not-connected | error
  const interacted = useRef(false)
  const last = steps.length - 1

  const set = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }, [])

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0]
    if (!first) return
    // wait for error nodes to render, then focus the field (or its fieldset)
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-field="${first}"]`) || document.getElementById(first)
      el?.focus?.()
    })
  }

  const check = (i) => steps[i].validate?.(values) ?? {}

  const next = () => {
    const errs = check(step)
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusFirstError(errs)
      return false
    }
    interacted.current = true
    setDir(1)
    setStep((s) => Math.min(s + 1, last))
    return true
  }

  const back = () => {
    interacted.current = true
    setErrors({})
    setDir(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  const jump = (i) => {
    if (i >= step) return
    interacted.current = true
    setErrors({})
    setDir(-1)
    setStep(i)
  }

  const submit = async () => {
    for (let i = 0; i < steps.length; i++) {
      const errs = check(i)
      if (Object.keys(errs).length) {
        setErrors(errs)
        setDir(i < step ? -1 : 1)
        setStep(i)
        setTimeout(() => focusFirstError(errs), 450)
        return
      }
    }
    setStatus('sending')
    const res = await sendForm(kind, values)
    setStatus(res.ok ? 'sent' : res.reason === 'not-connected' ? 'not-connected' : 'error')
  }

  const reset = () => setStatus('idle')

  return {
    step, dir, values, errors, status, set, next, back, jump, submit, reset,
    isLast: step === last,
    interacted,
  }
}
