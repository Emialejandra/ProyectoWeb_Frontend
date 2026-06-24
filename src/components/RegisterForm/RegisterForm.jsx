import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFriendlyError } from "../../utils/errorMessages";
import "./RegisterForm.css";

// Visualización de contraseña e iconos de alerta
import { Eye, EyeOff, AlertTriangle, CheckCircle, X } from "lucide-react";

function RegisterForm() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // 💡 Nuevo estado para el Toast de éxito
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Efecto para limpiar las alertas automáticamente después de 4 segundos
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (Number(formData.edad) < 25) {
      setError("La edad mínima permitida es 25 años.");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.nombre,
          last_name: formData.apellido,
          age: Number(formData.edad),
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No fue posible registrar el usuario.");
      }

      setError("");
      // Cambiamos el alert monótono por tu nuevo Toast dinámico
      setSuccessMessage("Cuenta creada correctamente. Revisa tu correo.");

      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      // Damos 3 segundos para que lea el Toast de éxito antes de redirigir
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (err) {
      console.error(err);
      setError(getFriendlyError(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Logueo con Google
  const handleGoogleLogin = async () => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="register-card">

      {/* CONTENEDOR FLOTANTE DE TOASTS */}
      <div className="toast-container">
        {error && (
          <div className="toast-notification toast-error">
            <div className="toast-content">
              <AlertTriangle className="toast-icon" size={20} />
              <p>{error}</p>
            </div>
            <button type="button" className="btn-toast-close" onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="toast-notification toast-success">
            <div className="toast-content">
              <CheckCircle className="toast-icon" size={20} />
              <p>{successMessage}</p>
            </div>
            <button type="button" className="btn-toast-close" onClick={() => setSuccessMessage("")}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <h2>Crear Cuenta</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
          min="25"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <h3>Contraseña</h3>
        <small className="password-hint">
          La contraseña debe contener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.
        </small>

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
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

        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="btn-register" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

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
      </form>

      <p className="login-text">
        ¿Ya tienes cuenta?
        <button type="button" className="login-link" onClick={() => navigate("/home")}>
          Iniciar sesión
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;