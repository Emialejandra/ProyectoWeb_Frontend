const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function createIncome(income) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/incomes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(income),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo registrar el ingreso");
  }

  return response.json();
}