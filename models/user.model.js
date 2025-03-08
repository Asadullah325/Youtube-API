import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    channelName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    logoID: {
        type: String,
        required: true,
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedChannels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
        }
    ]
}, { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;