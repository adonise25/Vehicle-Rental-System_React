import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth";

export default function Navbar() {
  const { isAuthenticated, email, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/vehicles" className="brand">
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          DriveEasy
        </NavLink>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/vehicles" end>
                Vehicles
              </NavLink>

              {role === "ADMIN" && (
                <NavLink to="/vehicles/new">
                  Add vehicle
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>

        {isAuthenticated && (
          <div className="nav-user">
            <span className="nav-email">{email}</span>

            <button
              className="btn btn-ghost"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}