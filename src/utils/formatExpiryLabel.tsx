import formatDate from "./formatDate";

export default function formatExpiryLabel(days: number, expiryDate: Date) {
  const formatted = formatDate(expiryDate.toString());
 
  if (days < 0) return `Expirat la ${formatted}`;
  if (days == 0) return `Expiră astăzi - ${formatted}`;
  if (days <= 10) return `Expiră în ${days} zile - ${formatted}`;
  if (days <= 30) return `Expiră în ${days} zile - ${formatted}`;
  return `Valabil până la ${formatted}`;
};