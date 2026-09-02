const pool = require("../config/db");

const addOrUpdateRating = async (userId, storeId, rating) => {
    const existingRating = await pool.query(
        `SELECT id
         FROM ratings
         WHERE user_id = $1 AND store_id = $2`,
        [userId, storeId]
    );

    if (existingRating.rows.length > 0) {
        const result = await pool.query(
            `UPDATE ratings
             SET rating = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $2
               AND store_id = $3
             RETURNING id, user_id, store_id, rating, updated_at`,
            [rating, userId, storeId]
        );

        return result.rows[0];
    }

    const result = await pool.query(
        `INSERT INTO ratings (user_id, store_id, rating)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, store_id, rating, created_at`,
        [userId, storeId, rating]
    );

    return result.rows[0];
};

module.exports = {
    addOrUpdateRating
};