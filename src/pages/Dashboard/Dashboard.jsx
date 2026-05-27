import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { normalizeUser } from "../../utils/userUtils";
import "../../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    setLoading(true);

    try {
      const rawUser = JSON.parse(localStorage.getItem("user"));
      const user = normalizeUser(rawUser);

      if (!user) {
        navigate("/");
        return;
      }

      setProfile(user);

      const profileComplete =
        user.first_name?.trim() &&
        user.last_name?.trim() &&
        user.salary !== null &&
        user.salary !== "" &&
        Array.isArray(user.categories) &&
        user.categories.length > 0;

      console.log("Perfil:", user);
      console.log("Completo:", profileComplete);

      if (!profileComplete) {
        navigate("/profile");
        return;
      }

    } catch (error) {
      console.error(error);

      localStorage.removeItem("user");

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Cargando...</h2>
      </div>
    );
  }

  const categories = Array.isArray(profile?.categories)
    ? profile.categories
    : [];

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">

        <h1>Dashboard</h1>

        <div className="dashboard-actions">

          <button
            className="dashboard-btn btn-profile"
            onClick={() => setShowProfile(true)}
          >
            Perfil
          </button>

          <button
            className="dashboard-btn btn-logout"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>

        </div>

      </div>

      <div className="dashboard-welcome">

        <h2>Bienvenido al Sistema de Control de Gastos</h2>

        <p>
          Administra tus finanzas, controla tus gastos y alcanza tus metas de ahorro.
        </p>

      </div>

      <div className="dashboard-cards">

        {categories.map((cat, index) => (
          <div className="dashboard-card" key={index}>
            <h3>{cat}</h3>

            <div className="card-value">$0.00</div>

            <p>Gastos en la categoría {cat}</p>
          </div>
        ))}

      </div>

      {showProfile && (
        <div className="modal-overlay">

          <div className="modal-panel">

            <button
              className="close-btn"
              onClick={() => setShowProfile(false)}
            >
              ✕
            </button>

            <Profile />

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;