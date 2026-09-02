const pool = require("../config/db");
const bcrypt = require("bcrypt");


// =========================================
// UPDATE PASSWORD
// =========================================

const updatePassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    await pool.query(
        `UPDATE users
         SET password = $1
         WHERE id = $2`,
        [hashedPassword, userId]
    );
};


// =========================================
// CREATE USER - ADMIN
// =========================================

const createUser = async (userData) => {
    const {
        name,
        email,
        password,
        address,
        role
    } = userData;

    // Check existing email
    const existingUser = await pool.query(
        `SELECT id
         FROM users
         WHERE email = $1`,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    // Only allow valid roles
    const allowedRoles = [
        "USER",
        "ADMIN",
        "STORE_OWNER"
    ];

    if (role && !allowedRoles.includes(role)) {
        throw new Error("Invalid user role");
    }

    const userRole = role || "USER";

    const result = await pool.query(
        `INSERT INTO users (
            name,
            email,
            password,
            address,
            role
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            name,
            email,
            address,
            role,
            created_at`,
        [
            name,
            email,
            hashedPassword,
            address,
            userRole
        ]
    );

    return result.rows[0];
};


// =========================================
// GET ALL USERS - ADMIN
// =========================================

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT
            id,
            name,
            email,
            address,
            role,
            (
                SELECT COALESCE(ROUND(AVG(r.rating), 2), 0)
                FROM stores s
                LEFT JOIN ratings r ON r.store_id = s.id
                WHERE s.owner_id = users.id
            ) AS owner_rating,
            created_at
         FROM users
         ORDER BY id ASC`
    );

    return result.rows;
};


// =========================================
// ADMIN STATISTICS
// =========================================

const getAdminStats = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM stores) AS total_stores,
            (SELECT COUNT(*) FROM ratings) AS total_ratings
    `);

    return result.rows[0];
};


module.exports = {
    updatePassword,
    createUser,
    getAllUsers,
    getAdminStats
};