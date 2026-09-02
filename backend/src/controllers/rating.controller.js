const { validationResult } = require("express-validator");
const ratingService = require("../services/rating.service");

const addOrUpdateRating = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { storeId, rating } = req.body;

    const result = await ratingService.addOrUpdateRating(
      req.user.id,
      storeId,
      rating,
    );

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addOrUpdateRating,
};
