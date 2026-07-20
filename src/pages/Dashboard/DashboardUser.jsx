import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { normalizeUser } from "../../utils/userUtils";
import "../../styles/dashboard.css";
import "../../components/Navbar/Navbar.css";

//COMPONENTES
import SummaryCards from "../../components/Dashboard/SummaryCards";
import CategoryCards from "../../components/Dashboard/CategoryCards";
import PremiumCard from "../../components/Dashboard/PremiumCard";
import Navbar from "../../components/Navbar/Navbar";
import RegisterIncomeModal from "../../components/Income/RegisterIncomeModal";
import RegisterExpenseModal from "../../components/Expense/RegisterExpenseModal";
import ProfileModal from "../../components/Profile/ProfileModal";
import PremiumBenefits from "../../components/Dashboard/PremiumBenefits";
import IAChat from "../../components/IAChat/IAChat";
import TransactionHistory from "../../components/History/TransactionHistory";

// SERVICIOS
import { getDashboardData } from "../../services/dashboardService";
import { createIncome } from "../../services/incomeService";
import { createExpense } from "../../services/expenseService";
import { sendAIMessage } from "../../services/iaService";
function DashboardUser() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  // ESTADOS
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

  // DASHBOARD
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);

      const canContinue = await processGoogleLogin();

      if (!canContinue) {
        return;
      }

      await loadDashboard();
    };

    initializeDashboard();
  }, []);

  const processGoogleLogin = async () => {
    const hashParams = new URLSearchParams(
      window.location.hash.substring(1)
    );

    const accessToken = hashParams.get("access_token");
    const errorDescription = hashParams.get("error_description");

    if (errorDescription) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
        state: {
          error: decodeURIComponent(errorDescription),
        },
      });

      return false;
    }

    // No viene desde Google
    if (!accessToken) {
      return true;
    }

    try {
      localStorage.setItem("token", accessToken);

      // Limpiar los tokens visibles de la URL
      window.history.replaceState(
        {},
        document.title,
        "/dashboardUser"
      );

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No se pudo obtener el perfil."
        );
      }

      const rawProfile = data?.profile;

      if (!rawProfile) {
        throw new Error("No se recibió el perfil del usuario.");
      }

      // Cuenta desactivada
      if (rawProfile.is_active === false) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
          state: {
            error:
              "Tu cuenta ha sido desactivada. Comunícate con el administrador.",
          },
        });

        return false;
      }

      const normalizedUser = normalizeUser(rawProfile);
      normalizedUser.role = rawProfile.role || "user";

      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      // Administrador
      if (normalizedUser.role === "admin") {
        navigate("/admin-test", {
          replace: true,
        });

        return false;
      }

      // Usuario nuevo o perfil incompleto
      const profileComplete =
        rawProfile.profile_completed === true &&
        normalizedUser?.first_name?.trim() &&
        normalizedUser?.last_name?.trim() &&
        normalizedUser?.salary !== null &&
        normalizedUser?.salary !== "" &&
        Array.isArray(normalizedUser?.categories) &&
        normalizedUser.categories.length > 0;

      if (!profileComplete) {
        navigate("/profile", {
          replace: true,
          state: {
            message:
              "Tu cuenta de Google fue creada correctamente. Completa tu perfil para continuar.",
          },
        });

        return false;
      }

      return true;
    } catch (error) {
      console.error("Error procesando login con Google:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
        state: {
          error:
            error.message ||
            "No se pudo iniciar sesión con Google.",
        },
      });

      return false;
    }
  };

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const rawUser = JSON.parse(
        localStorage.getItem("user")
      );

      const normalizedUser = normalizeUser(rawUser);

      const user = {
        ...rawUser,
        ...normalizedUser,
        is_pro: rawUser?.is_pro ?? normalizedUser?.is_pro ?? false,
        plan: rawUser?.plan ?? normalizedUser?.plan ?? "FREE",
      };

      if (!user) {
        navigate("/");
        return;
      }

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

  const isPro =
    String(profile?.plan || "").toUpperCase() === "PRO";

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
          <h1>
            {profile
              ? `Bienvenido, ${profile.first_name}`
              : "Bienvenido"}
          </h1>

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
        <div className="dashboard-main">
          <div className="dashboard-left">
            <SummaryCards
              totalExpenses={totalExpenses}
              totalIncomes={totalIncomes}
              balance={balance}
            />

            <CategoryCards
              categories={categories}
              getCategoryTotal={getCategoryTotal}
            />
          </div>

          {/* HISTORIAL DE INGRESOS Y GASTOS */}
          <TransactionHistory />

          {/* CHATB SOLO PARA USUARIOS PRO */}
          {isPro && (
            <div className="dashboard-ai">
              <IAChat />
            </div>
          )}
        </div>

        {/*seccion premium*/}
        {isPro ? (
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