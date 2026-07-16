const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getHistory() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const response = await fetch(`${API_URL}/api/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseText = await response.text();

  let data = null;

  try {
    data = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    data = null;
  }

  console.log("HISTORY STATUS:", response.status);
  console.log("HISTORY RAW RESPONSE:", responseText);
  console.log("HISTORY JSON:", data);

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 404) {
    throw new Error(
      "El endpoint del historial no fue encontrado. Verifica la URL /api/history."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `No se pudo obtener el historial. Código ${response.status}.`
    );
  }

  return (
    data?.data?.history ||
    data?.data ||
    data?.history ||
    []
  );
}