import { useState } from "react";
import "../../styles/forgot-reset.css";

function ForgotPassword() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Error al enviar el correo"
        );
      }

      setMessage(
        "Se ha enviado un enlace de recuperación a tu correo electrónico."
      );

      setEmail("");

    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "No fue posible procesar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Recuperar contraseña</h2>

        <form onSubmit={handleReset}>

          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;