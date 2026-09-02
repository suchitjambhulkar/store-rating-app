import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStores } from "../services/api";
import Navbar from "../components/Navbar";
import StoreCard from "../components/StoreCard";
import "./Dashboard.css";

function UserDashboard() {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const loadStores = async (term = search) => {
        try {
            setLoading(true);
            setError("");

            const result = await getStores(token, term);

            if (result.success) {
                setStores(result.data);
            } else {
                setError(result.message || "Failed to load stores");
            }
        } catch (error) {
            console.error(error);
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || !user) {
            navigate("/login");
            return;
        }

        void Promise.resolve().then(() => loadStores());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, token]);

    const handleSearch = (event) => {
        event.preventDefault();
        loadStores(search);
    };

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="dashboard-content">

                <section className="dashboard-heading">

                    <div>
                        <p className="dashboard-label">
                            USER DASHBOARD
                        </p>

                        <h1>
                            Discover Stores
                        </h1>

                        <p>
                            Welcome back, {user?.name}.
                            Browse stores and share your
                            experience by rating them.
                        </p>
                    </div>

                    <div className="store-count">
                        <strong>
                            {stores.length}
                        </strong>

                        <span>
                            Stores
                        </span>
                    </div>

                </section>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        className="form-input"
                        type="search"
                        placeholder="Search by store name or address"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <button className="primary-btn" type="submit">
                        Search
                    </button>
                </form>

                {loading && (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>Loading stores...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {stores.length === 0 ? (

                            <div className="empty-state">
                                <div className="empty-icon">
                                    ★
                                </div>

                                <h3>
                                    No stores available
                                </h3>

                                <p>
                                    There are currently no stores
                                    available for rating.
                                </p>
                            </div>

                        ) : (

                            <div className="store-grid">

                                {stores.map((store) => (
                                    <StoreCard
                                        key={store.id}
                                        store={store}
                                        onRatingSubmit={loadStores}
                                    />
                                ))}

                            </div>

                        )}
                    </>
                )}

            </main>

        </div>
    );
}

export default UserDashboard;
