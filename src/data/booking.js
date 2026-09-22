/**
 * TABLE RESERVATION CONFIG — edit freely, the UI reads everything from here.
 *
 * `timeSlots` — empty by default (opening hours have not been supplied).
 * The team still confirms availability — the UI never claims a table is held.
 */
export const tableBooking = {
  maxGuests: 12, // above this we point people to the event inquiry
  // Leave empty until the restaurant's real opening hours are confirmed: guests then type the time they'd like
  // and the team confirms. Add e.g. ['12:00', '12:30', …] to switch the form to tappable slots.
  timeSlots: [],
  advanceDays: 180, // furthest-ahead date accepted
}

export const bookingSteps = [
  { id: 'when', label: 'When' },
  { id: 'who', label: 'Who' },
  { id: 'details', label: 'Details' },
  { id: 'confirm', label: 'Confirm' },
]

/** One photograph per step; the backdrop crossfades as the guest progresses. */
export const bookingImages = ['events.candle', 'events.toast', 'dishes.fish', 'events.bar']
