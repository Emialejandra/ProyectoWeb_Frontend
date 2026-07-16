import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import { getFriendlyError } from "../../utils/errorMessages";
import { normalizeUser } from "../../utils/userUtils";

import { Eye, EyeOff } from "lucide-react";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Mostrar mensajes enviados desde DashboardUser.
   *
   * Se utiliza cuando:
   * - La cuenta de Google está desactivada.
   * - Falló la autenticación con Google.
   * - No se pudo recuperar el perfil.
   */
  useEffect(() => {
    const stateError = location.state?.error;
    const stateMessage = location.state?.message;

    if (stateError) {
      setError(stateError);
    } else if (stateMessage) {
      setError(stateMessage);
    }

    if (stateError || stateMessage) {
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [
    location.pathname,
    location.state,
    navigate,
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      console.log("LOGIN RESPONSE:", data);

      /*
       * El backend ya devuelve 403 cuando is_active es false.
       */
      if (response.status === 403) {
        throw new Error(
          "Tu cuenta ha sido desactivada. Comunícate con el administrador."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Correo electrónico o contraseña incorrectos."
        );
      }

      const rawUser = data?.data?.profile;
      const token = data?.data?.session?.access_token;

      if (!rawUser) {
        throw new Error(
          "No se recibió el perfil del usuario."
        );
      }

      /*
       * Validación adicional del frontend.
       */
      if (rawUser.is_active === false) {
        throw new Error(
          "Tu cuenta ha sido desactivada. Comunícate con el administrador."
        );
      }

      if (!token) {
        throw new Error(
          "No se recibió el token de autenticación."
        );
      }

      const normalizedUser = normalizeUser(rawUser);

      normalizedUser.role = rawUser.role || "user";

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      console.log("USER FINAL:", normalizedUser);

      /*
       * Redirección del administrador.
       */
      if (normalizedUser.role === "admin") {
        navigate("/admin-test", {
          replace: true,
        });

        return;
      }

      /*
       * Comprobar si el usuario completó el perfil.
       */
      const profileComplete =
        rawUser.profile_completed === true &&
        Boolean(normalizedUser?.first_name?.trim()) &&
        Boolean(normalizedUser?.last_name?.trim()) &&
        normalizedUser?.salary !== null &&
        normalizedUser?.salary !== undefined &&
        normalizedUser?.salary !== "" &&
        Array.isArray(normalizedUser?.categories) &&
        normalizedUser.categories.length > 0;

      if (!profileComplete) {
        navigate("/profile", {
          replace: true,
          state: {
            message:
              "Completa tu perfil para poder continuar.",
          },
        });

        return;
      }

      navigate("/dashboardUser", {
        replace: true,
      });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      const message =
        err?.message ||
        "No se pudo iniciar sesión. Inténtalo nuevamente.";

      /*
       * Evita que getFriendlyError cambie el mensaje
       * específico de cuenta desactivada.
       */
      if (
        message.toLowerCase().includes("desactivad") ||
        message.toLowerCase().includes("inactiv")
      ) {
        setError(
          "Tu cuenta ha sido desactivada. Comunícate con el administrador."
        );
      } else {
        setError(getFriendlyError(message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "No se pudo iniciar sesión con Google."
        );
      }

      if (!data?.url) {
        throw new Error(
          "No se recibió la dirección de autenticación de Google."
        );
      }

      /*
       * El backend devuelve la URL de Supabase/Google.
       * Al terminar, Google regresará a /dashboardUser.
       */
      window.location.assign(data.url);
    } catch (err) {
      console.error("Error Google Login:", err);

      setError(
        err?.message ||
          "No se pudo iniciar sesión con Google."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form
        className="login-form"
        onSubmit={handleLogin}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading || googleLoading}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading || googleLoading}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowPassword((previous) => !previous)
            }
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            disabled={loading || googleLoading}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="btn-login"
          disabled={loading || googleLoading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <Link
        to="/forgot-password"
        className="forgot-link"
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <div className="divider">
        <span>o</span>
      </div>

      <button
        type="button"
        className="btn-google"
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
        />

        {googleLoading
          ? "Conectando con Google..."
          : "Continuar con Google"}
      </button>

      <button
        type="button"
        className="btn-register"
        onClick={() => navigate("/register")}
        disabled={loading || googleLoading}
      >
        Crear cuenta nueva
      </button>
    </>
  );
}

export default LoginForm;