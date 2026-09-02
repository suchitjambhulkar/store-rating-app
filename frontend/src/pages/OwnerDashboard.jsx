import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOwnerDashboard } from "../services/api";
import "./Dashboard.css";

function OwnerDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [dashboard, setDashboard] = useState({ store: null, ratings: [] });
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token || user?.role !== "STORE_OWNER") {
            navigate("/login");
            return;
        }

        getOwnerDashboard(token)
            .then((result) => {
                if (result.success) setDashboard(result.data);
                else setError(result.message || "Failed to load dashboard");
            })
            .catch(() => setError("Unable to connect to server"));
    }, [navigate, token, user?.role]);

    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="dashboard-content">
                <section className="dashboard-heading">
                    <div>
                        <p className="dashboard-label">STORE OWNER</p>
                        <h1>{dashboard.store?.name || "Owner Dashboard"}</h1>
                        <p>Welcome back, {user?.name}. Review customer feedback for your store.</p>
                    </div>
                    <div className="store-count">
                        <strong>{dashboard.store?.overall_rating || "0.00"}</strong>
                        <span>Average rating</span>
                    </div>
                </section>
                {error && <div className="error-message">{error}</div>}
                {!error && !dashboard.store && <div className="empty-state"><h3>No store assigned</h3><p>Ask an administrator to assign a store to your account.</p></div>}
                {dashboard.store && (
                    <div className="table-container">
                        <table>
                            <thead><tr><th>User</th><th>Email</th><th>Rating</th><th>Submitted</th></tr></thead>
                            <tbody>
                                {dashboard.ratings.map((rating) => (
                                    <tr key={`${rating.user_id}-${rating.created_at}`}>
                                        <td>{rating.user_name}</td><td>{rating.user_email}</td><td>★ {rating.rating}</td><td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {dashboard.ratings.length === 0 && <div className="empty-table">No ratings submitted yet.</div>}
                    </div>
                )}
            </main>
        </div>
    );
}

export default OwnerDashboard;