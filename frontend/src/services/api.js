const API_URL = "https://store-rating-app-08t0.onrender.com/api";

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
};

export const loginUser = async (loginData) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    return response.json();
};

export const getStores = async (token, search = "") => {
    const query = encodeURIComponent(search.trim());
    const response = await fetch(`${API_URL}/stores?search=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.json();
};

export const submitRating = async (token, storeId, rating) => {
    const response = await fetch(`${API_URL}/ratings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            storeId,
            rating
        })
    });

    return response.json();
};

export const updatePassword = async (token, password) => {
    const response = await fetch(`${API_URL}/users/password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            password
        })
    });

    return response.json();
};

export const getUsers = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.json();
};

export const getAdminStats = async (token) => {
    const response = await fetch(`${API_URL}/users/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.json();
};

export const createStore = async (token, storeData) => {
    const response = await fetch(`${API_URL}/stores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(storeData)
    });

    return response.json();
};

export const getAdminStores = async (token) => {
    const response = await fetch(`${API_URL}/stores/admin`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.json();
};

export const createUser = async (token, userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });

    return response.json();
};

export const getOwnerDashboard = async (token) => {
    const response = await fetch(`${API_URL}/stores/owner`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.json();
};