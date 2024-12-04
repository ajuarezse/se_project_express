const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom validation function for URLs
const validateUrl = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    // Ensures strict URL validation
    return helpers.message("The field must be a valid URL");
  }
  return value;
};

// 1. Validation for creating a clothing item
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().custom(validateUrl).required().messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "cold", "warm").required().messages({
      "any.only": 'The "weather" field must be one of "hot", "cold", or "warm"',
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

// 2. Validation for creating a user
const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateUrl).required().messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. Validation for user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 4. Validation for IDs (user and clothing item IDs)
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.length": 'The "id" field must be 24 characters long',
      "string.hex": 'The "id" field must be a valid hexadecimal value',
      "string.empty": 'The "id" field must be filled in',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserCreation,
  validateUserLogin,
  validateId,
};
