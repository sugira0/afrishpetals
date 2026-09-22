/**
 * EVENT INQUIRY CONFIG — every option in the flow comes from this file.
 *
 * ⚠ Confirm with the restaurant which `services` it actually provides and
 * delete the rest. They are worded as *requirements a guest may want to
 * discuss* ("What would you like help with?"), never as promises. Nothing is
 * advertised as a service anywhere else on the site.
 */
export const eventConfig = {
  eventTypes: ['Birthday', 'Anniversary', 'Corporate', 'Private Dinner', 'Celebration', 'Other'],

  // Dayparts, not clock times — opening hours have not been supplied.
  dayparts: ['Lunch', 'Afternoon', 'Evening', 'Late evening', 'Flexible'],

  guests: { min: 2, max: 500, quickPicks: [10, 20, 40, 80] },
  advanceDays: 730,

  services: [
    'Private space',
    'Food & dining',
    'Drinks',
    'Decor',
    'Music / entertainment',
    'Photography',
    'Other',
  ],
}

export const eventSteps = [
  { id: 'event', label: 'Event' },
  { id: 'when', label: 'When' },
  { id: 'guests', label: 'Guests' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/** The three words that carry the page's storytelling (kept short on purpose). */
export const eventStory = [
  { word: 'Celebrate.', line: 'The birthdays, anniversaries and milestones worth marking.', image: 'events.longTable' },
  { word: 'Connect.', line: 'One long table, good conversation, everyone in the same room.', image: 'events.toast' },
  { word: 'Remember.', line: 'The evening they will still be talking about.', image: 'events.gathering' },
]
