import { useState } from "react";
import { canRent, formatPrice } from "../rules";

function CarIcon() {
  return (
    <svg
      viewBox="0 0 64 32"
      width="96"
      height="48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 22v-4c0-2 1-3 3-3l6-1 6-7c1-1 2-2 4-2h16c2 0 3 1 4 2l5 7 6 1c2 0 3 2 3 4v4c0 1-1 2-2 2h-3a6 6 0 0 1-12 0H27a6 6 0 0 1-12 0H8c-1 0-2-1-2-2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="21" cy="24" r="4" fill="var(--surface)" />
      <circle cx="47" cy="24" r="4" fill="var(--surface)" />
    </svg>
  );
}

export default function VehicleCard({ vehicle, onRent }) {
  const { make, model, year, registrationNumber, dailyRate } = vehicle;

  const rentable = canRent(vehicle);
  const [imageFailed] = useState(false);

  return (
    <article
      className={`card vehicle-card ${
        rentable ? "" : "is-unavailable"
      }`}
    >
      <div className="vehicle-visual">
        {!imageFailed ? <CarIcon /> : <CarIcon />}

        <span
          className={`badge ${
            rentable ? "badge-ok" : "badge-off"
          }`}
        >
          {rentable ? "Available" : "Rented"}
        </span>
      </div>

      <div className="vehicle-body">
        <p className="vehicle-meta">
          {registrationNumber}
          {year ? ` · ${year}` : ""}
        </p>

        <h3>
          {make} {model}
        </h3>

        <p className="vehicle-price">
          <strong>{formatPrice(dailyRate)}</strong>
          <span> / day</span>
        </p>
      </div>

      <button
        className="btn btn-primary btn-block"
        disabled={!rentable}
        onClick={() => onRent(vehicle)}
      >
        {rentable ? "Rent now" : "Unavailable"}
      </button>
    </article>
  );
}