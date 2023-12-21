const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        sender_name: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
