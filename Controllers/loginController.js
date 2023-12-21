const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/userModel");
const {
    loginValidation,
    signupvalidation,
} = require("../Utilities/req-body-validation");
const { generateAuthToken } = require("../Utilities/authentication");

const signupUser = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        user: req.body.email,
        function_name: "signupUser",
        message: "Entered Function",
    });
    try {
        const { error, value } = signupvalidation.validate(req.body);
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
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            Logger.log("error", {
                code: "CONFLICT",
                message: "Existing user",
                function_name: " signupUser",
                reason: "User already exists",
                uuid: uuid,
                user: existingUser._id,
            });
            return res.status(409).json({
                error: "CONFLICT",
                message: `User ${username} already exists`,
            });
        }
        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        });
        Logger.log("info", {
            message: "User created successfully",
            uuid: uuid,
            user: user._id,
            function_name: "signupUser",
        });
        return res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        Logger.log("error", {
            code: error.name,
            message: "error while signing up user",
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
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "signupUser",
            message: "Exited Function",
        });
    }
};

const loginUser = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        user: req.body.email,
        function_name: "signupUser",
        message: "Entered Function",
    });
    try {
        const { error, value } = loginValidation.validate(req.body);
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "signupUser",
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

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            Logger.lof("error", {
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
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "signupUser",
            message: "Exited Function",
        });
    }
};

module.exports = {
    loginUser,
    signupUser,
};
