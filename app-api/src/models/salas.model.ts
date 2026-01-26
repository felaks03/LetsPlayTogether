import { Schema, model, Types, Document } from "mongoose";

// Interface TypeScript para tipado
export interface ISala extends Document {
  nombre: string;
  estado: "OPEN" | "IN_GAME" | "FULL" | "CLOSED";
  videojuego: Types.ObjectId;
  host: Types.ObjectId;
  usuarios: Types.ObjectId[];
  maxUsuarios: number;
  creadoEn: Date;
  expiraEn?: Date;
}

const SalaSchema = new Schema<ISala>({
  nombre: {
    type: String,
    required: true,
  },

  estado: {
    type: String,
    enum: ["OPEN", "IN_GAME", "FULL", "CLOSED"],
    default: "OPEN",
  },

  videojuego: {
    type: Types.ObjectId,
    ref: "Videojuego",
    required: true,
  },

  host: {
    type: Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  usuarios: [
    {
      type: Types.ObjectId,
      ref: "Usuario",
    },
  ],

  maxUsuarios: {
    type: Number,
    default: 4,
  },

  creadoEn: {
    type: Date,
    default: Date.now,
  },

  expiraEn: {
    type: Date,
  },
});

export default model<ISala>("Sala", SalaSchema);
