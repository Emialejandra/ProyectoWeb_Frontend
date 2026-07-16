import { useState } from "react";
import "../../styles/premiumCard.css";

function PremiumCard() {
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleCheckout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Debes iniciar sesión para comprar el Plan PRO.");
        return;
      }

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

      const responseText = await res.text();

      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        console.error("Respuesta no válida:", responseText);

        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      console.log("CHECKOUT STATUS:", res.status);
      console.log("CHECKOUT RESPONSE:", data);

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
          "Tu sesión ha expirado. Inicia sesión nuevamente."
        );
      }

      if (res.status === 403) {
        throw new Error(
          data?.message ||
          "No tienes permiso para realizar esta compra."
        );
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
          `No se pudo iniciar el pago. Código ${res.status}.`
        );
      }

      const checkoutUrl =
        data?.url ||
        data?.checkoutUrl ||
        data?.checkout_url ||
        data?.data?.url ||
        data?.data?.checkoutUrl ||
        data?.data?.checkout_url;

      console.log("URL CHECKOUT:", checkoutUrl);

      if (!checkoutUrl) {
        throw new Error(
          "El backend no devolvió la URL de Stripe."
        );
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Error en checkout:", error);

      alert(
        error?.message ||
        "No se pudo procesar el pago."
      );
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