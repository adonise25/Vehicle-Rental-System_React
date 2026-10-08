import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../../shared/ui/Alert";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../hooks";
import { canRent, filterVehicles } from "../rules";

export default function VehiclesPage() {
  const navigate = useNavigate();

  const {
    status,
    vehicles,
    error,
    reload,
  } = useVehicles();

  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] =
    useState(false);

  const visible = useMemo(
    () =>
      filterVehicles(vehicles, {
        query,
        onlyAvailable,
      }),
    [vehicles, query, onlyAvailable]
  );

  const availableCount =
    vehicles.filter(canRent).length;

  const handleRent = (vehicle) => {
    navigate(`/rent/${vehicle.id}`, {
      state: { vehicle },
    });
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Vehicles</h1>

          {status === "ready" && (
            <p className="muted">
              {availableCount} of {vehicles.length}{" "}
              available
            </p>
          )}
        </div>

        <Link
          to="/vehicles/new"
          className="btn btn-secondary"
        >
          + Add vehicle
        </Link>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search make, model or registration"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          aria-label="Search vehicles"
        />

        <label className="check">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(event) =>
              setOnlyAvailable(event.target.checked)
            }
          />

          Available only
        </label>
      </div>

      {status === "loading" && (
        <p className="state">
          Loading vehicles…
        </p>
      )}

      {status === "error" && (
        <div className="state">
          <Alert>{error}</Alert>

          <button
            className="btn btn-secondary"
            onClick={() => reload()}
          >
            Try again
          </button>
        </div>
      )}

      {status === "ready" &&
        visible.length === 0 && (
          <p className="state">
            {vehicles.length === 0
              ? "No vehicles have been added yet."
              : "No vehicles match your search."}
          </p>
        )}

      <div className="grid">
        {visible.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onRent={handleRent}
          />
        ))}
      </div>
    </div>
  );
}