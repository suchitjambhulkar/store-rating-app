const express = require("express");

const {
    getAllStores,
    createStore,
    getAllStoresForAdmin,
    getOwnerDashboard
} = require("../controllers/store.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const {
    authorize
} = require("../middleware/role.middleware");

const { body } = require("express-validator");

const storeValidator = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 120 })
        .withMessage("Store name must be between 1 and 120 characters"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid store email"),
    body("address")
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage("Store address must be between 1 and 400 characters"),
    body("ownerId")
        .optional({ values: "falsy" })
        .isInt({ min: 1 })
        .withMessage("Owner ID must be a valid number")
];

const router = express.Router();


// =========================================
// GET ALL STORES
// =========================================

router.get(
    "/",
    authenticate,
    getAllStores
);


// =========================================
// CREATE STORE - ADMIN ONLY
// =========================================

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    storeValidator,
    createStore
);


// =========================================
// GET ALL STORES - ADMIN ONLY
// =========================================

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    getAllStoresForAdmin
);


// =========================================
// STORE OWNER DASHBOARD
// =========================================

router.get(
    "/owner",
    authenticate,
    authorize("STORE_OWNER"),
    getOwnerDashboard
);


module.exports = router;