import React, { useEffect, useState } from "react";
import "../../styles/admin.css";

import {
  Users,
  UserCheck,
  FileCheck,
  ShieldAlert,
  RefreshCw,
  Trash2,
  BarChart3,
  Tags,
  LogOut,
  Crown,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const CHART_COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [profileStats, setProfileStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminProfile, setShowAdminProfile] =
    useState(false);

  // PETICIONES AUTENTICADAS

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No existe una sesión activa.");
      localStorage.clear();
      window.location.href = "/";
      return null;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      alert("Tu sesión ha expirado.");

      localStorage.clear();
      window.location.href = "/";

      return null;
    }

    if (response.status === 403) {
      throw new Error(
        "No tienes permisos para realizar esta acción."
      );
    }

    return response;
  };

  // PROCESAR RESPUESTAS

  const parse = async (response) => {
    if (!response) {
      return null;
    }

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Ocurrió un error al consumir la API."
      );
    }

    return data?.data ?? data;
  };

  // OBTENER USUARIOS

  const fetchUsers = async () => {
    try {
      const response = await authFetch(
        `${API_URL}/api/admin/users`
      );

      const data = await parse(response);

      const userList = Array.isArray(data)
        ? data
        : Array.isArray(data?.users)
          ? data.users
          : [];

      setUsers(userList);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsers([]);
    }
  };

  // OBTENER ESTADÍSTICAS

  const fetchProfileStats = async () => {
    try {
      const response = await authFetch(
        `${API_URL}/api/admin/statistics/profile-status`
      );

      const data = await parse(response);

      setProfileStats(data);
    } catch (error) {
      console.error(
        "Error al obtener estadísticas de perfiles:",
        error
      );

      setProfileStats(null);
    }
  };

  // OBTENER CATEGORÍAS

  const fetchCategories = async () => {
    try {
      const response = await authFetch(
        `${API_URL}/api/admin/statistics/top-categories`
      );

      const data = await parse(response);

      const categoryList = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
          ? data.categories
          : [];

      setCategories(categoryList);
    } catch (error) {
      console.error(
        "Error al obtener categorías:",
        error
      );

      setCategories([]);
    }
  };

  // OBTENER TODOS LOS DATOS

  const fetchAll = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchUsers(),
        fetchProfileStats(),
        fetchCategories(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ELIMINAR USUARIO

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar al usuario ${user.email}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(user.id);

      const response = await authFetch(
        `${API_URL}/api/admin/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      await parse(response);

      alert("Usuario eliminado correctamente.");

      await fetchAll();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // CAMBIAR ROL

  const handleToggleRole = async (user) => {
    const newRole =
      user.role === "admin" ? "user" : "admin";

    const confirmed = window.confirm(
      `¿Deseas cambiar el rol de ${user.email} a ${newRole}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(user.id);

      const response = await authFetch(
        `${API_URL}/api/admin/users/${user.id}/role`,
        {
          method: "PUT",
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      await parse(response);

      alert(`Rol actualizado correctamente a ${newRole}.`);

      await fetchUsers();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      alert(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ACTIVAR O DESACTIVAR

  const handleToggleStatus = async (user) => {
    const currentStatus = user.is_active === true;
    const newStatus = !currentStatus;

    const action = newStatus
      ? "activar"
      : "desactivar";

    const confirmed = window.confirm(
      `¿Seguro que deseas ${action} al usuario ${user.email}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(user.id);

      const response = await authFetch(
        `${API_URL}/api/admin/users/${user.id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      await parse(response);

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                is_active: newStatus,
              }
            : currentUser
        )
      );

      alert(
        newStatus
          ? "Usuario activado correctamente."
          : "Usuario desactivado correctamente."
      );

      await fetchUsers();
    } catch (error) {
      console.error(
        "Error al cambiar estado:",
        error
      );

      alert(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // INFORMACIÓN DEL ADMIN

  let storedUser = {};
  let storedProfile = {};

  try {
    storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    storedUser = {};
  }

  try {
    storedProfile = JSON.parse(
      localStorage.getItem("profile") || "{}"
    );
  } catch {
    storedProfile = {};
  }

  const currentUser = {
    ...storedUser,
    ...storedUser.user_metadata,
    ...storedProfile,
  };

  // DATOS DEL DASHBOARD

  const safeUsers = Array.isArray(users)
    ? users
    : [];

  const totalUsers = safeUsers.length;

  const activeUsers = safeUsers.filter(
    (user) => user.is_active === true
  ).length;

  const inactiveUsers = safeUsers.filter(
    (user) => user.is_active === false
  ).length;

  const adminUsers = safeUsers.filter(
    (user) => user.role === "admin"
  ).length;

  const normalUsers = safeUsers.filter(
    (user) => user.role === "user"
  ).length;

  const proUsersList = safeUsers.filter(
    (user) =>
      user.is_pro === true ||
      String(user.plan).toUpperCase() === "PRO"
  );

  const proUsers = proUsersList.length;

  const freeUsers = safeUsers.filter(
    (user) =>
      user.is_pro !== true &&
      String(user.plan).toUpperCase() !== "PRO"
  ).length;

  const completedProfiles =
    Number(profileStats?.completed) || 0;

  const incompleteProfiles =
    Number(profileStats?.incomplete) || 0;

  // DATOS PARA LOS GRÁFICOS

  const statusChartData = [
    {
      name: "Activos",
      value: activeUsers,
    },
    {
      name: "Inactivos",
      value: inactiveUsers,
    },
  ];

  const roleChartData = [
    {
      name: "Administradores",
      cantidad: adminUsers,
    },
    {
      name: "Usuarios",
      cantidad: normalUsers,
    },
  ];

  const profileChartData = [
    {
      name: "Completos",
      cantidad: completedProfiles,
    },
    {
      name: "Incompletos",
      cantidad: incompleteProfiles,
    },
  ];

  const planChartData = [
    {
      name: "Plan PRO",
      cantidad: proUsers,
    },
    {
      name: "Plan gratuito",
      cantidad: freeUsers,
    },
  ];

  const categoriesChartData = categories
    .map((category) => ({
      name:
        category.name ||
        category.category ||
        category.category_name ||
        "Sin categoría",

      cantidad: Number(
        category.count ??
          category.total ??
          category.usage_count ??
          category.quantity ??
          0
      ),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  const topCategories =
    categoriesChartData.slice(0, 5);

  const recentUsers = safeUsers.slice(0, 6);

  const totalCategoryUses = topCategories.reduce(
    (total, category) =>
      total + category.cantidad,
    0
  );

  // FUNCIONES VISUALES

  const getUserName = (user) => {
    const firstName =
      user.first_name || user.name || "Sin nombre";

    const lastName = user.last_name
      ? ` ${user.last_name}`
      : "";

    return `${firstName}${lastName}`;
  };

  const getInitials = (user) => {
    const firstInitial =
      user.first_name?.[0] ||
      user.name?.[0] ||
      "U";

    const lastInitial =
      user.last_name?.[0] || "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const getSubscriptionLabel = (status) => {
    switch (status) {
      case "active":
        return "Activa";

      case "trialing":
        return "En prueba";

      case "past_due":
        return "Pago pendiente";

      case "canceled":
      case "cancelled":
        return "Cancelada";

      case "inactive":
        return "Inactiva";

      default:
        return status || "Sin información";
    }
  };

  // CERRAR SESIÓN

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        {/* PERFIL CLICKEABLE */}

        <button
          type="button"
          className="profile-card profile-card-button"
          onClick={() => setShowAdminProfile(true)}
          title="Ver perfil del administrador"
        >
          <div className="profile-avatar">
            {getInitials(currentUser)}
          </div>

          <div className="profile-info">
            <h4>
              {currentUser.first_name ||
                currentUser.name ||
                "Administrador"}
            </h4>

            <span>
              {currentUser.role === "admin"
                ? "Administrador"
                : currentUser.role || "Administrador"}
            </span>
          </div>
        </button>

        <div className="sidebar-header">
          <h2>Sistema de Control de Gastos</h2>
          <p>Panel Administrativo</p>
        </div>

        <nav className="sidebar-menu">
          <button
            type="button"
            className={`menu-item ${
              activeTab === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("dashboard")
            }
          >
            <Users size={18} />
            Dashboard
          </button>

          <button
            type="button"
            className={`menu-item ${
              activeTab === "users"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("users")
            }
          >
            <BarChart3 size={18} />
            Usuarios
          </button>

          <button
            type="button"
            className={`menu-item ${
              activeTab === "stats"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("stats")
            }
          >
            <Tags size={18} />
            Estadísticas
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}

      <main className="dashboard-admin">
        {loading ? (
          <div className="admin-loading">
            <RefreshCw
              size={35}
              className="loading-icon"
            />

            <p>Cargando información...</p>
          </div>
        ) : (
          <>
            {/* DASHBOARD */}

            {activeTab === "dashboard" && (
              <section className="admin-dashboard-home">
                <div className="dashboard-title">
                  <div>
                    <h2>Resumen general</h2>

                    <p>
                      Información principal sobre los
                      usuarios, planes y categorías del
                      sistema.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={fetchAll}
                  >
                    <RefreshCw size={16} />
                    Actualizar
                  </button>
                </div>

                {/* CARDS PRINCIPALES */}

                <div className="stats-grid">
                  <div className="card stat-card">
                    <div className="stat-icon stat-icon-purple">
                      <Users size={24} />
                    </div>

                    <div>
                      <p>Total usuarios</p>
                      <h3>{totalUsers}</h3>
                    </div>
                  </div>

                  <div className="card stat-card">
                    <div className="stat-icon stat-icon-green">
                      <UserCheck size={24} />
                    </div>

                    <div>
                      <p>Usuarios activos</p>
                      <h3>{activeUsers}</h3>
                    </div>
                  </div>

                  <div className="card stat-card">
                    <div className="stat-icon stat-icon-pro">
                      <Crown size={24} />
                    </div>

                    <div>
                      <p>Usuarios PRO</p>
                      <h3>{proUsers}</h3>
                    </div>
                  </div>

                  <div className="card stat-card">
                    <div className="stat-icon stat-icon-blue">
                      <FileCheck size={24} />
                    </div>

                    <div>
                      <p>Perfiles completos</p>
                      <h3>{completedProfiles}</h3>
                    </div>
                  </div>

                  <div className="card stat-card">
                    <div className="stat-icon stat-icon-orange">
                      <ShieldAlert size={24} />
                    </div>

                    <div>
                      <p>Perfiles incompletos</p>
                      <h3>{incompleteProfiles}</h3>
                    </div>
                  </div>
                </div>

                {/* CATEGORÍAS Y USUARIOS */}

                <div className="dashboard-content-grid">
                  <article className="card dashboard-categories-card">
                    <div className="dashboard-card-header">
                      <div>
                        <h3>
                          Categorías más utilizadas
                        </h3>

                        <p>
                          Las cinco categorías con mayor
                          uso
                        </p>
                      </div>

                      <Tags size={22} />
                    </div>

                    {topCategories.length === 0 ? (
                      <div className="dashboard-empty">
                        No existen datos de categorías.
                      </div>
                    ) : (
                      <div className="category-cards-list">
                        {topCategories.map(
                          (category, index) => {
                            const percentage =
                              totalCategoryUses > 0
                                ? Math.round(
                                    (category.cantidad /
                                      totalCategoryUses) *
                                      100
                                  )
                                : 0;

                            return (
                              <div
                                className="dashboard-category-item"
                                key={`${category.name}-${index}`}
                              >
                                <div
                                  className="category-color"
                                  style={{
                                    backgroundColor:
                                      CHART_COLORS[
                                        index %
                                          CHART_COLORS.length
                                      ],
                                  }}
                                />

                                <div className="category-information">
                                  <div className="category-row">
                                    <span>
                                      {category.name}
                                    </span>

                                    <strong>
                                      {category.cantidad}
                                    </strong>
                                  </div>

                                  <div className="category-progress">
                                    <div
                                      className="category-progress-value"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor:
                                          CHART_COLORS[
                                            index %
                                              CHART_COLORS.length
                                          ],
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </article>

                  <article className="card dashboard-users-card">
                    <div className="dashboard-card-header">
                      <div>
                        <h3>Usuarios registrados</h3>

                        <p>
                          Resumen de nombres, roles y
                          estado
                        </p>
                      </div>

                      <Users size={22} />
                    </div>

                    <div className="dashboard-table-wrapper">
                      <table className="dashboard-users-table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Estado</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentUsers.length === 0 ? (
                            <tr>
                              <td
                                colSpan="3"
                                className="empty-table-cell"
                              >
                                No existen usuarios
                                registrados.
                              </td>
                            </tr>
                          ) : (
                            recentUsers.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <div className="dashboard-user-info">
                                    <div className="dashboard-user-avatar">
                                      {getInitials(user)}
                                    </div>

                                    <div>
                                      <strong>
                                        {getUserName(user)}
                                      </strong>

                                      <small>
                                        {user.email}
                                      </small>
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <span
                                    className={
                                      user.role === "admin"
                                        ? "role-badge role-admin"
                                        : "role-badge role-user"
                                    }
                                  >
                                    {user.role === "admin"
                                      ? "Administrador"
                                      : "Usuario"}
                                  </span>
                                </td>

                                <td>
                                  <span
                                    className={
                                      user.is_active
                                        ? "status-active"
                                        : "status-inactive"
                                    }
                                  >
                                    {user.is_active
                                      ? "Activo"
                                      : "Inactivo"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {safeUsers.length >
                      recentUsers.length && (
                      <button
                        type="button"
                        className="dashboard-view-users"
                        onClick={() =>
                          setActiveTab("users")
                        }
                      >
                        Ver todos los usuarios
                      </button>
                    )}
                  </article>
                </div>

                {/* USUARIOS PRO */}

                <article className="card pro-users-card">
                  <div className="dashboard-card-header">
                    <div>
                      <h3>Usuarios con Plan PRO</h3>

                      <p>
                        Usuarios que poseen una
                        suscripción premium
                      </p>
                    </div>

                    <Crown size={22} />
                  </div>

                  <div className="dashboard-table-wrapper">
                    <table className="dashboard-users-table">
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Plan</th>
                          <th>Suscripción</th>
                          <th>Estado</th>
                        </tr>
                      </thead>

                      <tbody>
                        {proUsersList.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="empty-table-cell"
                            >
                              No existen usuarios PRO.
                            </td>
                          </tr>
                        ) : (
                          proUsersList.map((user) => (
                            <tr key={`pro-${user.id}`}>
                              <td>
                                <div className="dashboard-user-info">
                                  <div className="dashboard-user-avatar pro-avatar">
                                    <Crown size={17} />
                                  </div>

                                  <div>
                                    <strong>
                                      {getUserName(user)}
                                    </strong>

                                    <small>
                                      {user.email}
                                    </small>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <span className="pro-badge">
                                  {user.plan || "PRO"}
                                </span>
                              </td>

                              <td>
                                {getSubscriptionLabel(
                                  user.subscription_status
                                )}
                              </td>

                              <td>
                                <span
                                  className={
                                    user.is_active
                                      ? "status-active"
                                      : "status-inactive"
                                  }
                                >
                                  {user.is_active
                                    ? "Activo"
                                    : "Inactivo"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>
            )}

            {/* GESTIÓN DE USUARIOS */}

            {activeTab === "users" && (
              <div className="card users-card">
                <div className="table-header">
                  <div>
                    <h3>Gestión de usuarios</h3>

                    <p>
                      Administra roles, estados y
                      usuarios registrados.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchAll}
                    className="btn btn-outline"
                  >
                    <RefreshCw size={14} />
                    Actualizar
                  </button>
                </div>

                <div className="users-table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Plan</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {safeUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="empty-table-cell"
                          >
                            No existen usuarios
                            registrados.
                          </td>
                        </tr>
                      ) : (
                        safeUsers.map((user) => {
                          const isUpdating =
                            updatingUserId === user.id;

                          const isPro =
                            user.is_pro === true ||
                            String(
                              user.plan
                            ).toUpperCase() === "PRO";

                          return (
                            <tr key={user.id}>
                              <td>
                                {getUserName(user)}
                              </td>

                              <td>{user.email}</td>

                              <td>
                                <span
                                  className={
                                    user.role === "admin"
                                      ? "role-badge role-admin"
                                      : "role-badge role-user"
                                  }
                                >
                                  {user.role === "admin"
                                    ? "Administrador"
                                    : "Usuario"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className={
                                    isPro
                                      ? "pro-badge"
                                      : "free-badge"
                                  }
                                >
                                  {isPro
                                    ? "PRO"
                                    : "FREE"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className={
                                    user.is_active
                                      ? "status-active"
                                      : "status-inactive"
                                  }
                                >
                                  {user.is_active
                                    ? "Activo"
                                    : "Inactivo"}
                                </span>
                              </td>

                              <td className="actions-cell">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleToggleRole(
                                      user
                                    )
                                  }
                                >
                                  {isUpdating
                                    ? "Procesando..."
                                    : "Cambiar rol"}
                                </button>

                                <button
                                  type="button"
                                  className={
                                    user.is_active
                                      ? "btn btn-danger"
                                      : "btn btn-success"
                                  }
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleToggleStatus(
                                      user
                                    )
                                  }
                                >
                                  {isUpdating
                                    ? "Procesando..."
                                    : user.is_active
                                      ? "Desactivar"
                                      : "Activar"}
                                </button>

                                <button
                                  type="button"
                                  className="delete-btn"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleDeleteUser(
                                      user
                                    )
                                  }
                                  title="Eliminar usuario"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ESTADÍSTICAS */}

            {activeTab === "stats" && (
              <section className="statistics-section">
                <div className="statistics-header">
                  <div>
                    <h2>
                      Estadísticas generales
                    </h2>

                    <p>
                      Distribución de usuarios,
                      perfiles, planes y categorías.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={fetchAll}
                  >
                    <RefreshCw size={16} />
                    Actualizar datos
                  </button>
                </div>

                <div className="charts-grid">
                  {/* ESTADO DE USUARIOS */}

                  <article className="chart-card">
                    <div className="chart-title">
                      <h3>
                        Estado de los usuarios
                      </h3>

                      <p>
                        Usuarios activos e inactivos
                      </p>
                    </div>

                    {totalUsers === 0 ? (
                      <div className="chart-empty">
                        No existen usuarios para
                        mostrar.
                      </div>
                    ) : (
                      <div className="chart-container">
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >
                          <PieChart>
                            <Pie
                              data={statusChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={105}
                              paddingAngle={4}
                              label={({
                                name,
                                percent,
                              }) =>
                                `${name} ${(
                                  percent * 100
                                ).toFixed(0)}%`
                              }
                            >
                              {statusChartData.map(
                                (entry, index) => (
                                  <Cell
                                    key={`status-${entry.name}`}
                                    fill={
                                      CHART_COLORS[
                                        index %
                                          CHART_COLORS.length
                                      ]
                                    }
                                  />
                                )
                              )}
                            </Pie>

                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </article>

                  {/* USUARIOS POR ROL */}

                  <article className="chart-card">
                    <div className="chart-title">
                      <h3>Usuarios por rol</h3>

                      <p>
                        Distribución de permisos del
                        sistema
                      </p>
                    </div>

                    <div className="chart-container">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart
                          data={roleChartData}
                          margin={{
                            top: 15,
                            right: 20,
                            left: 0,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis dataKey="name" />

                          <YAxis
                            allowDecimals={false}
                          />

                          <Tooltip />
                          <Legend />

                          <Bar
                            dataKey="cantidad"
                            name="Cantidad de usuarios"
                            radius={[8, 8, 0, 0]}
                          >
                            {roleChartData.map(
                              (entry, index) => (
                                <Cell
                                  key={`role-${entry.name}`}
                                  fill={
                                    CHART_COLORS[
                                      (index + 2) %
                                        CHART_COLORS.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>

                  {/* USUARIOS POR PLAN */}

                  <article className="chart-card">
                    <div className="chart-title">
                      <h3>Usuarios por plan</h3>

                      <p>
                        Comparación entre usuarios PRO
                        y usuarios gratuitos
                      </p>
                    </div>

                    {totalUsers === 0 ? (
                      <div className="chart-empty">
                        No existen usuarios para
                        mostrar.
                      </div>
                    ) : (
                      <div className="chart-container">
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >
                          <PieChart>
                            <Pie
                              data={planChartData}
                              dataKey="cantidad"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={105}
                              paddingAngle={4}
                              label={({
                                name,
                                percent,
                              }) =>
                                `${name} ${(
                                  percent * 100
                                ).toFixed(0)}%`
                              }
                            >
                              <Cell fill="#f59e0b" />
                              <Cell fill="#64748b" />
                            </Pie>

                            <Tooltip
                              formatter={(value) => [
                                value,
                                "Usuarios",
                              ]}
                            />

                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </article>

                  {/* ESTADO DE PERFILES */}

                  <article className="chart-card">
                    <div className="chart-title">
                      <h3>Estado de perfiles</h3>

                      <p>
                        Perfiles completos e
                        incompletos
                      </p>
                    </div>

                    <div className="chart-container">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart
                          data={profileChartData}
                          margin={{
                            top: 15,
                            right: 20,
                            left: 0,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis dataKey="name" />

                          <YAxis
                            allowDecimals={false}
                          />

                          <Tooltip />
                          <Legend />

                          <Bar
                            dataKey="cantidad"
                            name="Cantidad de perfiles"
                            radius={[8, 8, 0, 0]}
                          >
                            {profileChartData.map(
                              (entry, index) => (
                                <Cell
                                  key={`profile-${entry.name}`}
                                  fill={
                                    CHART_COLORS[
                                      (index + 5) %
                                        CHART_COLORS.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>

                  {/* CATEGORÍAS */}

                  <article className="chart-card chart-card-wide">
                    <div className="chart-title">
                      <h3>
                        Categorías más utilizadas
                      </h3>

                      <p>
                        Cada color representa una
                        categoría diferente
                      </p>
                    </div>

                    {categoriesChartData.length ===
                    0 ? (
                      <div className="chart-empty">
                        No existen estadísticas de
                        categorías.
                      </div>
                    ) : (
                      <>
                        <div className="chart-container chart-container-large">
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <BarChart
                              data={
                                categoriesChartData
                              }
                              layout="vertical"
                              margin={{
                                top: 10,
                                right: 40,
                                left: 30,
                                bottom: 10,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                              />

                              <XAxis
                                type="number"
                                allowDecimals={false}
                              />

                              <YAxis
                                type="category"
                                dataKey="name"
                                width={140}
                              />

                              <Tooltip
                                formatter={(value) => [
                                  value,
                                  "Cantidad de usos",
                                ]}
                              />

                              <Legend />

                              <Bar
                                dataKey="cantidad"
                                name="Categorías"
                                radius={[
                                  0,
                                  8,
                                  8,
                                  0,
                                ]}
                              >
                                {categoriesChartData.map(
                                  (
                                    category,
                                    index
                                  ) => (
                                    <Cell
                                      key={`category-${category.name}-${index}`}
                                      fill={
                                        CHART_COLORS[
                                          index %
                                            CHART_COLORS.length
                                        ]
                                      }
                                    />
                                  )
                                )}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="category-chart-legend">
                          {categoriesChartData.map(
                            (category, index) => (
                              <div
                                className="category-legend-item"
                                key={`legend-${category.name}-${index}`}
                              >
                                <span
                                  className="category-legend-color"
                                  style={{
                                    backgroundColor:
                                      CHART_COLORS[
                                        index %
                                          CHART_COLORS.length
                                      ],
                                  }}
                                />

                                <span>
                                  {category.name}
                                </span>

                                <strong>
                                  {category.cantidad}
                                </strong>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}
                  </article>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/*MODAL DEL PERFIL ADMIN*/}

      {showAdminProfile && (
        <div
          className="admin-profile-overlay"
          onClick={() =>
            setShowAdminProfile(false)
          }
        >
          <section
            className="admin-profile-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="admin-profile-close"
              onClick={() =>
                setShowAdminProfile(false)
              }
              title="Cerrar perfil"
            >
              <X size={20} />
            </button>

            <div className="admin-profile-header">
              <div className="admin-profile-avatar-large">
                {getInitials(currentUser)}
              </div>

              <div>
                <h2>
                  {getUserName(currentUser)}
                </h2>

                <span className="role-badge role-admin">
                  Administrador
                </span>
              </div>
            </div>

            <div className="admin-profile-details">
              <div className="admin-profile-field">
                <span>Nombre</span>

                <strong>
                  {currentUser.first_name ||
                    currentUser.name ||
                    "No registrado"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Apellido</span>

                <strong>
                  {currentUser.last_name ||
                    "No registrado"}
                </strong>
              </div>

              <div className="admin-profile-field admin-profile-field-wide">
                <span>Correo electrónico</span>

                <strong>
                  {currentUser.email ||
                    "No registrado"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Edad</span>

                <strong>
                  {currentUser.age ??
                    "No registrada"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Rol</span>

                <strong>
                  {currentUser.role === "admin"
                    ? "Administrador"
                    : currentUser.role ||
                      "Administrador"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Estado</span>

                <strong>
                  {currentUser.is_active === false
                    ? "Inactivo"
                    : "Activo"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Plan</span>

                <strong>
                  {currentUser.is_pro === true ||
                  String(
                    currentUser.plan
                  ).toUpperCase() === "PRO"
                    ? "PRO"
                    : currentUser.plan || "FREE"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Salario registrado</span>

                <strong>
                  {currentUser.salary != null
                    ? `$${Number(
                        currentUser.salary
                      ).toFixed(2)}`
                    : "No registrado"}
                </strong>
              </div>

              <div className="admin-profile-field">
                <span>Perfil completo</span>

                <strong>
                  {currentUser.profile_completed
                    ? "Sí"
                    : "No"}
                </strong>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}