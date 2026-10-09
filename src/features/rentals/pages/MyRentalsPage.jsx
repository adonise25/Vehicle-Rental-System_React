import { useEffect, useState } from "react";
import { messageOf } from "../../../shared/http/errors";
import Alert from "../../../shared/ui/Alert";
import { useAuth } from "../../auth";
import { useVehicles } from "../../fleet";
import { rentalApi } from "../api";

export default function MyRentalsPage() {
  const { user } = useAuth();

  const {
    vehicles,
    status: vehiclesStatus,
    error: vehiclesError,
  } = useVehicles();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await rentalApi.listByUser(user.id);
      setRentals(data);
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, [user?.id]);

  const handleReturn = async (rentalId) => {
    setError("");

    try {
      const returnedRental =
        await rentalApi.returnRental(rentalId);

      setRentals((current) =>
        current.map((rental) =>
          rental.id === returnedRental.id
            ? returnedRental
            : rental
        )
      );
    } catch (err) {
      setError(messageOf(err));
    }
  };

  if (loading || vehiclesStatus === "loading") {
    return (
      <section className="page">
        <h1>My Rentals</h1>
        <p className="muted">
          Loading your rentals...
        </p>
      </section>
    );
  }

  const pageError = error || vehiclesError;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>My Rentals</h1>
          <p className="muted">
            View your current and previous rentals.
          </p>
        </div>
      </div>

      {pageError && <Alert>{pageError}</Alert>}

      {rentals.length === 0 ? (
        <div className="card">
          <h2>No rentals yet</h2>
          <p className="muted">
            You haven't rented a vehicle yet.
          </p>
        </div>
      ) : (
        <div className="rental-list">
          {rentals.map((rental) => {
            const vehicle = vehicles.find(
              (item) => item.id === rental.vehicleId
            );

            return (
              <article
                className="card rental-card"
                key={rental.id}
              >
                <div>
                  <h2>
                    {vehicle
                      ? `${vehicle.make} ${vehicle.model}`
                      : `Vehicle #${rental.vehicleId}`}
                  </h2>

                  {vehicle && (
                    <>
                      <p>
                        <strong>Year:</strong>{" "}
                        {vehicle.year}
                      </p>

                      <p>
                        <strong>Registration:</strong>{" "}
                        {vehicle.registrationNumber}
                      </p>

                      <p>
                        <strong>Daily rate:</strong>{" "}
                        R{Number(vehicle.dailyRate).toFixed(2)}
                      </p>
                    </>
                  )}

                  <hr />

                  <p>
                    <strong>Rental period:</strong>{" "}
                    {rental.startDate} → {rental.endDate}
                  </p>

                  <p>
                    <strong>Total cost:</strong>{" "}
                    R{rental.totalCost.toFixed(2)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {rental.status}
                  </p>
                </div>

                {rental.status === "ACTIVE" && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleReturn(rental.id)
                    }
                  >
                    Return Vehicle
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}