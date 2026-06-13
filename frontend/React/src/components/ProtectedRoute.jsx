import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white text-xl font-bold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          Your account role is <strong>{user.role}</strong>. This page requires: {roles.join(" or ")}.
        </p>
        <a href="/home" className="text-indigo-600 font-semibold hover:underline">Go to Home</a>
      </div>
    );
  }

  return children;
}
