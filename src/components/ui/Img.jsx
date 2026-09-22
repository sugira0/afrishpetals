import { getImage } from '../../hooks/useImages.js'

/**
 * <Img name="hero.plate1" /> — resolves the key from data/images.js and renders
 * a responsive <img> with intrinsic width/height (no layout shift), async decode
 * and lazy loading unless `priority` is set.
 */
export function Img({ name, data, sizes = '100vw', priority = false, className = '', style, alt, ...rest }) {
  const img = data ?? getImage(name)
  if (!img) return null
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt ?? img.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={{ objectPosition: img.pos, ...style }}
      draggable={false}
      {...rest}
    />
  )
}

/**
 * Masked image wrapper. Structure:  .img-mask (clips / shapes)
 *                                     └ .img-inner (reveal clip-path + parallax)
 *                                         └ img (reveal scale)
 * `reveal` = wipe direction for animations/imageAnimations.revealImages
 * `parallax` = inner drift amount in % (0 disables)
 */
export function ImageMask({
  name,
  data,
  sizes,
  priority,
  reveal = 'left',
  parallax = 0,
  className = '',
  style,
  cursor,
  alt,
  children,
}) {
  const img = data ?? getImage(name)
  return (
    <div
      className={`img-mask ${parallax ? 'has-parallax' : ''} ${className}`}
      style={{ aspectRatio: img ? `${img.width} / ${img.height}` : undefined, ...style }}
      data-reveal={reveal || undefined}
      data-parallax-inner={parallax || undefined}
      data-cursor={cursor}
    >
      <div className="img-inner">
        <Img data={img} sizes={sizes} priority={priority} alt={alt} />
      </div>
      {children}
    </div>
  )
}
