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
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [profileStats, setProfileStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // PETICIONES AUTENTICADAS

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (res.status === 401) {
      alert("Tu sesión ha expirado.");
      localStorage.clear();
      window.location.href = "/";
      return null;
    }

    if (res.status === 403) {
      throw new Error(
        "No tienes permisos para realizar esta acción."
      );
    }

    return res;
  };

  // PROCESAR RESPUESTAS

  const parse = async (res) => {
    if (!res) return null;

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
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
      const res = await authFetch(
        `${API_URL}/api/admin/users`
      );

      const data = await parse(res);

      setUsers(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
            ? data.users
            : []
      );
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setUsers([]);
    }
  };

  // OBTENER ESTADÍSTICAS

  const fetchProfileStats = async () => {
    try {
      const res = await authFetch(
        `${API_URL}/api/admin/statistics/profile-status`
      );

      const data = await parse(res);

      setProfileStats(data);
    } catch (err) {
      console.error(
        "Error al obtener estadísticas de perfiles:",
        err
      );

      setProfileStats(null);
    }
  };

  // OBTENER CATEGORÍAS

  const fetchCategories = async () => {
    try {
      const res = await authFetch(
        `${API_URL}/api/admin/statistics/top-categories`
      );

      const data = await parse(res);

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
            ? data.categories
            : []
      );
    } catch (err) {
      console.error(
        "Error al obtener categorías:",
        err
      );

      setCategories([]);
    }
  };

  const fetchAll = async () => {
    await Promise.all([
      fetchUsers(),
      fetchProfileStats(),
      fetchCategories(),
    ]);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ELIMINAR USUARIO

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar al usuario ${user.email}?`
    );

    if (!confirmDelete) return;

    try {
      setUpdatingUserId(user.id);

      const res = await authFetch(
        `${API_URL}/api/admin/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      await parse(res);

      alert("Usuario eliminado correctamente.");

      await fetchAll();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // CAMBIAR ROL

  const handleToggleRole = async (user) => {
    const newRole =
      user.role === "admin" ? "user" : "admin";

    const confirmChange = window.confirm(
      `¿Deseas cambiar el rol de ${user.email} a ${newRole}?`
    );

    if (!confirmChange) return;

    try {
      setUpdatingUserId(user.id);

      const res = await authFetch(
        `${API_URL}/api/admin/users/${user.id}/role`,
        {
          method: "PUT",
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      await parse(res);

      alert(`Rol actualizado correctamente a ${newRole}.`);

      await fetchUsers();
    } catch (err) {
      console.error("Error al cambiar rol:", err);
      alert(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ACTIVAR O DESACTIVAR

  const handleToggleStatus = async (user) => {
    const currentStatus = Boolean(user.is_active);
    const newStatus = !currentStatus;

    const action = newStatus
      ? "activar"
      : "desactivar";

    const confirmChange = window.confirm(
      `¿Seguro que deseas ${action} al usuario ${user.email}?`
    );

    if (!confirmChange) return;

    try {
      setUpdatingUserId(user.id);

      const res = await authFetch(
        `${API_URL}/api/admin/users/${user.id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      await parse(res);

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
    } catch (err) {
      console.error(
        "Error al cambiar estado:",
        err
      );

      alert(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // INFORMACIÓN DEL ADMIN

  let currentUser = {};

  try {
    currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    currentUser = {};
  }

  const safeUsers = Array.isArray(users)
    ? users
    : [];

  const totalUsers = safeUsers.length;

  const activeUsers = safeUsers.filter(
    (user) => user.is_active === true
  ).length;

  // CERRAR SESIÓN

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="profile-card">
          <div className="profile-avatar">
            {(currentUser.first_name?.[0] || "A") +
              (currentUser.last_name?.[0] || "")}
          </div>

          <div className="profile-info">
            <h4>
              {currentUser.first_name ||
                "Administrador"}
            </h4>

            <span>
              {currentUser.role || "admin"}
            </span>
          </div>
        </div>

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
            onClick={() => setActiveTab("users")}
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
            onClick={() => setActiveTab("stats")}
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
        {activeTab === "dashboard" && (
          <div className="stats-grid">
            <div className="card stat-card">
              <Users />

              <div>
                <p>Total usuarios</p>
                <h3>{totalUsers}</h3>
              </div>
            </div>

            <div className="card stat-card">
              <UserCheck />

              <div>
                <p>Usuarios activos</p>
                <h3>{activeUsers}</h3>
              </div>
            </div>

            <div className="card stat-card">
              <FileCheck />

              <div>
                <p>Perfiles completos</p>
                <h3>
                  {profileStats?.completed ?? 0}
                </h3>
              </div>
            </div>

            <div className="card stat-card">
              <ShieldAlert />

              <div>
                <p>Incompletos</p>
                <h3>
                  {profileStats?.incomplete ?? 0}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* TABLA DE USUARIOS */}

        {activeTab === "users" && (
          <div className="card users-card">
            <div className="table-header">
              <h3>Gestión de usuarios</h3>

              <button
                type="button"
                onClick={fetchAll}
                className="btn btn-outline"
              >
                <RefreshCw size={14} />
                Actualizar
              </button>
            </div>

            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {safeUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No existen usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  safeUsers.map((user) => {
                    const isUpdating =
                      updatingUserId === user.id;

                    return (
                      <tr key={user.id}>
                        <td>
                          {user.first_name ||
                            user.name ||
                            "Sin nombre"}
                        </td>

                        <td>{user.email}</td>

                        <td>{user.role}</td>

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
                              handleToggleRole(user)
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
                              handleToggleStatus(user)
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
                              handleDeleteUser(user)
                            }
                            title="Eliminar usuario"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ESTADÍSTICAS */}

        {activeTab === "stats" && (
          <div className="card">
            <h3>Categorías más utilizadas</h3>

            {categories.length === 0 ? (
              <p>No existen datos.</p>
            ) : (
              categories.map((category, index) => (
                <div
                  key={
                    category.id ||
                    category.name ||
                    index
                  }
                  className="category-item"
                >
                  <span>
                    {category.name ||
                      category.category ||
                      "Sin categoría"}
                  </span>

                  <span>
                    {category.count ??
                      category.total ??
                      0}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}