/**
 * Decorative giant type, one masked cell per glyph so letters can rise
 * individually (see animations/pageReveal.js). Always aria-hidden — pair it
 * with a real heading that carries the accessible text.
 */
export function Letters({ text, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={className} aria-hidden="true">
      {[...text].map((c, i) => (
        <span className="ch-wrap" key={i}>
          <span className="ch">{c === ' ' ? '\u00A0' : c}</span>
        </span>
      ))}
    </Tag>
  )
}
