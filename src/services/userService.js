const API_URL = import.meta.env.VITE_API_URL;

export const getUserStatus = async (token) => {
  const res = await fetch(`${API_URL}/api/payments/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error obteniendo estado del usuario");
  }

  return await res.json();
};