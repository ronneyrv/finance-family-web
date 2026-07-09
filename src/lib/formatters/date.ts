export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
