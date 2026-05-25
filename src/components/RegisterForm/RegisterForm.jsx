// src/components/RegisterForm/RegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { supabase } from "../../services/supabaseClient";

function RegisterForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        edad: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    //registro tradicional
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: `${formData.nombre} ${formData.apellido}`,
                        edad: formData.edad
                    }
                }
            });

            console.log("Respuesta Supabase:", data);

            if (error) {
                throw error;
            }

            alert(
                "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta."
            );

            navigate("/");

        } catch (error) {

            console.error("Error al crear usuario:", error);

            alert(
                error.message ||
                "No fue posible registrar el usuario."
            );
        }
    };

    //registro con Google
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) {
            alert(
                error.message ||
                "No fue posible iniciar sesión con Google."
            );
        }
    };

    return (
        <div className="register-card">

            <h2>Crear Cuenta</h2>

            <form className="register-form"
                onSubmit={handleSubmit}>

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
                >
                    Registrarse
                </button>

                <button type="button"
                    className="btn-google"
                    onClick={handleGoogleLogin}
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