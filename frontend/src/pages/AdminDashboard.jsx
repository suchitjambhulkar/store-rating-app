import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getAdminStats,
    getUsers,
    getAdminStores,
} from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total_users: 0,
        total_stores: 0,
        total_ratings: 0,
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [listFilter, setListFilter] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!token || user?.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [statsResult, usersResult, storesResult] =
                    await Promise.all([
                        getAdminStats(token),
                        getUsers(token),
                        getAdminStores(token),
                    ]);

                if (statsResult.success) setStats(statsResult.data);
                if (usersResult.success) setUsers(usersResult.data);
                if (storesResult.success) setStores(storesResult.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        void loadDashboard();
    }, [navigate, token, user?.role]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const matchesFilter = (item) => Object.values(item).some((value) =>
        String(value || "").toLowerCase().includes(listFilter.toLowerCase())
    );
    const sortItems = (items) => [...items].filter(matchesFilter).sort((first, second) => {
        const left = String(first[sortBy] || "").toLowerCase();
        const right = String(second[sortBy] || "").toLowerCase();
        return (left.localeCompare(right)) * (sortDirection === "asc" ? 1 : -1);
    });
    const visibleUsers = sortItems(users);
    const visibleStores = sortItems(stores);

    return (
        <div className="admin-page">

            {/* ================= NAVBAR ================= */}

            <header className="admin-navbar">

                <div>
                    <h2>Store Rating App</h2>
                    <span>Admin Dashboard</span>
                </div>

                <div className="admin-actions">

                    <span className="admin-welcome">
                        👋 {user?.name}
                    </span>

                    <Link
                        to="/change-password"
                        className="admin-secondary-btn"
                    >
                        Change Password
                    </Link>

                    <Link
                        to="/create-user"
                        className="admin-secondary-btn"
                    >
                        + Create User
                    </Link>

                    <Link
                        to="/create-store"
                        className="admin-primary-btn"
                    >
                        + Create Store
                    </Link>

                    <button
                        className="admin-logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ================= CONTENT ================= */}

            <main className="admin-content">

                <div className="admin-heading">
                    <h1>Dashboard Overview</h1>

                    <p>
                        Monitor users, stores and ratings
                        from one place.
                    </p>
                </div>


                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                <div className="admin-filters">
                    <input className="form-input" placeholder="Filter name, email, address, or role" value={listFilter} onChange={(event) => setListFilter(event.target.value)} />
                    <select className="form-input" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                        <option value="name">Sort by name</option>
                        <option value="email">Sort by email</option>
                        <option value="address">Sort by address</option>
                        <option value="role">Sort by role</option>
                    </select>
                    <button className="admin-secondary-btn" type="button" onClick={() => setSortDirection((current) => current === "asc" ? "desc" : "asc")}>{sortDirection === "asc" ? "Ascending" : "Descending"}</button>
                </div>


                {/* ================= STAT CARDS ================= */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon users-icon">
                            👥
                        </div>

                        <div>
                            <span>Total Users</span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.total_users}
                            </h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon stores-icon">
                            🏪
                        </div>

                        <div>
                            <span>Total Stores</span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.total_stores}
                            </h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon ratings-icon">
                            ⭐
                        </div>

                        <div>
                            <span>Total Ratings</span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.total_ratings}
                            </h2>
                        </div>

                    </div>

                </section>


                {/* ================= USERS ================= */}

                <section className="admin-section">

                    <div className="section-heading">
                        <div>
                            <h2>Users</h2>
                            <p>
                                Registered users in the system
                            </p>
                        </div>

                        <span className="count-badge">
                            {visibleUsers.length}
                        </span>
                    </div>


                    <div className="table-container">

                        {loading ? (

                            <div className="table-loading">
                                Loading users...
                            </div>

                        ) : users.length === 0 ? (

                            <div className="empty-table">
                                No users found.
                            </div>

                        ) : (

                            <table>

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Role</th>
                                        <th>Rating</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {visibleUsers.map((item) => (

                                        <tr key={item.id}>

                                            <td>
                                                #{item.id}
                                            </td>

                                            <td className="user-name">
                                                {item.name}
                                            </td>

                                            <td>
                                                {item.email}
                                            </td>

                                            <td>
                                                {item.address || "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        item.role === "ADMIN"
                                                            ? "role-admin"
                                                            : "role-user"
                                                    }
                                                >
                                                    {item.role}
                                                </span>
                                            </td>

                                            <td>
                                                {item.role === "STORE_OWNER" ? `★ ${item.owner_rating || "0.00"}` : "-"}
                                            </td>

                                            <td>
                                                {item.created_at
                                                    ? new Date(
                                                        item.created_at
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>

                </section>


                {/* ================= STORES ================= */}

                <section className="admin-section">

                    <div className="section-heading">

                        <div>
                            <h2>Stores</h2>

                            <p>
                                All stores registered in the system
                            </p>
                        </div>

                        <span className="count-badge">
                            {visibleStores.length}
                        </span>

                    </div>


                    <div className="table-container">

                        {loading ? (

                            <div className="table-loading">
                                Loading stores...
                            </div>

                        ) : stores.length === 0 ? (

                            <div className="empty-table">
                                No stores found.
                            </div>

                        ) : (

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Store</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Owner</th>
                                        <th>Rating</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {visibleStores.map((store) => (

                                        <tr key={store.id}>

                                            <td>
                                                #{store.id}
                                            </td>

                                            <td className="store-name">
                                                {store.name}
                                            </td>

                                            <td>
                                                {store.email}
                                            </td>

                                            <td>
                                                {store.address}
                                            </td>

                                            <td>

                                                <div className="owner-info">

                                                    <strong>
                                                        {
                                                            store.owner_name
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            store.owner_email
                                                        }
                                                    </small>

                                                </div>

                                            </td>

                                            <td>

                                                <span className="rating-value">
                                                    ⭐{" "}
                                                    {store.overall_rating ||
                                                        "0.00"}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;