import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../shared/ui/Alert";
import RentalForm from "../components/RentalForm";
import { useCreateRental } from "../hooks";

export default function RentalPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle = location.state?.vehicle;

  const {
    createRental,
    saving,
    error,
    rental,
  } = useCreateRental();

  if (!vehicle) {
    return (
      <div className="page">
        <Alert>
          Vehicle information was not provided.
        </Alert>

        <Link to="/vehicles" className="btn btn-secondary">
          Back to vehicles
        </Link>
      </div>
    );
  }

  const handleSubmit = async (draft) => {
    await createRental(draft);
  };

  if (rental) {
    return (
      <div className="page">
        <div className="card">
          <h1>Rental confirmed</h1>

          <p>
            Your rental has been created successfully.
          </p>

          <p>
            Rental ID: <strong>{rental.id}</strong>
          </p>

          <p>
            Dates: {rental.startDate} → {rental.endDate}
          </p>

          <p>
            Total:{" "}
            <strong>
              R{Number(rental.totalCost).toFixed(2)}
            </strong>
          </p>

          <Link
            to="/vehicles"
            className="btn btn-primary"
          >
            Back to vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Rent Vehicle</h1>
          <p className="muted">
            Choose your rental dates.
          </p>
        </div>
      </div>

      <RentalForm
        vehicle={vehicle}
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}