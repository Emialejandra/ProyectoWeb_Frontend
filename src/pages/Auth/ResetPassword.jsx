import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "../../styles/forgot-reset.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setMessage("Error al actualizar la contraseña");
      return;
    }

    setMessage("Contraseña actualizada correctamente");

    await supabase.auth.signOut();

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
  <div className="auth-container">
    <div className="auth-box">
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Actualizar contraseña</button>
      </form>

      {message && <p className="auth-message">{message}</p>}
    </div>
  </div>
);
}

export default ResetPassword;