import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    sessionId: {
        type: String,
        require: true,
        unique: true
    }
    ,
    participants: [
        {
            userId: { type: String, default: "" },
            socketId: { type: String, dafault: "" },
            name: { type: String, dafault: "" },
            photo: { type: String, default: "" },
            micon: { type: Boolean, default: false },
            videon: { type: Boolean, default: false }
        }
    ]
    ,
    createdAt: {
        type: Date,
        default: Date.now,
        expirs: "1d",
    }
})

export const Session = mongoose.model("Session", sessionSchema);