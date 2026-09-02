const { body } = require("express-validator");

const ratingValidator = [
    body("storeId")
        .isInt({ min: 1 })
        .withMessage("Store ID must be a valid number"),

    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5")
];

module.exports = {
    ratingValidator
};