import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { normalizeUser } from "../../utils/userUtils";
import "../../styles/dashboard.css";

//components
import SummaryCards from "../../components/Dashboard/SummaryCards";
import CategoryCards from "../../components/Dashboard/CategoryCards";
import PremiumCard from "../../components/Dashboard/PremiumCard";
import Navbar from "../../components/Navbar/Navbar";
import RegisterIncomeModal from "../../components/Income/RegisterIncomeModal";
import RegisterExpenseModal from "../../components/Expense/RegisterExpenseModal";
import ProfileModal from "../../components/Profile/ProfileModal";
import PremiumBenefits from "../../components/Dashboard/PremiumBenefits";

// services 
import { getDashboardData } from "../../services/dashboardService";
import { createIncome } from "../../services/incomeService";
import { createExpense } from "../../services/expenseService";

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

      //temporal 
      console.log("PROFILE DASHBOARD:", JSON.stringify(user, null, 2));

      setProfile(user);

      const data = await getDashboardData();

      setExpenses(data.expenses);
      setIncomes(data.incomes);

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

      await createIncome(incomeForm);

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

      await createExpense(expenseForm);

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
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="dashboard-container">
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

          </div>
        </div>

        {/* SUMMARY */}
        <SummaryCards
          totalExpenses={totalExpenses}
          totalIncomes={totalIncomes}
          balance={balance}
        />

        {/* categorias */}
        <CategoryCards
          categories={categories}
          getCategoryTotal={getCategoryTotal}
        />

        {/* SECCIÓN PREMIUM */}
        {profile?.is_pro || profile?.plan === "PRO" ? (
          <PremiumBenefits />
        ) : (
          <PremiumCard />
        )}

        {/* Modal del perfil*/}
        <ProfileModal
          show={showProfile}
          onClose={() => setShowProfile(false)}
          onProfileUpdated={() => {
            setShowProfile(false);
            loadDashboard();
          }}
        />

        {/* INCOME MODAL */}
        <RegisterIncomeModal
          show={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          onSubmit={handleCreateIncome}
          incomeForm={incomeForm}
          setIncomeForm={setIncomeForm}
          categories={categories}
        />

        {/* EXPENSE MODAL */}
        <RegisterExpenseModal
          show={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          onSubmit={handleCreateExpense}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          categories={categories}
        />

      </div>
    </>
  );
}

export default DashboardUser;