const { v4: uuidv4 } = require("uuid");
const Logger = require("../Utilities/logger");
const Message = require("../Models/messageModel");

/**
 * Adds a new message to the chat.
 * @param {object} socket - The socket object for the connection.
 * @param {object} messageDetail - Details of the message being sent.
 */
const addMessage = async (socket, messageDetail) => {
    try {
        const { user } = socket;
        const { message, time } = messageDetail;

        // Creating a new message
        await Message.create({
            message: message,
            sender_id: user._id,
            sender_name: user.username,
            time: time,
        });

        // Broadcasting the received message to other sockets
        const messageDetails = {
            message: message,
            status: "received",
            name: user.username,
        };
        socket.broadcast.emit("receive-message", messageDetails);
    } catch (error) {
        console.error(error);
    }
};

/**
 * Retrieves previous messages in the chat.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns the array of previous chat messages.
 */
const previousMessages = async (req, res) => {
    const uuid = uuidv4();

    // Logging function entrance
    Logger.log("info", {
        uuid: uuid,
        user: req.user._id,
        function_name: "previousMessages",
        message: "Entered Function",
    });

    try {
        const { user } = req;

        // Fetching previous messages and sorting by createdAt
        const previousMessages = await Message.find()
            .sort({ createdAt: 1 })
            .lean();

        // Modifying message status based on sender
        previousMessages.forEach((message) => {
            message.status =
                message.sender_id.toString() === user._id.toString()
                    ? "replied"
                    : "received";
        });

        // Logging successful message retrieval
        Logger.log("info", {
            code: "OK",
            message: "Messages retrieved successfully",
            uuid: uuid,
            user: user._id,
        });

        return res.status(200).json(previousMessages);
    } catch (error) {
        // Logging error while retrieving messages
        Logger.log("error", {
            code: error.name,
            message: "Error while retrieving messages",
            reason: error.message,
            uuid: uuid,
            user: req.user._id,
        });

        return res.status(500).json({
            message: "Retrieving messages failed",
            reason: error.message,
            code: error.name,
        });
    } finally {
        // Logging function exit
        Logger.log("info", {
            uuid: uuid,
            user: req.user._id,
            function_name: "previousMessages",
            message: "Exited Function",
        });
    }
};

module.exports = {
    addMessage,
    previousMessages,
};
