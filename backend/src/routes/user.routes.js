const express = require("express");

const {
    updatePassword,
    createUser,
    getAllUsers,
    getAdminStats
} = require("../controllers/user.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const {
    authorize
} = require("../middleware/role.middleware");

const {
    passwordValidator,
    registerValidator
} = require("../validators/auth.validator");

const router = express.Router();


// =========================================
// LOGGED-IN USER
// UPDATE PASSWORD
// =========================================

router.put(
    "/password",
    authenticate,
    passwordValidator,
    updatePassword
);


// =========================================
// ADMIN
// CREATE USER
// =========================================

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    registerValidator,
    createUser
);


// =========================================
// ADMIN
// GET ALL USERS
// =========================================

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAllUsers
);


// =========================================
// ADMIN
// GET STATISTICS
// =========================================

router.get(
    "/stats",
    authenticate,
    authorize("ADMIN"),
    getAdminStats
);


module.exports = router;