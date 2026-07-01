import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "../../services/paymentService";
import "./Pricing.css";

function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = await createCheckoutSession(token);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("No se recibió URL de pago.");
      }

    } catch (error) {
      console.error(error);
      alert("No se pudo iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">

      <h1>Planes</h1>

      <div className="plans">

        {/* FREE */}
        <div className="plan free">
          <h2>PLAN GRATUITO</h2>

          <ul>
            <li>✔ Registrar ingresos</li>
            <li>✔ Registrar gastos</li>
            <li>✔ Dashboard financiero</li>
            <li>✔ Categorías</li>
          </ul>
        </div>

        {/* PRO */}
        <div className="plan pro">
          <span className="badge">PRO ⭐</span>

          <h2>$15</h2>

          <ul>
            <li>✔ Todo el plan gratuito</li>
            <li>✔ IA Financiera</li>
            <li>✔ Predicción de gastos</li>
            <li>✔ Reportes inteligentes</li>
            <li>✔ Consejos financieros</li>
          </ul>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="btn-pro"
          >
            {loading ? "Redireccionando..." : "Comprar Plan PRO"}
          </button>
        </div>

      </div>

      <button
        className="back-btn"
        onClick={() => navigate("/dashboardUser")}
      >
        Volver
      </button>

    </div>
  );
}

export default Pricing;