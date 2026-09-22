import { Fragment } from 'react'

/**
 * Split heading — keeps the text as real, selectable, screen-reader-friendly
 * markup and only wraps lines/words so animations/textReveal.js can slide
 * them out of an overflow-hidden mask.
 *
 *   <Split as="h2" lines={['A Table.', 'A Story.', 'A Taste of *Africa.*']} />
 *
 * `*text*` renders as an emphasised (italic gold) span.
 * `by="words"` wraps each word instead of each line (for long headings).
 * `intro` skips the scroll-triggered reveal — use when a page's entrance timeline animates it.
 */
function segments(line) {
  let em = false
  return line
    .split('*')
    .map((chunk, i) => {
      if (i > 0) em = !em
      return { text: chunk, em }
    })
    .filter((s) => s.text)
}

function words(line) {
  const out = []
  segments(line).forEach((seg) => {
    seg.text.split(/\s+/).forEach((w) => w && out.push({ text: w, em: seg.em }))
  })
  return out
}

export function Split({ as: Tag = 'h2', lines, by = 'lines', intro = false, className = '', ...rest }) {
  const arr = Array.isArray(lines) ? lines : [lines]
  return (
    <Tag className={className} data-split={intro ? undefined : by === 'words' ? 'words' : 'lines'} {...rest}>
      {by === 'words'
        ? arr.map((line, li) => (
            <Fragment key={li}>
              {words(line).map((w, wi) => (
                <Fragment key={wi}>
                  <span className="line word">
                    <span className="line-inner">{w.em ? <em>{w.text}</em> : w.text}</span>
                  </span>{' '}
                </Fragment>
              ))}
              {li < arr.length - 1 && <br />}
            </Fragment>
          ))
        : arr.map((line, li) => (
            <Fragment key={li}>
              <span className="line">
                <span className="line-inner">
                  {segments(line).map((s, i) => (s.em ? <em key={i}>{s.text}</em> : <Fragment key={i}>{s.text}</Fragment>))}
                </span>
              </span>{' '}
            </Fragment>
          ))}
    </Tag>
  )
}
