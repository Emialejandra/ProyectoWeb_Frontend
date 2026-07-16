const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }

  if (response.status === 403) {
    throw new Error(
      data.message ||
        "Tu cuenta ha sido desactivada. Comunícate con el administrador."
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Correo o contraseña incorrectos.");
  }

  return data;
};