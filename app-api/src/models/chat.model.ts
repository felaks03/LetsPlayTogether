import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema(
    {
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
        ultimaActividad: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default model("Chat", chatSchema);
