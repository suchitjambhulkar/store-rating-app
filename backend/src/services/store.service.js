const pool = require("../config/db");

const getAllStores = async (userId, search = "") => {
    const result = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating,
            MAX(
                CASE
                    WHEN r.user_id = $1 THEN r.rating
                    ELSE NULL
                END
            ) AS my_rating
         FROM stores s
         LEFT JOIN ratings r
            ON s.id = r.store_id
         WHERE s.name ILIKE $2
            OR s.address ILIKE $2
         GROUP BY s.id
         ORDER BY s.name ASC`,
        [userId, `%${search}%`]
    );

    return result.rows;
};


const createStore = async (storeData) => {
    const { name, email, address, ownerId } = storeData;

    if (ownerId) {
        const owner = await pool.query(
            `SELECT id FROM users WHERE id = $1 AND role = 'STORE_OWNER'`,
            [ownerId]
        );

        if (owner.rows.length === 0) {
            throw new Error("Owner must be an existing store owner");
        }
    }

    const result = await pool.query(
        `INSERT INTO stores (
            name,
            email,
            address,
            owner_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            name,
            email,
            address,
            owner_id`,
        [
            name,
            email,
            address,
            ownerId || null
        ]
    );

    return result.rows[0];
};


const getAllStoresForAdmin = async () => {
    const result = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            u.name AS owner_name,
            u.email AS owner_email,
            COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating
         FROM stores s
         LEFT JOIN users u
            ON s.owner_id = u.id
         LEFT JOIN ratings r
            ON s.id = r.store_id
         GROUP BY
            s.id,
            u.name,
            u.email
         ORDER BY s.id ASC`
    );

    return result.rows;
};


/* =========================================
   STORE OWNER DASHBOARD
========================================= */

const getOwnerDashboard = async (ownerId) => {

    // Find the store owned by the logged-in owner
    const storeResult = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating
         FROM stores s
         LEFT JOIN ratings r
            ON s.id = r.store_id
         WHERE s.owner_id = $1
         GROUP BY s.id`,
        [ownerId]
    );

    // Owner does not have a store
    if (storeResult.rows.length === 0) {
        return {
            store: null,
            ratings: []
        };
    }

    const store = storeResult.rows[0];

    // Get users who submitted ratings
    const ratingResult = await pool.query(
        `SELECT
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            r.rating,
            r.created_at,
            r.updated_at
         FROM ratings r
         INNER JOIN users u
            ON r.user_id = u.id
         WHERE r.store_id = $1
         ORDER BY r.rating DESC`,
        [store.id]
    );

    return {
        store,
        ratings: ratingResult.rows
    };
};


module.exports = {
    getAllStores,
    createStore,
    getAllStoresForAdmin,
    getOwnerDashboard
};