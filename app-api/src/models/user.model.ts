import { Schema, model, Types } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema(
    {
        nick: {
            type: String,
            required: true,
            minlength: [2, "El nick debe tener al menos 2 caracteres"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v: string) => emailRegex.test(v),
                message: "El email no tiene un formato válido",
            },
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        },
        edad: {
            type: Number,
            required: true,
            min: [1, "La edad debe ser al menos 1"],
        },
        foto: {
            type: String,
            default: "/avatars/2169.jpg",
        },
        redes: {
            twitter: { type: String, default: "" },
            discord: { type: String, default: "" },
            twitch: { type: String, default: "" },
            steam: { type: String, default: "" },
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
        salaActual: {
            type: Types.ObjectId,
            ref: "Sala",
            default: null,
        },
    },
    { timestamps: true }
);

export default model("User", userSchema);
