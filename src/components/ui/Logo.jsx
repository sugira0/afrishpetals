/**
 * The Afrish Petals emblem.
 *   variant="white"  – ring, leaves, fork & knife in white, for dark backgrounds
 *   variant="color"  – the original colours, for light (cream) backgrounds
 *
 * Both files live in /public/images. To swap in a new logo, replace
 * logo.png and logo-white.png there (same filenames) — nothing else changes.
 * `logo-white.png` is generated from `logo.png` by scripts/make-white-logo.py.
 */
export function Logo({ variant = 'white', className = '', alt = '', priority = false, ...rest }) {
  return (
    <img
      src={variant === 'color' ? '/images/logo.png' : '/images/logo-white.png'}
      width={473}
      height={489}
      alt={alt}
      className={className}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      draggable={false}
      {...rest}
    />
  )
}
