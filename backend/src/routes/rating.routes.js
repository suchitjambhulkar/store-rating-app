const express = require("express");

const {
    addOrUpdateRating
} = require("../controllers/rating.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const {
    ratingValidator
} = require("../validators/rating.validator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    ratingValidator,
    addOrUpdateRating
);

module.exports = router;