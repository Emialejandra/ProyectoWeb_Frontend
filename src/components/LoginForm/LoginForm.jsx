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

  const [tokenDebug, setTokenDebug] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
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

      //  USUARIO REAL (evita errores de estructura)
      const rawUser = data?.user || data?.data?.user || data?.data || null;

      if (!rawUser) {
        throw new Error("No se recibió usuario del backend");
      }

      const normalizedUser = normalizeUser(rawUser);

      // TOKEN (soporta múltiples backends)
      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.session?.access_token ||
        data?.data?.session?.access_token ||
        null;

      if (token) {
        localStorage.setItem("token", token);
        setTokenDebug(token);
      } else {
        console.warn("Login sin token (permitido en tu sistema)");
      }

      //  GUARDAR USER CORRECTO (SIN DUPLICAR VARIABLES)
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      //  VALIDACIÓN PERFIL COMPLETO
      const profileComplete =
        normalizedUser?.first_name?.trim() &&
        normalizedUser?.last_name?.trim() &&
        normalizedUser?.salary !== null &&
        normalizedUser?.salary !== "" &&
        Array.isArray(normalizedUser?.categories) &&
        normalizedUser.categories.length > 0;

      //  REDIRECCIÓN CONTROLADA
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

      {/* DEBUG TOKEN */}
      {tokenDebug && (
        <div className="token-box">
          <h4>Token de login</h4>
          <textarea
            readOnly
            value={tokenDebug}
            rows={4}
            style={{ width: "100%", fontSize: "12px" }}
          />
        </div>
      )}

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
        disabled={loading}
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
        disabled={loading}
      >
        Crear cuenta nueva
      </button>

    </div>
  );
}

export default LoginForm;