import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, ProtectedRoute, RegisterPage } from "../features/auth";
import {
  AddVehiclePage,
  VehiclesPage,
} from "../features/fleet";

import { RentalPage } from "../features/rentals";
import Navbar from "./Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/vehicles" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/new"
            element={
              <ProtectedRoute>
                <AddVehiclePage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/rent/:vehicleId"
          element={
          <ProtectedRoute>
            <RentalPage />
            </ProtectedRoute>
          }
          />
          <Route path="*" element={<Navigate to="/vehicles" replace />} />
        </Routes>
      </main>
    </>
  );
}
