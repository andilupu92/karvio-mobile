export default function colorFuelScore(fuelScore?: number) {
 
  if (fuelScore === undefined || fuelScore === null) return `text-typography-100`;
  if (fuelScore > 10) return `text-error-50`;
  if (fuelScore > 8) return `text-warning-50`;
  return `text-success-50`;
};