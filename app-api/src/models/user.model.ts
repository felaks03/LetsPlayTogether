import { Schema, model, Types } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

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
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            validate: {
                validator: (v: string) => passwordRegex.test(v),
                message:
                    "La contraseña debe tener al menos una letra y un número",
            },
        },
        edad: {
            type: Number,
            required: true,
            min: [1, "La edad debe ser al menos 1"],
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
    },
    { timestamps: true }
);

export default model("User", userSchema);
