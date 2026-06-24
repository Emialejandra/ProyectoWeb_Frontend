import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import DashboardAdmin from "../pages/Dashboard/DashboardAdmin";
import Profile from "../pages/Profile/Profile";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import UpdatePassword from "../pages/Auth/UpdatePassword";
import Landing from "../pages/Landing/Landing";
import DashboardUser from "../pages/Dashboard/DashboardUser";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/home" element={<Home />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/update-password" element={<UpdatePassword />} />

      <Route path="/" element={<Landing />} />

      {/* USUARIO LOGUEADO */}
      <Route
        path="/dashboardUser"
        element={
          <ProtectedRoute>
            <DashboardUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* SOLO ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      {/* TEST */}
      <Route
        path="/admin-test"
        element={<DashboardAdmin />}
      />

    </Routes>
  );
}

export default AppRoutes;