import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
import CreateStore from "./pages/CreateStore";
import OwnerDashboard from "./pages/OwnerDashboard";
import CreateUser from "./pages/CreateUser";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Dashboard */}
                <Route
                    path="/user-dashboard"
                    element={
                        <ProtectedRoute role="USER">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Dashboard */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner-dashboard"
                    element={
                        <ProtectedRoute role="STORE_OWNER">
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Change Password */}
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                {/* Create Store */}
                <Route
                    path="/create-store"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <CreateStore />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-user"
                    element={<ProtectedRoute role="ADMIN"><CreateUser /></ProtectedRoute>}
                />

                {/* Default */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;