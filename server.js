//Importing Libraries
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
require("dotenv").config();

const { authenticateSocketToken } = require("./Utilities/authentication");
const Logger = require("./Utilities/logger");
const { addMessage } = require("./Controllers/messageController");

const loginRoutes = require("./Routes/loginRoutes");
const apiRoutes = require("./Routes/apiRoutes");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ["http://127.0.0.1:5500"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true,
    },
});
app.use(bodyParser.json());
app.use(
    cors({
        origin: ["http://127.0.0.1:5500", "http://127.0.0.1:3000"],
        credentials: true,
    })
);

app.use("/user", loginRoutes);
app.use("/api", apiRoutes);
// app.use("/api/user", userRoutes);

io.on("connection", (socket) => {
    authenticateSocketToken(socket, (error) => {
        if (error) {
            Logger.log("error", {
                code: "AUTHENTICATION_ERROR",
                message: "Error while authenticaing socket",
                function_name: "socket connection",
                deatils: error.message,
            });
            socket.disconnect(true); // Disconnect socket on authentication failure
        } else {
            Logger.log("info", {
                message: "Socket authentication succesfull",
            });
            socket.on("send-message", (messageDetail) => {
                addMessage(socket, messageDetail);
            });
        }
    });
});

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        const port = process.env.PORT || 3000;
        const databaseStartTime = new Date().toLocaleString();
        Logger.log("info", {
            message: `MongoDB server succesfully connected on ${databaseStartTime}`,
        });
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
            message: "error while connecting to mongoDB server",
            function_name: "mongodb_connect",
            reason: "connection_failure",
            details: JSON.stringify(error.message),
        });
    });
