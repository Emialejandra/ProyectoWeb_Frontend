import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // no logueado
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // con un rol especifico 
  if (role && user.role !== role) {
    return <Navigate to="/admin-test" replace />;
  }

  return children;
}

export default ProtectedRoute;