const express = require("express");
const router = express.Router();

// Import necessary controller and authentication utilities
const { previousMessages } = require("../Controllers/messageController");
const { authenticateToken } = require("../Utilities/authentication");

/**
 * @route GET /get-messages
 * @description Retrieves previous messages from the chat
 * @access Private
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - Returns previous messages or an error if authentication fails
 */
router.get("/get-messages", authenticateToken, previousMessages);

// Export the router for use in other modules
module.exports = router;
