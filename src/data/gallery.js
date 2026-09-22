import { images } from './images.js'

/**
 * Gallery layout. Images come from images.gallery (data/images.js).
 * `col`/`row` are grid placements on the 12-column desktop canvas;
 * `rot` is a subtle rotation in degrees; `speed` drives the parallax drift;
 * `z` controls overlap order.
 */
const layout = [
  { col: '1 / span 5', row: '1 / span 4', rot: -1.2, speed: 0.8, z: 2 },
  { col: '7 / span 3', row: '1 / span 3', rot: 1.6, speed: -0.5, z: 3 },
  { col: '10 / span 3', row: '2 / span 3', rot: -0.8, speed: 0.4, z: 2 },
  { col: '4 / span 4', row: '4 / span 3', rot: 1.2, speed: -0.9, z: 4 },
  { col: '9 / span 4', row: '5 / span 4', rot: 0.6, speed: 0.6, z: 2 },
  { col: '1 / span 3', row: '6 / span 3', rot: -1.6, speed: -0.3, z: 3 },
  { col: '4 / span 5', row: '7 / span 3', rot: -0.4, speed: 0.9, z: 1 },
  { col: '9 / span 3', row: '9 / span 3', rot: 1.4, speed: -0.6, z: 3 },
  { col: '2 / span 3', row: '9 / span 3', rot: 0.9, speed: 0.5, z: 2 },
]

export const gallery = images.gallery.map((img, i) => ({ ...img, ...layout[i] }))
