import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema({
    participante1: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    participante2: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

export default model("Chat", chatSchema);
