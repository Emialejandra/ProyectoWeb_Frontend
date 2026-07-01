const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getDashboardData() {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [expensesRes, incomesRes] = await Promise.all([
    fetch(`${API_URL}/api/expenses`, { headers }),
    fetch(`${API_URL}/api/incomes`, { headers }),
  ]);

  if (!expensesRes.ok || !incomesRes.ok) {
    throw new Error("Error al cargar el dashboard");
  }

  const expenses = await expensesRes.json();
  const incomes = await incomesRes.json();

  return {
    expenses: expenses.data || [],
    incomes: incomes.data || [],
  };
}