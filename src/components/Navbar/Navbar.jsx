import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        Sistema de Control de Gastos con IA
      </div>

      {/* Botón hamburguesa */}
      <button
        type="button"
        className={`navbar-menu-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navegación del navbar */}
      <nav className={`navbar-links ${menuOpen ? "show" : ""}`}>
        <NavLink
          to="/dashboardUser"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Perfil
        </NavLink>

        <NavLink
          to="/pricing"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "active pro-link" : "pro-link"
          }
        >
          🌟 Plan PRO
        </NavLink>

        <button
          type="button"
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