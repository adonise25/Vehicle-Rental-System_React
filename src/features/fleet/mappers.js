// Maps the Spring Boot Vehicle DTO into the frontend Vehicle model.

export function toVehicle(dto) {
  return {
    id: dto.id,
    make: dto.make ?? "",
    model: dto.model ?? "",
    year: Number(dto.year) || null,
    registrationNumber: dto.registrationNumber ?? "",
    dailyRate: Number(dto.dailyRate) || 0,
    status: String(dto.status ?? "AVAILABLE").toUpperCase(),
  };
}

export function toVehicleList(data) {
  const items = Array.isArray(data) ? data : data?.content ?? [];
  return items.map(toVehicle);
}

export const toNewVehicleDto = (draft) => ({
  make: String(draft.make).trim(),
  model: String(draft.model).trim(),
  year: Number(draft.year),
  registrationNumber: String(draft.registrationNumber).trim(),
  dailyRate: Number(draft.dailyRate),
});