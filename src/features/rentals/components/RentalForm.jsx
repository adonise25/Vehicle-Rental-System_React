import { useMemo, useState } from "react";
import Alert from "../../../shared/ui/Alert";
import {
  calculateEstimatedCost,
  validateRentalDates,
} from "../rules";

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

export default function RentalForm({
  vehicle,
  saving,
  error,
  onSubmit,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const estimatedCost = useMemo(
    () =>
      calculateEstimatedCost(
        vehicle.dailyRate,
        startDate,
        endDate
      ),
    [vehicle.dailyRate, startDate, endDate]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateRentalDates(
      startDate,
      endDate
    );

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit({
      vehicleId: vehicle.id,
      startDate,
      endDate,
    });
  };

  return (
    <form className="card rental-form" onSubmit={handleSubmit}>
      <h2>Rent this vehicle</h2>

      <p className="muted">
        {vehicle.make} {vehicle.model}
      </p>

      <p>
        Daily rate:{" "}
        <strong>{zar.format(vehicle.dailyRate)}</strong>
      </p>

      {error && <Alert>{error}</Alert>}

      <div className="form-group">
        <label htmlFor="startDate">
          Start date
        </label>

        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(event) => {
            setStartDate(event.target.value);
            setFieldErrors((current) => ({
              ...current,
              startDate: "",
            }));
          }}
          required
        />

        {fieldErrors.startDate && (
          <p className="field-error">
            {fieldErrors.startDate}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="endDate">
          End date
        </label>

        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(event) => {
            setEndDate(event.target.value);
            setFieldErrors((current) => ({
              ...current,
              endDate: "",
            }));
          }}
          required
        />

        {fieldErrors.endDate && (
          <p className="field-error">
            {fieldErrors.endDate}
          </p>
        )}
      </div>

      <div className="rental-summary">
        <span>Estimated total</span>
        <strong>{zar.format(estimatedCost)}</strong>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={saving}
      >
        {saving ? "Confirming rental…" : "Confirm rental"}
      </button>
    </form>
  );
}