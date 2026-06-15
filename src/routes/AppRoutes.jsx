import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import UpdatePassword from "../pages/Auth/UpdatePassword";
import Landing from "../pages/Landing/Landing";

function AppRoutes() {

  return (
    <Routes>

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/update-password"
        element={<UpdatePassword />}
      />

      <Route
        path="/"
        element={<Landing />}
      />

    </Routes>
  );
}

export default AppRoutes;
