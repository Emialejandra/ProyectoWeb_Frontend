import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { getFriendlyError } from "../../utils/errorMessages";

import "../../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

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

  const loadProfile = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      setEmail(user.email);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error(error);
        return;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          age: data.age || "",
          salary: data.salary || "",
          children_count: data.children_count || "",
          pets_count: data.pets_count || "",
          categories: data.categories || []
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
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
      alert("La edad mínima permitida es 25 años.");
      return;
    }

    if (!profile.salary) {
      alert("Debe ingresar su sueldo mensual.");
      return;
    }

    if (Number(profile.salary) < 0) {
      alert("El sueldo no puede ser negativo.");
      return;
    }

    if (profile.categories.length === 0) {
      alert("Seleccione al menos una categoría.");
      return;
    }

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: profile.first_name.trim(),
          last_name: profile.last_name.trim(),
          age: Number(profile.age),
          salary: Number(profile.salary),
          children_count: Number(profile.children_count || 0),
          pets_count: Number(profile.pets_count || 0),
          categories: profile.categories
        });

      if (error) {
        alert(getFriendlyError(error));
        return;
      }

      alert("Perfil actualizado correctamente");

      setTimeout(() => {
        window.location.reload();
      }, 300);
      
    } catch (error) {
      console.error(error);
      alert(getFriendlyError(error));
    }
  };

  // Función para cambiar contraseña
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Debes llenar ambos campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        alert(getFriendlyError(error));
        return;
      }

      alert("Contraseña actualizada correctamente");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    }
  };

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
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={profile.last_name}
          onChange={handleChange}
          required
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
          min="25"
          required
        />

        <h2>Información Financiera</h2>

        <input
          type="number"
          name="salary"
          placeholder="Sueldo mensual"
          value={profile.salary}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          type="number"
          name="children_count"
          placeholder="Número de hijos"
          value={profile.children_count}
          onChange={handleChange}
          min="0"
        />

        <input
          type="number"
          name="pets_count"
          placeholder="Número de mascotas"
          value={profile.pets_count}
          onChange={handleChange}
          min="0"
        />

        <h2>Categorías frecuentes</h2>

        {categoriesList.map((category) => (
          <label key={category} style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="checkbox"
              checked={profile.categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {" "}
            {category}
          </label>
        ))}

        <button type="submit">
          Guardar Información
        </button>

      </form>

      <hr />

      <h2>Cambiar Contraseña</h2>

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

      <button
        type="button"
        onClick={handleChangePassword}
      >
        Actualizar contraseña
      </button>

    </div>
  );
}

export default Profile;