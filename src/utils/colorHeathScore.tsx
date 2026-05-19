
export default function formatHealthScore(healthScore?: number) {
 
  if (healthScore === undefined || healthScore === null) return `text-typography-100`;
  if (healthScore < 60) return `text-error-50`;
  if (healthScore < 80) return `text-warning-50`;
  return `text-success-50`;
};