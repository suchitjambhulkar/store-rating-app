const express = require("express");

const {
    register
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

module.exports = router;