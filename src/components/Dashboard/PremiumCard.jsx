import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/premiumCard.css";

function PremiumCard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
//Temporal
  console.log("API_URL =", import.meta.env.VITE_API_URL);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // si tienes auth

      const res = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url; // 👉 Stripe checkout
      } else {
        console.error("No se recibió URL de Stripe");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card premium-card">

      <h3>IA Financiera 🤖</h3>

      <p>
        Desbloquea recomendaciones, predicciones y reportes inteligentes.
      </p>

      <button
        className="dashboard-btn btn-income"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Mejorar el Plan 🌟"}
      </button>

    </div>
  );
}

export default PremiumCard;