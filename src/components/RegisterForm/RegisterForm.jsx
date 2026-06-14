import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFriendlyError } from "../../utils/errorMessages";
import "./RegisterForm.css";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Registro tradicional
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (Number(formData.edad) < 25) {
      setError("La edad mínima permitida es 25 años.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No fue posible registrar el usuario."
        );
      }

      setError("");
      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      alert(
        "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta."
      );

      navigate("/");

    } catch (err) {
      console.error(err);
      setError(getFriendlyError(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Login con Google mediante backend
  const handleGoogleLogin = () => {
    window.location.href =
      `${API_URL}/api/auth/google`;
  };

  return (
    <div className="register-card">

      <h2>Crear Cuenta</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >

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

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn-register"
          disabled={loading}
        >
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

        <button
          type="button"
          className="login-link"
          onClick={() => navigate("/")}
        >
          Iniciar sesión
        </button>
      </p>

    </div>
  );
}

export default RegisterForm;