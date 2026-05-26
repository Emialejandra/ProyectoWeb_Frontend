import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { getFriendlyError } from "../../utils/errorMessages";

import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login tradicional
  const handleLogin = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    const profileComplete =
      profile &&
      profile.first_name &&
      profile.last_name &&
      profile.salary &&
      profile.categories &&
      profile.categories.length > 0;

    if (profileComplete) {
      navigate("/dashboard");
    } else {
      navigate("/profile");
    }

  } catch (err) {
  setError(getFriendlyError(err));
}

  setLoading(false);
};

  // Login con Google
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;

    } catch (err) {
      setError(getFriendlyError(err));
    }
  };

  return (
    <div className="login-card">
      <h2>Iniciar Sesión</h2>

      {error && (
        <div className="error-message">
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
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn-login"
          disabled={loading}
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