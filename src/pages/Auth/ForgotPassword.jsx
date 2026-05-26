import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "../../styles/forgot-reset.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password"
    });

    if (error) {
      setMessage("Error al enviar el correo");
      return;
    }

    setMessage("Revisa tu correo para cambiar la contraseña");
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

        <button type="submit">Enviar enlace</button>
      </form>

      {message && <p className="auth-message">{message}</p>}
    </div>
  </div>
);
}

export default ForgotPassword;