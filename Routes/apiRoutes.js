const express = require("express");
const router = express.Router();
const { previousMessages } = require("../Controllers/messageController");
const { authenticateToken } = require("../Utilities/authentication");

router.get("/get-messages", authenticateToken, previousMessages);

module.exports = router;
