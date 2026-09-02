import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";
import "./Auth.css";

function CreateUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await createUser(localStorage.getItem("token"), formData);
            if (!result.success) {
                setError(result.errors?.map((item) => item.msg).join(", ") || result.message || "Failed to create user");
                return;
            }
            navigate("/admin-dashboard");
        } catch (requestError) {
            console.error(requestError);
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page"><div className="auth-card">
            <h1 className="auth-title">Create User</h1>
            <p className="auth-subtitle">Add a normal user, administrator, or store owner.</p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="name">Full Name</label><input id="name" name="name" className="form-input" minLength="20" maxLength="60" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input id="email" name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="address">Address</label><textarea id="address" name="address" className="form-input" maxLength="400" value={formData.address} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength="8" maxLength="16" className="form-input" value={formData.password} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="role">Role</label><select id="role" name="role" className="form-input" value={formData.role} onChange={handleChange}><option value="USER">Normal User</option><option value="ADMIN">Administrator</option><option value="STORE_OWNER">Store Owner</option></select></div>
                <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Creating..." : "Create User"}</button>
            </form>
        </div></div>
    );
}

export default CreateUser;