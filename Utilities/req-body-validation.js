const Joi = require("joi");

/**
 * Joi schema for validating login credentials.
 */
const loginValidation = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }) // Validates email format
        .required(),
    password: Joi.string().min(6).required(), // Validates password with minimum length of 6 characters
});

/**
 * Joi schema for validating signup credentials.
 */
const signupValidation = Joi.object({
    username: Joi.string().required(), // Validates the presence of username
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }) // Validates email format
        .required(),
    password: Joi.string().min(6).required(), // Validates password with minimum length of 6 characters
});

module.exports = {
    loginValidation,
    signupValidation,
};
