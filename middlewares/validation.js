const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom validation function for URLs
const validateUrl = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message("The field must be a valid URL");
  }
  return value;
};

// 1. Validation for creating a clothing item
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().custom(validateUrl).required(),
    weather: Joi.string().valid("hot", "cold", "warm").required(),
  }),
});

// 2. Validation for creating a user
const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().custom(validateUrl).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// 3. Validation for user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// 4. Validation for IDs (user and clothing item IDs)
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserCreation,
  validateUserLogin,
  validateId,
};
