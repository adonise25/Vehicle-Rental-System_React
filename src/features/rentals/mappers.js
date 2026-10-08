export function toRental(dto) {
  return {
    id: dto.id,
    vehicleId: dto.vehicleId,
    startDate: dto.startDate,
    endDate: dto.endDate,
    totalCost: Number(dto.totalCost) || 0,
    status: String(dto.status ?? "ACTIVE").toUpperCase(),
  };
}