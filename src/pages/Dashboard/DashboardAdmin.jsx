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

  // =========================
  // AUTH FETCH
  // =========================
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
      alert("Sesión expirada");
      localStorage.clear();
      window.location.href = "/";
      return null;
    }

    return res;
  };

  // =========================
  // PARSE RESPONSE
  // =========================
  const parse = async (res) => {
    if (!res) return null;

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error en la API");
    }

    return data?.data ?? data;
  };

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/users`);
      const data = await parse(res);

      setUsers(Array.isArray(data) ? data : data?.users || []);
    } catch (err) {
      console.error("Error usuarios:", err);
      setUsers([]);
    }
  };

  // =========================
  // FETCH PROFILE STATS
  // =========================
  const fetchProfileStats = async () => {
    try {
      const res = await authFetch(
        `${API_URL}/api/admin/statistics/profile-status`
      );

      const data = await parse(res);

      setProfileStats(data);
    } catch (err) {
      console.error(err);
      setProfileStats(null);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      const res = await authFetch(
        `${API_URL}/api/admin/statistics/top-categories`
      );

      const data = await parse(res);

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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

  // =========================
  // ACCIONES
  // =========================

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );

    if (!confirmDelete) return;

    try {
      const res = await authFetch(
        `${API_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
        }
      );

      await parse(res);

      alert("Usuario eliminado");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleToggleRole = async (user) => {
    try {
      const newRole =
        user.role === "admin" ? "user" : "admin";

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

      alert(`Rol actualizado a ${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await authFetch(
        `${API_URL}/api/admin/users/${user.id}/status`,
        {
          method: "PUT",
        }
      );

      await parse(res);

      alert("Estado actualizado");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // =========================
  // USER INFO
  // =========================

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const safeUsers = Array.isArray(users) ? users : [];

  const totalUsers = safeUsers.length;

  const activeUsers = safeUsers.filter(
    (u) => u.status === "active"
  ).length;

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        {/* PERFIL ADMIN */}

        <div className="profile-card">
          <div className="profile-avatar">
            {(currentUser.first_name?.[0] || "A") +
              (currentUser.last_name?.[0] || "")}
          </div>

          <div className="profile-info">
            <h4>{currentUser.first_name || "Administrador"}</h4>

            <span>{currentUser.role || "admin"}</span>
          </div>
        </div>

        <div className="sidebar-header">
          <h2>Sistema de Control de Gastos</h2>
          <p>Panel Administrativo</p>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Users size={18} />
            Dashboard
          </button>

          <button
            className={`menu-item ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <BarChart3 size={18} />
            Usuarios
          </button>

          <button
            className={`menu-item ${
              activeTab === "stats" ? "active" : ""
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <Tags size={18} />
            Estadísticas
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}

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
                <h3>{profileStats?.completed ?? 0}</h3>
              </div>
            </div>

            <div className="card stat-card">
              <ShieldAlert />
              <div>
                <p>Incompletos</p>
                <h3>{profileStats?.incomplete ?? 0}</h3>
              </div>
            </div>

            
          </div>
        )}


        {activeTab === "users" && (
          <div className="card users-card">
            <div className="table-header">
              <h3>Gestión de usuarios</h3>

              <button
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
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {safeUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.first_name || u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status || "active"}</td>

                    <td className="actions-cell">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleToggleRole(u)}
                      >
                        Rol
                      </button>

                      <button
                        className="btn btn-outline"
                        onClick={() => handleToggleStatus(u)}
                      >
                        Estado
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteUser(u.id)
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="card">
            <h3>Categorías más utilizadas</h3>

<p>En desarrollo :D</p>
            {categories.length === 0 ? (
              <p>No existen datos.</p>
            ) : (
              categories.map((cat, index) => (
                <div
                  key={index}
                  className="category-item"
                >
                  <span>{cat.name}</span>
                  <span>{cat.count}</span>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}