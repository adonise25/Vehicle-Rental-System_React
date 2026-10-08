import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../shared/ui/Alert";
import FormInput from "../../../shared/ui/FormInput";
import { useAddVehicle } from "../hooks";
import { validateVehicleDraft } from "../rules";

const EMPTY = {
  make: "",
  model: "",
  year: "",
  registrationNumber: "",
  dailyRate: "",
};

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { add, saving, error } = useAddVehicle();

  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateVehicleDraft(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const success = await add(form);

    if (success) {
      navigate("/vehicles");
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Add Vehicle</h1>
          <p className="muted">
            Add a vehicle to the rental fleet.
          </p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        {error && <Alert>{error}</Alert>}

        <FormInput
          label="Make"
          value={form.make}
          onChange={(event) =>
            updateField("make", event.target.value)
          }
          error={fieldErrors.make}
          placeholder="e.g. Toyota"
        />

        <FormInput
          label="Model"
          value={form.model}
          onChange={(event) =>
            updateField("model", event.target.value)
          }
          error={fieldErrors.model}
          placeholder="e.g. Corolla"
        />

        <FormInput
          label="Year"
          type="number"
          value={form.year}
          onChange={(event) =>
            updateField("year", event.target.value)
          }
          error={fieldErrors.year}
          placeholder="e.g. 2024"
        />

        <FormInput
          label="Registration Number"
          value={form.registrationNumber}
          onChange={(event) =>
            updateField(
              "registrationNumber",
              event.target.value
            )
          }
          error={fieldErrors.registrationNumber}
          placeholder="e.g. ABC 123 GP"
        />

        <FormInput
          label="Daily Rate"
          type="number"
          min="0"
          step="0.01"
          value={form.dailyRate}
          onChange={(event) =>
            updateField("dailyRate", event.target.value)
          }
          error={fieldErrors.dailyRate}
          placeholder="e.g. 750"
        />

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/vehicles")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Adding vehicle…" : "Add vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}