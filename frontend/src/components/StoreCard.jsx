import { useState } from "react";
import { submitRating } from "../services/api";

function StoreCard({ store, onRatingSubmit }) {
    const [rating, setRating] = useState(store.my_rating || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmitRating = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setMessage("Please select a rating");
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await submitRating(
                token,
                store.id,
                rating
            );

            if (response.success) {
                setMessage("Rating submitted successfully!");

                if (onRatingSubmit) {
                    onRatingSubmit();
                }
            } else {
                setMessage(
                    response.message || "Failed to submit rating"
                );
            }
        } catch (error) {
            console.error(error);
            setMessage("Error submitting rating");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="store-card">

            <div className="store-card-header">
                <h3>{store.name}</h3>

                <span className="store-rating">
                    ★ {store.overall_rating || "0.00"}
                </span>
            </div>

            <p className="store-address">
                📍 {store.address}
            </p>

            <p className="store-email">
                ✉ {store.email}
            </p>

            <div className="rating-form">

                <label>
                    Your Rating
                </label>

                <div className="rating-options">

                    {[1, 2, 3, 4, 5].map((num) => (
                        <label
                            key={num}
                            className={
                                rating >= num
                                    ? "star selected"
                                    : "star"
                            }
                        >
                            <input
                                type="radio"
                                name={`rating-${store.id}`}
                                value={num}
                                checked={rating === num}
                                onChange={() =>
                                    setRating(num)
                                }
                            />

                            ★
                        </label>
                    ))}

                </div>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={handleSubmitRating}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Submitting..."
                        : "Submit Rating"}
                </button>

            </div>

            {message && (
                <p className="rating-message">
                    {message}
                </p>
            )}

        </div>
    );
}

export default StoreCard;
