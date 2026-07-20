import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeUser } from "../../utils/userUtils";
import { getFriendlyError } from "../../utils/errorMessages";
import "../../styles/profile.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import "../../components/Navbar/Navbar.css";
import "../../styles/landing.css";

// Import para el icono 
import { Eye, EyeOff } from "lucide-react";

function Profile({ onClose }) {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const categoriesList = [
    "Alimentación",
    "Transporte",
    "Servicios Básicos",
    "Educación",
    "Vivienda",
    "Ahorro",
    "Deudas",
    "Extras"
  ];

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    age: "",
    salary: "",
    children_count: "",
    pets_count: "",
    categories: []
  });

  // ESTADOS
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" ? token : null;
  };

  const getUser = () => {
    const user = localStorage.getItem("user");
    const parsed = user ? JSON.parse(user) : null;
    return normalizeUser(parsed);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const loadProfile = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const token = getToken();
      const user = getUser();

      if (!token && !user) {
        navigate("/");
        return;
      }

      if (!token && user) {
        setEmail(user.email || "");
        setProfile({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          age: user.age ?? "",
          salary: user.salary ?? "",
          children_count: user.children_count ?? "",
          pets_count: user.pets_count ?? "",
          categories: user.categories || []
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      const data = await response.json();
      const profileData = {
        ...normalizeUser(data?.user || {}),
        ...(data?.profile || {})
      };

      if (!response.ok) {
        if (user) {
          setEmail(user.email || "");
          setProfile({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            age: user.age ?? "",
            salary: user.salary ?? "",
            children_count: user.children_count ?? "",
            pets_count: user.pets_count ?? "",
            categories: user.categories || []
          });
          setLoading(false);
          return;
        }
        throw new Error(data.message || "No fue posible obtener el perfil.");
      }

      setEmail(profileData.email || user?.email || "");
      setProfile({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        age: profileData.age ?? "",
        salary: profileData.salary ?? "",
        children_count: profileData.children_count ?? "",
        pets_count: profileData.pets_count ?? "",
        categories: profileData.categories || []
      });
    } catch (error) {
      console.error("ERROR PROFILE:", error);
      setErrorMessage(getFriendlyError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryChange = (category) => {
    setProfile((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (Number(profile.age) < 25) {
      setErrorMessage("La edad mínima permitida es 25 años.");
      return;
    }

    if (!profile.salary || Number(profile.salary) < 0) {
      setErrorMessage("El sueldo debe ser un valor válido.");
      return;
    }

    if (Number(profile.children_count) < 0) {
      setErrorMessage("La cantidad de hijos no puede ser negativa.");
      return;
    }

    if (Number(profile.pets_count) < 0) {
      setErrorMessage("La cantidad de mascotas no puede ser negativa.");
      return;
    }

    if (profile.categories.length === 0) {
      setErrorMessage("Debes seleccionar al menos una categoría.");
      return;
    }

    setSavingProfile(true);

    try {
      const token = getToken();

      if (!token) {
        setErrorMessage("Sesión expirada. Inicia sesión nuevamente.");
        logout();
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...profile,
          age: Number(profile.age),
          salary: Number(profile.salary),
          children_count: Number(profile.children_count || 0),
          pets_count: Number(profile.pets_count || 0)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar perfil.");
      }

      const user = getUser();

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            ...(data.profile || data.data || profile)
          })
        );
      }

      setSuccessMessage("Perfil actualizado correctamente.");
      await loadProfile();

      setTimeout(() => {
        if (onClose) {
          onClose(); 
        } else {
          navigate("/dashboardUser");
        }
      }, 1500);

    } catch (error) {
      console.error(error);
      setErrorMessage(getFriendlyError(error.message));
    } finally {
      setSavingProfile(false);
    }
  };

  //caracteres especiales en la contraseña 
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Completa ambos campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const token = getToken();

      if (!token) {
        setErrorMessage("Sesión expirada. Inicia sesión nuevamente.");
        logout();
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar contraseña.");
      }

      setSuccessMessage("Contraseña actualizada correctamente.");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(error);
      setErrorMessage(getFriendlyError(error.message));
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Cargando perfil...</h2>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="profile-container">
      
      <h1>Mi Perfil</h1>

      {successMessage && <div className="toast-success">{successMessage}</div>}
      {errorMessage && <div className="toast-error">{errorMessage}</div>}

      <form onSubmit={handleSave}>
        <h2>Información Personal</h2>

        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={profile.first_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={profile.last_name}
          onChange={handleChange}
        />

        <input type="email" value={email} disabled />

        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={profile.age}
          onChange={handleChange}
        />

        <h2>Información Financiera</h2>

        <p>Sueldo</p>
        <input
          type="number"
          name="salary"
          placeholder="Sueldo"
          min="250"
          value={profile.salary}
          onChange={handleChange}
        />
        <p>Hijos</p>
        <input
          type="number"
          name="children_count"
          placeholder="Hijos"
          min="0"
          value={profile.children_count}
          onChange={handleChange}
        />
        <p>Mascotas</p>
        <input
          type="number"
          name="pets_count"
          placeholder="Mascotas"
          min="0"
          value={profile.pets_count}
          onChange={handleChange}
        />

        <h2>Categorías</h2>
        <div className="categories-container">
          {categoriesList.map((category) => (
            <label key={category} className="category-item">
              <input
                type="checkbox"
                checked={(profile.categories || []).includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>

        <button type="submit" disabled={savingProfile}>
          {savingProfile ? "Guardando..." : "Guardar"}
        </button>
      </form>

      <hr />

      <h2>Cambiar contraseña</h2>

      <small className="password-hint">
        La contraseña debe contener al menos 8 caracteres,
        una letra mayúscula, un número y un carácter especial.
      </small>

      <div className="password-section">
        {/* NUEVA CONTRASEÑA CON OJO */}
        <div className="password-container">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* CONFIRMAR CONTRASEÑA CON OJO */}
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button onClick={handleChangePassword} disabled={changingPassword}>
          {changingPassword ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </div>
    </div>
    </>
  );
}

export default Profile;