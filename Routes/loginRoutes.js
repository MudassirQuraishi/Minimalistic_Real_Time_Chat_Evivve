const express = require("express");
const router = express.Router();
const loginController = require("../Controllers/loginController");

router.post("/log-in", loginController.loginUser);
router.post("/sign-up", loginController.signupUser);

module.exports = router;
