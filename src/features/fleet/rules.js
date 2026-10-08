const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

export const formatPrice = (amount) => zar.format(amount);

export const canRent = (vehicle) =>
  String(vehicle?.status).toUpperCase() === "AVAILABLE";

export function filterVehicles(
  vehicles,
  { query = "", onlyAvailable = false } = {}
) {
  const q = query.trim().toLowerCase();

  return vehicles.filter((vehicle) => {
    if (onlyAvailable && !canRent(vehicle)) {
      return false;
    }

    if (!q) {
      return true;
    }

    return `${vehicle.make} ${vehicle.model} ${vehicle.registrationNumber}`
      .toLowerCase()
      .includes(q);
  });
}

export function validateVehicleDraft(
  draft,
  currentYear = new Date().getFullYear()
) {
  const errors = {};

  if (!String(draft.make ?? "").trim()) {
    errors.make = "Make is required.";
  }

  if (!String(draft.model ?? "").trim()) {
    errors.model = "Model is required.";
  }

  const year = Number(draft.year);

  if (
    !Number.isInteger(year) ||
    year < 1990 ||
    year > currentYear + 1
  ) {
    errors.year = "Enter a valid year.";
  }

  if (!String(draft.registrationNumber ?? "").trim()) {
    errors.registrationNumber = "Registration number is required.";
  }

  if (!(Number(draft.dailyRate) > 0)) {
    errors.dailyRate = "Enter a daily rate greater than 0.";
  }

  return errors;
}