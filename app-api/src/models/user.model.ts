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
  favoritos: {
    type: [String],
    default: [],
  },
  mensajes: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  online: {
    type: Boolean,
    default: false,
  },
  salaActual: {
    type: Types.ObjectId,
    ref: "Sala",
    default: null,
  },
});

export default model("User", userSchema);
