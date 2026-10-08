export function validateRentalDates(startDate, endDate) {
  const errors = {};

  if (!startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!endDate) {
    errors.endDate = "End date is required.";
  }

  if (startDate && endDate && endDate <= startDate) {
    errors.endDate = "End date must be after start date.";
  }

  return errors;
}

export function rentalDays(startDate, endDate) {
  if (!startDate || !endDate || endDate <= startDate) {
    return 0;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  return Math.ceil(
    (end.getTime() - start.getTime()) / 86_400_000
  );
}

export function calculateEstimatedCost(
  dailyRate,
  startDate,
  endDate
) {
  return rentalDays(startDate, endDate) * Number(dailyRate || 0);
}