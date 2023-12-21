const Joi = require("joi");

const loginValidation = Joi.object({
    email: Joi.string()
        .email()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .required(),
    password: Joi.string().min(6).required(),
});
const signupvalidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
        .email()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .required(),
    password: Joi.string().min(6).required(),
});

module.exports = {
    loginValidation,
    signupvalidation,
};
