const express = require("express");

const {
    register,
    login
} = require("../controllers/auth.controller");

const {
    registerValidator
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    register
);

router.post(
    "/login",
    login
);

module.exports = router;