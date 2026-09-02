import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStore } from "../services/api";
import "./Dashboard.css";

function CreateStore() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.address.trim()
        ) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setIsLoading(true);

            const token = localStorage.getItem("token");

            const response = await createStore(
                token,
                formData
            );

            if (response.success) {
                setSuccess("Store created successfully!");

                setFormData({
                    name: "",
                    email: "",
                    address: "",
                    ownerId: "",
                });

                setTimeout(() => {
                    navigate("/admin-dashboard");
                }, 1500);
            } else {
                setError(
                    response.message ||
                    "Failed to create store"
                );
            }
        } catch (error) {
            console.error(error);
            setError(
                "Unable to connect to server"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-page">

            <main className="dashboard-content">

                <section className="dashboard-heading">
                    <div>
                        <p className="dashboard-label">
                            ADMIN
                        </p>

                        <h1>
                            Create Store
                        </h1>

                        <p>
                            Add a new store to the
                            store rating platform.
                        </p>
                    </div>
                </section>

                <div className="store-card">

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rating-message">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="ownerId">
                                Store Owner ID (optional)
                            </label>

                            <input
                                id="ownerId"
                                name="ownerId"
                                type="number"
                                min="1"
                                className="form-input"
                                placeholder="Enter a STORE_OWNER user ID"
                                value={formData.ownerId}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">
                                Store Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="form-input"
                                placeholder="Enter store name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Store Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder="Enter store email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">
                                Store Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                className="form-input"
                                placeholder="Enter store address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="4"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Creating Store..."
                                : "Create Store"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CreateStore;