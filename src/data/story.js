/**
 * /story and /events copy — kept short and general on purpose.
 *
 * Nothing here is a business fact the restaurant has not already published on this site
 * (tagline, "premium African dining", Kigali, private events). No dates, names, awards or numbers.
 * When the real story is written, set `restaurant.story` in data/restaurant.js (an array of paragraphs)
 * and it replaces `beginning` below.
 */
import { restaurant, experiencePanels } from './restaurant.js'
import { eventConfig, eventStory } from './events.js'

export const storyCopy = {
  beginning: restaurant.story ?? [
    'A place shaped around food, people and the warmth of gathering.',
    'Afrish Petals is a premium African dining experience in Kigali — crafted with passion, served with love.',
  ],
  africa: 'African flavours and hospitality, presented with care — from the first plate to the last conversation.',
  table:
    'Food is better shared. Afrish Petals is set up for the long lunch, the quiet dinner and the celebration that runs late — a table where good company matters as much as the food.',
}

/** The three chapters of the pinned "Craft" sequence — copy reuses the home page's experience panels. */
const panel = (id) => experiencePanels.find((p) => p.id === id)
export const craft = [
  { n: '01', word: 'Food', text: panel('ingredients').text, image: 'experience.ingredients' },
  { n: '02', word: 'Hospitality', text: 'Warm, attentive and unhurried — the way a guest should be welcomed.', image: 'story.guest' },
  { n: '03', word: 'Atmosphere', text: panel('ambience').text, image: 'experience.ambience' },
]

/** Event categories come straight from the inquiry form's own list (data/events.js). */
export const eventKinds = eventConfig.eventTypes.filter((t) => t !== 'Other')

/** The three editorial chapters on /events. Text reuses data/events.js wherever it exists. */
export const eventChapters = [
  {
    n: '01',
    title: 'Private celebrations',
    kinds: 'Birthdays · Anniversaries · Milestones',
    text: eventStory[0].line,
    image: 'experience.events',
  },
  {
    n: '02',
    title: 'Corporate gatherings',
    kinds: 'Team occasions · Business hospitality',
    text: 'Bring colleagues and guests together around good food, away from the meeting room.',
    image: 'events.decor',
  },
  {
    n: '03',
    title: 'Special occasions',
    kinds: 'Private dinners · Celebrations',
    text: eventStory[2].line,
    image: 'menu.drinks',
  },
]
