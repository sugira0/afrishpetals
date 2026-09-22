import { navLinks } from './restaurant.js'
import { published } from './launch.js'

/** Nav entries, minus any whose section isn't published (see data/launch.js). */
export const visibleNavLinks = () => navLinks.filter((l) => !l.requires || published(l.requires))
