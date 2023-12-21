const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const mongoose = require("mongoose");

function generateAuthToken(user) {
    const payload = {
        userId: user._id, // Use the user's _id from MongoDB
    };
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(payload, secretKey);
    return token;
}

async function authenticateToken(req, res, next) {
    try {
        const token = req.headers.authorization;

        const secretKey = process.env.JWT_SECRET_KEY;
        const decodedId = jwt.verify(token, secretKey);
        const user = await User.findOne({ _id: decodedId.userId });

        if (!user) {
            return res.status(404).json({ message: "errro" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
async function authenticateSocket(token) {
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded_id = jwt.verify(token, secretKey);
        const user = await User.findOne({ _id: decoded_id.userId });
        if (user) {
            return user;
        }
    } catch (error) {
        console.error("Error in authentication:", error);
    }
}
async function authenticateSocketToken(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        const secretKey = process.env.JWT_SECRET_KEY;
        const { userId } = jwt.verify(token, secretKey);
        const user = await User.findOne({ _id: userId });
        if (user) {
            socket.user = user;
            next();
        } else {
            console.log("User not found");
        }
    } catch (error) {}
}

module.exports = {
    generateAuthToken,
    authenticateSocket,
    authenticateToken,
    authenticateSocketToken,
};
