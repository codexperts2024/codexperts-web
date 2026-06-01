export function isEventUpcoming(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
  eventEndDate.setHours(0, 0, 0, 0);
  return eventEndDate >= today;
}
