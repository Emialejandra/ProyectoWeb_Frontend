import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { normalizeUser } from "../../utils/userUtils";
import "../../styles/dashboard.css";

function DashboardUser() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  // STATES
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  // FORMS
  const [incomeForm, setIncomeForm] = useState({
    title: "",
    amount: "",
    income_date: "",
    description: "",
    category: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    expense_date: "",
    description: "",
    category: "",
  });

  // LOAD DASHBOARD
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const rawUser = JSON.parse(localStorage.getItem("user"));
      const user = normalizeUser(rawUser);

      if (!user) {
        navigate("/");
        return;
      }

      setProfile(user);

      const token =
        localStorage.getItem("token") ||
        JSON.parse(localStorage.getItem("user"))?.token;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [expensesRes, incomesRes] = await Promise.all([
        fetch(`${API_URL}/api/expenses`, { headers }),
        fetch(`${API_URL}/api/incomes`, { headers }),
      ]);

      const expensesData = await expensesRes.json();
      const incomesData = await incomesRes.json();

      setExpenses(expensesData.data || []);
      setIncomes(incomesData.data || []);
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const categories = Array.isArray(profile?.categories)
    ? profile.categories
    : [];

  // CALCULOS
  const totalExpenses = (expenses || []).reduce(
    (t, e) => t + Number(e.amount),
    0
  );

  const totalIncomes = (incomes || []).reduce(
    (t, i) => t + Number(i.amount),
    0
  );

  const balance = totalIncomes - totalExpenses;

  const getCategoryTotal = (category) => {
    return (expenses || [])
      .filter(
        (e) =>
          e.category?.toLowerCase() === category.toLowerCase()
      )
      .reduce((t, e) => t + Number(e.amount), 0);
  };

  // INGRESOS
  const handleCreateIncome = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/incomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(incomeForm),
      });

      setShowIncomeModal(false);

      setIncomeForm({
        title: "",
        amount: "",
        income_date: "",
        description: "",
        category: "",
      });

      loadDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  // GASTOS
  const handleCreateExpense = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseForm),
      });

      setShowExpenseModal(false);

      setExpenseForm({
        title: "",
        amount: "",
        expense_date: "",
        description: "",
        category: "",
      });

      loadDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard de Usuario</h1>

        <div className="dashboard-actions">
          <button
            className="dashboard-btn btn-income"
            onClick={() => setShowIncomeModal(true)}
          >
            + Ingreso
          </button>

          <button
            className="dashboard-btn btn-expense"
            onClick={() => setShowExpenseModal(true)}
          >
            + Gasto
          </button>

          <button
            className="dashboard-btn btn-profile"
            onClick={() => setShowProfile(true)}
          >
            Perfil
          </button>

          <button
            className="dashboard-btn btn-logout"
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="dashboard-welcome">
        <h2>Bienvenido</h2>

        <div className="dashboard-summary">
          <div className="dashboard-card">
            <h3>Ingresos</h3>
            <div className="card-value">
              ${totalIncomes.toFixed(2)}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Gastos</h3>
            <div className="card-value">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Balance</h3>
            <div className="card-value">
              ${balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="dashboard-cards">
        {categories.map((cat, i) => (
          <div className="dashboard-card" key={i}>
            <h3>{cat}</h3>
            <div className="card-value">
              ${getCategoryTotal(cat).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <button
              className="close-btn"
              onClick={() => setShowProfile(false)}
            >
              ✕
            </button>

            <Profile
              onClose={() => {
                setShowProfile(false);
                loadDashboard();
              }}
            />
          </div>
        </div>
      )}

      {/* INCOME MODAL */}
      {showIncomeModal && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <button
              className="close-btn"
              onClick={() => setShowIncomeModal(false)}
            >
              ✕
            </button>

            <h2>Registrar Ingreso</h2>

            <form onSubmit={handleCreateIncome}>
              <input
                placeholder="Título"
                value={incomeForm.title}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    title: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Monto"
                value={incomeForm.amount}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    amount: e.target.value,
                  })
                }
              />

              {/* SELECT CATEGORÍAS */}
              <select
                value={incomeForm.category}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    category: e.target.value,
                  })
                }
              >
                <option value="">Seleccione categoría</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={incomeForm.income_date}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    income_date: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Descripción"
                value={incomeForm.description}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    description: e.target.value,
                  })
                }
              />

              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <button
              className="close-btn"
              onClick={() => setShowExpenseModal(false)}
            >
              ✕
            </button>

            <h2>Registrar Gasto</h2>

            <form onSubmit={handleCreateExpense}>
              <input
                placeholder="Título"
                value={expenseForm.title}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    title: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Monto"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    amount: e.target.value,
                  })
                }
              />

              {/* SELECT CATEGORÍAS */}
              <select
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    category: e.target.value,
                  })
                }
              >
                <option value="">Seleccione categoría</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={expenseForm.expense_date}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    expense_date: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Descripción"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: e.target.value,
                  })
                }
              />

              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardUser;