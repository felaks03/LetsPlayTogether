import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
    nick: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
    },
    foto: {
        type: String,
        default: "/assets/avatar-default.png",
    },
    redes: {
        twitter: { type: String, default: "" },
        discord: { type: String, default: "" },
        twitch: { type: String, default: "" },
    },
    favoritos: [
        {
            type: Types.ObjectId,
            ref: "Videojuego",
        },
    ],
    amigos: [
        {
            type: Types.ObjectId,
            ref: "User",
        },
    ],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

export default model("User", userSchema);
