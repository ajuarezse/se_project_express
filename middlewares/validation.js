const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (!value) {
    return value;
  }
  if (!validator.isURL(value)) {
    return helpers.message("The field must be a valid URL");
  }
  return value;
};

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional().allow("").messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string()
      .custom(validateUrl)
      .optional()
      .allow("", null)
      .default(
        "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr/avatar_0.jpg"
      )
      .messages({
        "string.uri": 'The "avatar" field must be a valid URL if provided',
      }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
  }),
});

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

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base":
          'The "itemId" must be a valid MongoDB ObjectId (24 hex characters)',
        "string.empty": 'The "itemId" field must be filled in',
        "any.required": 'The "itemId" field is required',
      }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().custom(validateUrl).optional(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base":
          'The "itemId" must be a valid MongoDB ObjectId (24 hex characters)',
        "string.empty": 'The "itemId" field must be filled in',
        "any.required": 'The "itemId" field is required',
      }),
  }),
});

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

module.exports = {
  validateClothingItem,
  validateUserCreation,
  validateUserLogin,
  validateId,
  validateUserUpdate,
  validateItemId,
};
