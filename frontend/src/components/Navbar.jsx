import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">★</span>
                    <span>Store Rating</span>
                </Link>

                {user && (
                    <div className="navbar-right">

                        <span className="welcome-user">
                            {user.name}
                        </span>

                        <Link
                            to={
                                user.role === "ADMIN"
                                    ? "/admin-dashboard"
                                    : user.role === "STORE_OWNER"
                                        ? "/owner-dashboard"
                                        : "/user-dashboard"
                            }
                            className="nav-link"
                        >
                            Stores
                        </Link>

                        <Link
                            to="/change-password"
                            className="nav-link"
                        >
                            Change Password
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Logout
                        </button>

                    </div>
                )}

            </div>

        </nav>
    );
}

export default Navbar;