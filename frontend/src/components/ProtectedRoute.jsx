import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin-dashboard" replace />;
        }

        return <Navigate to="/user-dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
