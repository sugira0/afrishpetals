import { images } from '../data/images.js'

/** Resolve a dotted key ("hero.plate1") to an image config object. */
export function getImage(name) {
  const found = name.split('.').reduce((o, k) => (o ? o[k] : undefined), images)
  if (!found && import.meta.env.DEV) console.warn(`[images] Unknown image key "${name}"`)
  return found
}
