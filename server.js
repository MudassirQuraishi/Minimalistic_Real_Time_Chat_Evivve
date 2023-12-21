// Third-party libraries
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    // Configure CORS for Socket.io
    cors: {
        // Define allowed origin for socket connections
        origin: ["http://127.0.0.1:5500"],
        // Define allowed HTTP methods
        methods: ["GET", "POST"],
        // Specify allowed headers for socket connections
        allowedHeaders: ["Authorization"],
        // Allow sending cookies (if applicable)
        credentials: true,
    },
});

// Middleware setup for Express app
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(helmet()); // Set various HTTP headers for enhanced security
// Additional CORS setup for the Express app (if needed)
app.use(
    cors({
        // Define allowed origins for Express endpoints
        origin: ["http://127.0.0.1:5500", "http://127.0.0.1:3000"],
        // Allow sending cookies (if applicable)
        credentials: true,
    })
);

// Local imports
const loginRoutes = require("./Routes/loginRoutes");
const apiRoutes = require("./Routes/apiRoutes");
const Logger = require("./Utilities/logger");
const { authenticateSocketToken } = require("./Utilities/authentication");
const { addMessage } = require("./Controllers/messageController");

// Routes for user authentication and API endpoints
app.use("/user", loginRoutes); // Handles user authentication (signup, login, etc.)
app.use("/api", apiRoutes); // Provides API endpoints for chat functionality

// Socket.io event handling for real-time communication
io.on("connection", (socket) => {
    // Authenticate incoming socket connection
    authenticateSocketToken(socket, (error) => {
        if (error) {
            Logger.log("error", {
                code: "AUTHENTICATION_ERROR",
                message: "Error while authenticating socket",
                function_name: "socket connection",
                details: error.message,
            });
            socket.disconnect(true); // Disconnect socket on authentication failure
        } else {
            Logger.log("info", {
                message: "Socket authentication successful",
            });

            // Handle "send-message" event when received from authenticated socket
            socket.on("send-message", (messageDetail) => {
                addMessage(socket, messageDetail);
            });
        }
    });
});

// Connect to MongoDB using Mongoose
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        const port = process.env.PORT || 3000;
        const databaseStartTime = new Date().toLocaleString();
        Logger.log("info", {
            message: `MongoDB server successfully connected on ${databaseStartTime}`,
        });

        // Start the server on the specified port
        server.listen(port, () => {
            const serverStartTime = new Date().toLocaleString();
            Logger.log("info", {
                message: `Backend server started at port ${port} on ${serverStartTime}`,
            });
        });
    })
    .catch((error) => {
        Logger.log("error", {
            code: "MONGOOSERROR",
            message: "Error while connecting to MongoDB server",
            function_name: "mongodb_connect",
            reason: "connection_failure",
            details: JSON.stringify(error.message),
        });
    });
