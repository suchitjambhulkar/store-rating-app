const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (userData) => {
    const { name, email, password, address } = userData;

    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES ($1, $2, $3, $4, 'USER')
         RETURNING id, name, email, address, role`,
        [name, email, hashedPassword, address]
    );

    return result.rows[0];
};

module.exports = {
    registerUser
};