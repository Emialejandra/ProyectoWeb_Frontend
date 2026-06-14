import { useState } from "react";

import { getFriendlyError } from "../../utils/errorMessages";

import "../../styles/forgot-reset.css";

function ForgotPassword() {

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleReset = async (e) => {

    e.preventDefault();

    setMessage("");
    setMessageType("");

    // VALIDAR EMAIL

    if (!email) {

      setMessageType("error");

      setMessage(
        "Ingresa un correo electrónico."
      );

      return;

    }

    setLoading(true);

    try {

      console.log("ENVIANDO EMAIL:", email);

      const response = await fetch(

        `${API_URL}/api/auth/forgot-password`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email

          }),

        }

      );

      // RESPUESTA DEL BACKEND

      const data =
        await response.json()
        .catch(() => null);

      console.log("STATUS:", response.status);

      console.log("DATA:", data);

      // ERROR

      if (!response.ok) {

        throw new Error(

          data?.message ||
          data?.error ||
          `Error ${response.status}`

        );

      }

      // ÉXITO

      setMessageType("success");

      setMessage(

        "Se ha enviado un enlace de recuperación a tu correo electrónico."

      );

      setEmail("");

    } catch (error) {

      console.error("FORGOT PASSWORD ERROR:", error);

      const errorText =

        typeof error === "string"

          ? error

          : error?.message || String(error);

      setMessageType("error");

      setMessage(

        getFriendlyError(errorText)

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h2>Recuperar Contraseña</h2>

        <form onSubmit={handleReset}>

          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Enviando..."
              : "Enviar enlace"}
          </button>

        </form>

        {message && (

          <p className={`auth-message ${messageType}`}>

            {message}

          </p>

        )}

      </div>

    </div>

  );

}

export default ForgotPassword;
