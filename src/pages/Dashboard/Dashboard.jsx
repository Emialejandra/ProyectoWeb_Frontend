import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import Profile from "../Profile/Profile";
import "../../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileData) {
        navigate("/profile");
        return;
      }

      setProfile(profileData);

      const profileComplete =
        profileData.first_name &&
        profileData.last_name &&
        profileData.salary &&
        Array.isArray(profileData.categories) &&
        profileData.categories.length > 0;

      if (!profileComplete) {
        navigate("/profile");
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Cargando...</h2>
      </div>
    );
  }

  // mostrar categorías del usuario
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

        {/*  SOLO categorías del usuario */}
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