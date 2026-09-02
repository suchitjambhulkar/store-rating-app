import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await loginUser({
                email,
                password,
            });

            if (!result.success) {
                setError(result.message || "Login failed");
                return;
            }

            // Backend returns token directly
            localStorage.setItem("token", result.token);

            // Backend returns user inside data
            localStorage.setItem(
                "user",
                JSON.stringify(result.data)
            );

            // Redirect according to role
            if (result.data.role === "ADMIN") {
                navigate("/admin-dashboard");
            } else if (result.data.role === "STORE_OWNER") {
                navigate("/owner-dashboard");
            } else {
                navigate("/user-dashboard");
            }

        } catch (error) {
            console.error(error);
            setError("Unable to connect to server");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    ★
                </div>

                <h1 className="auth-title">
                    Store Rating App
                </h1>

                <p className="auth-subtitle">
                    Rate stores and discover the best places
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <div className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default Login;