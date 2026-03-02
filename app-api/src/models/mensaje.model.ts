import { Schema, model, Types } from "mongoose";

const mensajeSchema = new Schema(
    {
        chat: {
            type: Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        emisor: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        contenido: {
            type: String,
            required: true,
            maxlength: [2000, "El mensaje no puede superar 2000 caracteres"],
        },
        fecha: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default model("Mensaje", mensajeSchema);
