import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { messageOf } from "../../../shared/http/errors";
import Alert from "../../../shared/ui/Alert";
import FormInput from "../../../shared/ui/FormInput";
import { useAuth } from "../AuthContext";
import { validateLogin } from "../rules";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/vehicles" replace />;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validateLogin(form); // fail early, before any network call
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from || "/vehicles", { replace: true });
    } catch (err) {
      setServerError(messageOf(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Welcome back</h1>
        <p className="muted">Log in to browse and rent vehicles.</p>

        {location.state?.registered && <Alert type="success">Account created. You can log in now.</Alert>}
        {serverError && <Alert>{serverError}</Alert>}

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
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
