import { Schema, model, Types } from "mongoose";

const mensajeSchema = new Schema({
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
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

export default model("Mensaje", mensajeSchema);
