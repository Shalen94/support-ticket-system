import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    // Logged in but not authorized
    return <Navigate to="/" replace />;
  }

  return children;
}
