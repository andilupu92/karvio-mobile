export default function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
