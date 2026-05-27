import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeUser } from "../../utils/userUtils";
import "../../styles/profile.css";

function Profile() {
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
  const [email, setEmail] = useState("");

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    age: "",
    salary: "",
    children_count: "",
    pets_count: "",
    categories: []
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    try {
      const token = getToken();
      const user = getUser();

      //  salir si no existe absolutamente nada
      if (!token && !user) {
        navigate("/");
        return;
      }

      if (!token && user) {
        setEmail(user.email || "");

        setProfile({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          age: user.age || "",
          salary: user.salary || "",
          children_count: user.children_count || "",
          pets_count: user.pets_count || "",
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

      if (!response.ok) {
        console.warn("Profile API falló, usando user local");

        if (user) {
          setEmail(user.email || "");

          setProfile({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            age: user.age || "",
            salary: user.salary || "",
            children_count: user.children_count || "",
            pets_count: user.pets_count || "",
            categories: user.categories || []
          });

          setLoading(false);
          return;
        }

        throw new Error(data.message || "No fue posible obtener el perfil");
      }

      setEmail(data.email || user?.email || "");

      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        age: data.age || "",
        salary: data.salary || "",
        children_count: data.children_count || "",
        pets_count: data.pets_count || "",
        categories: data.categories || []
      });

    } catch (error) {
      console.error("ERROR PROFILE:", error);

      setLoading(false);
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

    if (Number(profile.age) < 25) {
      alert("La edad mínima es 25 años");
      return;
    }

    if (!profile.salary || Number(profile.salary) < 0) {
      alert("Sueldo inválido");
      return;
    }

    if (profile.categories.length === 0) {
      alert("Selecciona al menos una categoría");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Sesión expirada");
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
        throw new Error(data.message || "Error al actualizar perfil");
      }

      const user = getUser();

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            ...profile
          })
        );
      }

      alert("Perfil actualizado correctamente");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Completa ambos campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      alert("Mínimo 6 caracteres");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Sesión expirada");
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
        throw new Error(data.message || "Error al cambiar contraseña");
      }

      alert("Contraseña actualizada");

      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(error);
      alert(error.message);
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
    <div className="profile-container">

      <h1>Mi Perfil</h1>

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

        <input
          type="email"
          value={email}
          disabled
        />

        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={profile.age}
          onChange={handleChange}
        />

        <h2>Información Financiera</h2>

        <input
          type="number"
          name="salary"
          placeholder="Sueldo"
          value={profile.salary}
          onChange={handleChange}
        />

        <input
          type="number"
          name="children_count"
          placeholder="Hijos"
          value={profile.children_count}
          onChange={handleChange}
        />

        <input
          type="number"
          name="pets_count"
          placeholder="Mascotas"
          value={profile.pets_count}
          onChange={handleChange}
        />

        <h2>Categorías</h2>

        {categoriesList.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={profile.categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}

        <button type="submit">
          Guardar
        </button>

      </form>

      <hr />

      <h2>Cambiar contraseña</h2>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleChangePassword}>
        Actualizar contraseña
      </button>

    </div>
  );
}

export default Profile;