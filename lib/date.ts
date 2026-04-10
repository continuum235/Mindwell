export function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatShortDate(dateLabel: string) {
  const parsed = new Date(dateLabel)

  if (Number.isNaN(parsed.getTime())) {
    return dateLabel
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

export function getTodayCalendarDay() {
  const today = new Date().getDate()
  return Math.min(Math.max(today, 1), 30)
}
