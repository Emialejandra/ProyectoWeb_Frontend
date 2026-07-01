import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="navbar">

      <div className="navbar-logo">
        Sistema de Control de Gastos con IA
      </div>

      <nav className="navbar-links">

        <NavLink
          to="/dashboardUser"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Perfil
        </NavLink>

        <NavLink
          to="/pricing"
          className={({ isActive }) => isActive ? "active pro-link" : "pro-link"}
        >
          🌟 Plan PRO
        </NavLink>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Salir
        </button>

      </nav>

    </header>
  );
}

export default Navbar;