import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/admin-test" />;
  }

  return children;
}

export default AdminRoute;