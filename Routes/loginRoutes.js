const express = require("express");
const router = express.Router();

// Import the login controller module
const loginController = require("../Controllers/loginController");

/**
 * @route POST /user/log-in
 * @description Logs in an existing user
 * @access Public
 * @param {Object} req - The request object containing user credentials
 * @param {Object} res - The response object
 * @returns {Object} - Returns a success message or error details based on the login process
 */
router.post("/log-in", loginController.loginUser);

/**
 * @route POST /user/sign-up
 * @description Registers a new user
 * @access Public
 * @param {Object} req - The request object containing user details
 * @param {Object} res - The response object
 * @returns {Object} - Returns a success message or error details based on the signup process
 */
router.post("/sign-up", loginController.signupUser);

module.exports = router;
