import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updatePassword } from "../services/api";
import "./Auth.css";

function ChangePassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            navigate("/login");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const result = await updatePassword(
                token,
                password
            );

            if (!result.success) {
                if (result.errors) {
                    setError(
                        result.errors
                            .map((item) => item.msg)
                            .join(", ")
                    );
                } else {
                    setError(
                        result.message ||
                        "Failed to update password"
                    );
                }

                return;
            }

            setSuccess(
                "Password updated successfully!"
            );

            setPassword("");
            setConfirmPassword("");

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
                    🔐
                </div>

                <h1 className="auth-title">
                    Change Password
                </h1>

                <p className="auth-subtitle">
                    Keep your account secure
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="password">
                            New Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            minLength="8"
                            maxLength="16"
                            required
                        />

                        <small>
                            8–16 characters, 1 uppercase
                            and 1 special character
                        </small>

                    </div>


                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
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
                            ? "Updating..."
                            : "Update Password"}
                    </button>

                </form>


                <div className="auth-footer">

                    <Link to={JSON.parse(localStorage.getItem("user") || "null")?.role === "STORE_OWNER" ? "/owner-dashboard" : "/user-dashboard"}>
                        ← Back to Dashboard
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ChangePassword;