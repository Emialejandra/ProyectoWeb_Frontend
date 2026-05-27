import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getFriendlyError } from "../../utils/errorMessages";
import { normalizeUser } from "../../utils/userUtils";

import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // LOGIN
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Credenciales inválidas");
      }


      // USUARIO DIRECTO 
      const user =
        data?.user ||
        data?.data?.user ||
        data;

      if (!user) {
        throw new Error("No se recibió usuario del backend");
      }

      const normalizedUser = normalizeUser(user);

      // TOKEN
      const token =
        data?.token ||
        data?.data?.token ||
        data?.data?.session?.access_token ||
        data?.session?.access_token ||
        null;

      if (token) {
        localStorage.setItem("token", token);
      }

      // Guardar usuario normalizado
      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser || user)
      );

      // VALIDACIÓN PERFIL
      const profileComplete =
        normalizedUser?.first_name?.trim() &&
        normalizedUser?.last_name?.trim() &&
        normalizedUser?.salary !== null &&
        normalizedUser?.salary !== "" &&
        Array.isArray(normalizedUser?.categories) &&
        normalizedUser.categories.length > 0;


      // REDIRECCIÓN
      navigate(profileComplete ? "/dashboard" : "/profile");

    } catch (err) {
      console.error(err);
      setError(getFriendlyError(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="login-card">

      <h2>Iniciar Sesión</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <Link to="/forgot-password" className="forgot-link">
        ¿Olvidaste tu contraseña?
      </Link>

      <div className="divider">
        <span>o</span>
      </div>

      <button
        type="button"
        className="btn-google"
        onClick={handleGoogleLogin}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
        />
        Continuar con Google
      </button>

      <button
        type="button"
        className="btn-register"
        onClick={() => navigate("/register")}
      >
        Crear cuenta nueva
      </button>

    </div>
  );
}

export default LoginForm;