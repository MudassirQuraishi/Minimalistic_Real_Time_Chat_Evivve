const { v4: uuidv4 } = require("uuid");
const Logger = require("../Utilities/logger");
const Message = require("../Models/messageModel");

const addMessage = async (socket, messageDetail) => {
    try {
        const { user } = socket;
        const { message, time } = messageDetail;
        await Message.create({
            message: message,
            sender_id: user._id,
            sender_name: user.username,
            time: time,
        });
        const messageDetails = {
            message: message,
            status: "received",
            name: user.username,
        };
        socket.broadcast.emit("receieve-message", messageDetails);
    } catch (error) {
        console.log(error);
    }
};
const previousMessages = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        user: req.user._id,
        function_name: "previousMessages",
        message: "Entered Function",
    });
    try {
        const { user } = req;
        const previousMessages = await Message.find()
            .sort({ createdAt: 1 })
            .lean();
        previousMessages.forEach((message) => {
            message.status =
                message.sender_id.toString() === user._id.toString()
                    ? "replied"
                    : "received";
        });
        Logger.log("info", {
            code: "OK",
            message: "Messages retrieved successfully",
            uuid: uuid,
            user: iser._id,
        });
        return res.status(200).json(previousMessages);
    } catch (error) {
        Logger.log("error", {
            code: error.name,
            message: "error while retrieving messages",
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
