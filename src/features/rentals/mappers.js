export function toRental(dto) {
  return {
    id: dto.id,
    userId: dto.userId,
    vehicleId: dto.vehicleId,
    startDate: dto.startDate,
    endDate: dto.endDate,
    totalCost: Number(dto.totalCost) || 0,
    status: String(dto.status ?? "ACTIVE").toUpperCase(),
  };
}

export function toRentalList(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(toRental);
}