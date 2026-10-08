import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { messageOf } from "../../../shared/http/errors";
import Alert from "../../../shared/ui/Alert";
import FormInput from "../../../shared/ui/FormInput";
import { useAuth } from "../AuthContext";
import { validateRegistration } from "../rules";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/vehicles" replace />;
  }

  const update = (field) => (e) => {
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    const found = validateRegistration(form);

    setErrors(found);

    if (Object.keys(found).length) {
      return;
    }

    setLoading(true);

    try {
      await register(form);

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      setServerError(messageOf(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form
        className="card auth-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1>Create your account</h1>

        <p className="muted">
          It takes less than a minute.
        </p>

        {serverError && <Alert>{serverError}</Alert>}

        <FormInput
          label="Full name"
          id="fullName"
          type="text"
          autoComplete="name"
          value={form.fullName}
          onChange={update("fullName")}
          error={errors.fullName}
        />

        <FormInput
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />

        <FormInput
          label="Phone"
          id="phone"
          type="text"
          inputMode="tel"
          autoComplete="tel"
          maxLength={10}
          value={form.phone}
          onChange={update("phone")}
          error={errors.phone}
        />

        <FormInput
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />

        <FormInput
          label="Confirm password"
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={update("confirm")}
          error={errors.confirm}
        />

        <button
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Register"}
        </button>

        <p className="auth-switch">
          Already registered?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}