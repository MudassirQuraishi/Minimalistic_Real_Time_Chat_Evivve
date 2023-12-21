const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/userModel");
const {
    loginValidation,
    signupValidation,
} = require("../Utilities/req-body-validation");
const { generateAuthToken } = require("../Utilities/authentication");
const Logger = require("../Utilities/logger");

/**
 * Registers a new user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns a JSON response indicating successful user creation or an error message.
 */
const signupUser = async (req, res) => {
    const uuid = uuidv4();

    // Log entry into the function
    Logger.log("info", {
        uuid: uuid,
        user: req.body.email,
        function_name: "signupUser",
        message: "Entered Function",
    });

    try {
        const { error, value } = signupValidation.validate(req.body);

        // Handling validation errors
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "signupUser",
                reason: "Missing Inputs",
                uuid: uuid,
                user: value.userId,
                details: error.message,
            });
            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "Missing Credentials",
                details: error.message,
            });
        }

        const { username, email, password } = value;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            Logger.log("error", {
                code: "CONFLICT",
                message: "Existing user",
                function_name: "signupUser",
                reason: "User already exists",
                uuid: uuid,
                user: existingUser._id,
            });
            return res.status(409).json({
                error: "CONFLICT",
                message: `User ${username} already exists`,
            });
        }

        // Hash the password and create a new user
        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        });

        // Log successful user creation
        Logger.log("info", {
            code: "CREATED",
            message: "User created successfully",
            uuid: uuid,
            user: user._id,
            function_name: "signupUser",
        });
        return res.status(201).json({
            code: "CREATED",
            message: "User created successfully",
        });
    } catch (error) {
        // Log error during user creation
        Logger.log("error", {
            code: error.name,
            message: "Error while signing up user",
            reason: error.message,
            uuid: uuid,
            user: req.body.email,
        });
        return res.status(500).json({
            message: "User creation failed",
            reason: error.message,
            code: error.name,
        });
    } finally {
        // Log exit from the function
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "signupUser",
            message: "Exited Function",
        });
    }
};

/**
 * Logs in an existing user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns a JSON response indicating successful login or an error message.
 */
const loginUser = async (req, res) => {
    const uuid = uuidv4();

    // Log entry into the function
    Logger.log("info", {
        uuid: uuid,
        user: req.body.email,
        function_name: "loginUser",
        message: "Entered Function",
    });

    try {
        const { error, value } = loginValidation.validate(req.body);

        // Handling validation errors
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "loginUser",
                reason: "Missing Inputs",
                uuid: uuid,
                user: value.email,
                details: error.message,
            });
            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "Missing Credentials",
                details: error.message,
            });
        }

        const { email, password } = value;

        // Find the user in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            Logger.log("error", {
                code: "NOT_FOUND",
                message: "User not found",
                function_name: "loginUser",
                reason: "No user data found in the database",
                uuid: uuid,
                user: email,
            });
            return res.status(404).json({
                code: "NOT_FOUND",
                success: false,
                message: "User Not Found",
            });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "Invalid password",
                function_name: "loginUser",
                uuid: uuid,
                user: user._id,
            });
            return res.status(400).json({
                code: "BAD_REQUEST",
                message: "Password Mismatch",
                success: false,
            });
        }

        // Password matches, generate JWT token and send a successful response
        const jwtToken = generateAuthToken(user);
        Logger.log("info", {
            code: "OK",
            message: "User logged in successfully",
            uuid: uuid,
            user: user._id,
        });
        return res.status(200).json({
            code: "OK",
            message: "Logged in successfully",
            success: true,
            encryptedId: jwtToken,
            username: user.username,
        });
    } catch (error) {
        // Log error during user login
        Logger.log("error", {
            code: error.name,
            message: "Error while Logging in",
            reason: error.message,
            uuid: uuid,
            user: req.body.email,
        });
        return res.status(500).json({
            message: "User log in failed",
            reason: error.message,
            code: error.name,
        });
    } finally {
        // Log exit from the function
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "loginUser",
            message: "Exited Function",
        });
    }
};

module.exports = {
    loginUser,
    signupUser,
};
