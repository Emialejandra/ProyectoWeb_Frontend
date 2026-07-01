import { useState } from "react";
import "../../styles/premiumCard.css";

function PremiumCard() {
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

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

      console.log("Respuesta backend:", data);

      const checkoutUrl = data?.data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("No se recibió URL de Stripe");
        alert("No se pudo iniciar el checkout");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al procesar el pago");
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