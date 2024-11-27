import React, { useEffect, useState } from "react";

function RestaurantList({ userId }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    // Fetch the user's reviewed restaurants
    const fetchRestaurants = () => {
        if (!userId) {
            setRestaurants([]); // Clear restaurants if user is logged out
            setLoading(false);
            return;
        }

        setLoading(true); // Set loading to true while fetching
        fetch("/restaurants")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                return response.json();
            })
            .then((data) => {
                setRestaurants(data);
                if (data.length === 0) {
                    setError("No restaurants found for this user.");
                } else {
                    setError(null); // Clear any previous error
                }
            })
            .catch((error) => {
                console.error("Error fetching restaurants:", error);
                setError("Failed to load restaurants.");
            })
            .finally(() => {
                setLoading(false); // Stop loading after fetch completes
            });
    };

    // Fetch restaurants when the component mounts or userId changes
    useEffect(() => {
        fetchRestaurants();
    }, [userId]);

    // Handle deleting a review
    const handleDeleteReview = (reviewId) => {
        fetch(`/reviews/${reviewId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete review");
                }
                // Remove the deleted review from the restaurants state
                setRestaurants((prevRestaurants) =>
                    prevRestaurants.map((restaurant) => ({
                        ...restaurant,
                        reviews: restaurant.reviews.filter((review) => review.id !== reviewId),
                    }))
                );
            })
            .catch((error) => {
                console.error("Error deleting review:", error);
                setError("Failed to delete review.");
            });
    };

    if (loading) {
        return <p>Loading restaurants...</p>; // Show loading indicator while fetching
    }

    if (error) {
        return <p>{error}</p>; // Show error message if fetch fails
    }

    if (restaurants.length === 0) {
        return <p>No restaurants found. Start reviewing your favorite places!</p>; // Handle empty state
    }

    return (
        <div>
            <h2>My Reviewed Restaurants</h2>
            {restaurants.map((restaurant) => (
                <div key={restaurant.id}>
                    <h3>{restaurant.name}</h3>
                    <p>City: {restaurant.city?.name || "Unknown City"}</p> {/* Access city name */}
                    <h4>Reviews:</h4>
                    {restaurant.reviews && restaurant.reviews.length > 0 ? (
                        restaurant.reviews.map((review) => (
                            <div key={review.id}>
                                <p>Content: {review.content}</p>
                                <p>Rating: {review.rating}</p>
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    style={{
                                        color: "white",
                                        backgroundColor: "red",
                                        border: "none",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Delete Review
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default RestaurantList;


