const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function createExpense(expense) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/expenses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo registrar el gasto");
  }

  return response.json();
}