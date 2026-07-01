import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getFriendlyError } from "../../utils/errorMessages";
import { normalizeUser } from "../../utils/userUtils";

import { Eye, EyeOff } from "lucide-react";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      console.log("LOGIN RESPONSE:", data);

      console.log("USER:", JSON.stringify(data.data.user, null, 2));
      console.log("PROFILE:", JSON.stringify(data.data.profile, null, 2));

      if (!response.ok) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      const rawUser = data?.data?.profile;

      if (!rawUser) {
        throw new Error("No se recibió usuario del backend");
      }

      // ASEGURAR ROLE 
      const role = rawUser.role || "user";

      // NORMALIZAR USUARIO
      const normalizedUser = normalizeUser(rawUser);
      normalizedUser.role = role;
      console.log("USER FINAL:", normalizedUser);

      // TOKEN
      const token = data?.data?.session?.access_token || null;

      if (token) {
        localStorage.setItem("token", token);
      }

      // GUARDAR USER
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // REDIRECCIÓN POR ROL
      if (role === "admin") {
        navigate("/admin-test");
        return;
      }

      navigate("/dashboardUser");

      // VALIDACIÓN PERFIL
      const profileComplete =
        normalizedUser?.first_name?.trim() &&
        normalizedUser?.last_name?.trim() &&
        normalizedUser?.salary !== null &&
        normalizedUser?.salary !== "" &&
        Array.isArray(normalizedUser?.categories) &&
        normalizedUser.categories.length > 0;

      if (profileComplete) {
        navigate("/dashboardUser");
      } else {
        navigate("/profile", {
          state: {
            message: "Completa tu perfil para poder continuar.",
          },
        });
      }
    } catch (err) {
      console.error(err);
      setError(getFriendlyError(err.message || err));
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Error Google Login:", error);
    }
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

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
    </>
  );
}

export default LoginForm;